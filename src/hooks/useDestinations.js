import { useCallback, useEffect, useState } from 'react'
import { supabase, isSupabaseReady } from '../lib/supabase'
import destinasiStatis from '../data/destinasi'

const PAGE_SIZE = 10

/**
 * Daftar destinasi untuk admin panel (termasuk draft).
 * Pagination server-side + search + filter kategori/status.
 */
export function useAdminDestinations({ page = 1, search = '', kategori = '', status = '' } = {}) {
  const [rows, setRows] = useState([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    if (!isSupabaseReady) {
      setRows([])
      setCount(0)
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    let query = supabase
      .from('destinations')
      .select('id, slug, nama, kategori, kecamatan, alamat, rating, ulasan, is_published, updated_at, galeri', { count: 'exact' })
      .order('updated_at', { ascending: false })
      .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)
    if (search) query = query.ilike('nama', `%${search}%`)
    if (kategori) query = query.eq('kategori', kategori)
    if (status === 'published') query = query.eq('is_published', true)
    if (status === 'draft') query = query.eq('is_published', false)

    const { data, error: err, count: total } = await query
    if (err) setError(err.message)
    setRows(data || [])
    setCount(total || 0)
    setLoading(false)
  }, [page, search, kategori, status])

  useEffect(() => {
    const t = setTimeout(refresh, 250) // debounce untuk search
    return () => clearTimeout(t)
  }, [refresh])

  return { rows, count, pages: Math.max(1, Math.ceil(count / PAGE_SIZE)), loading, error, refresh, PAGE_SIZE }
}

/** Ubah baris DB ke bentuk yang dipakai komponen publik (fallback statis). */
export function dbRowToDestinasi(row) {
  return {
    nama: row.nama,
    deskripsi: row.deskripsi,
    gambar: Array.isArray(row.galeri) && row.galeri.length ? row.galeri[0] : '',
    galeri: row.galeri || [],
    kategori: row.kategori,
    kecamatan: row.kecamatan,
    alamat: row.alamat,
    latitude: row.latitude,
    longitude: row.longitude,
    rating: row.rating,
    ulasan: row.ulasan,
    telepon: row.telepon,
    jam: row.jam_operasional,
    maps: row.maps_url,
    harga: row.harga_tiket,
    fasilitas: row.fasilitas || {},
    slug: row.slug,
  }
}

/**
 * Destinasi ter-publish untuk halaman publik — dari DB, fallback ke statis.
 * Fallback aktif bila DB belum dikonfigurasi, error, atau kosong.
 */
export function usePublicDestinations() {
  const [destinasi, setDestinasi] = useState(destinasiStatis)
  const [sumber, setSumber] = useState('statis')

  useEffect(() => {
    if (!isSupabaseReady) return
    let active = true
    ;(async () => {
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .eq('is_published', true)
        .order('nama')
      if (!active) return
      if (!error && data && data.length > 0) {
        setDestinasi(data.map(dbRowToDestinasi))
        setSumber('db')
      }
    })()
    return () => { active = false }
  }, [])

  return { destinasi, sumber }
}
