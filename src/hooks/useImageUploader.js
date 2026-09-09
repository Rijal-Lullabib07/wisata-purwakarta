import { useCallback, useState } from 'react'
import { supabase, isSupabaseReady } from '../lib/supabase'

const BUCKET = 'destinasi-galeri'
const MAX_DIM = 1920 // HD — jangan dikompres di bawah ini
const QUALITY = 0.85

/** Kompres ringan di browser: skala max 1920px, WebP kualitas 0.85 (HD terjaga). */
async function compressHd(file) {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, MAX_DIM / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, 'image/webp', QUALITY),
  )
  return blob || file
}

function safeName(name) {
  return name.toLowerCase().replace(/[^a-z0-9.]+/g, '-').slice(-60)
}

/**
 * Hook upload multi-gambar ke Supabase Storage.
 * Mengembalikan { upload, uploading, progress, error }.
 * upload(files) -> array of { url, path } siap disimpan ke kolom galeri.
 */
export function useImageUploader() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)

  const upload = useCallback(async (files) => {
    setError(null)
    if (!isSupabaseReady) {
      setError('Supabase belum dikonfigurasi.')
      return []
    }
    setUploading(true)
    setProgress(0)
    const hasil = []
    try {
      const list = Array.from(files || [])
      for (let i = 0; i < list.length; i++) {
        const file = list[i]
        if (!file.type.startsWith('image/')) continue
        const blob = await compressHd(file)
        const ext = blob.type === 'image/webp' ? 'webp' : (file.name.split('.').pop() || 'jpg')
        const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName(file.name.replace(/\.[^.]+$/, ''))}.${ext}`
        const { error: upErr } = await supabase.storage
          .from(BUCKET)
          .upload(path, blob, { contentType: blob.type, upsert: false })
        if (upErr) throw upErr
        const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(path)
        hasil.push({ url: publicUrl, path })
        setProgress(Math.round(((i + 1) / list.length) * 100))
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
    return hasil
  }, [])

  /** Hapus file dari storage (dipanggil saat menghapus gambar dari form). */
  const removeFile = useCallback(async (path) => {
    if (!path || !isSupabaseReady) return
    await supabase.storage.from(BUCKET).remove([path])
  }, [])

  return { upload, removeFile, uploading, progress, error }
}
