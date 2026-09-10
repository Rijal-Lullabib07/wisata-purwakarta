import { useCallback, useEffect, useState } from 'react'
import { supabase, isSupabaseReady } from '../lib/supabase'
import destinasiStatis from '../data/destinasi'

const PAGE_SIZE = 10

const slugify = (text = '') =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')

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

/**
 * Ubah 1 destinasi statis (src/data/destinasi.js) ke bentuk baris tabel
 * `destinations`. Dipakai fitur import massal di panel admin.
 */
export function destinasiStatisToRow(d) {
  return {
    slug: d.slug || slugify(d.nama),
    nama: d.nama,
    kategori: d.kategori || null,
    kecamatan: d.kecamatan || null,
    deskripsi: d.deskripsi || null,
    alamat: d.alamat || null,
    latitude: d.latitude ?? null,
    longitude: d.longitude ?? null,
    jam_operasional: d.jam || null,
    telepon: d.telepon || null,
    rating: d.rating ?? null,
    ulasan: d.ulasan ?? null,
    fasilitas: d.fasilitas || {},
    galeri: d.gambar ? [d.gambar] : [],
    maps_url: d.maps || null,
    is_published: true,
  }
}

/**
 * Import massal destinasi statis (60 item) ke DB.
 * - on-conflict slug → di-skip (DO NOTHING) supaya data yang sudah diedit
 *   admin tidak tertimpa.
 * - Mengembalikan jumlah baris baru yang benar-benar ditambahkan.
 */
export async function importStatisKeDb() {
  if (!isSupabaseReady) return { inserted: 0, error: new Error('Supabase belum dikonfigurasi.') }
  const rows = destinasiStatis.map(destinasiStatisToRow)
  const { data, error } = await supabase
    .from('destinations')
    .upsert(rows, { onConflict: 'slug', ignoreDuplicates: true })
    .select('id')
  if (error) return { inserted: 0, error }
  return { inserted: (data || []).length, error: null }
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
}/**
 * Destinasi ter-publish untuk halaman publik.
 * - DB belum siap/error  → tampilkan data statis (60 destinasi) supaya situs
 *   tidak pernah kosong.
 * - DB berisi sebagian   → GABUNGkan: baris DB ditampilkan duluan, lalu
 *   destinasi statis yang slug-nya belum ada di DB (jadi 60 selalu tampil,
 *   apa pun isi DB — tanpa duplikat).
 * - DB berisi semua 60   → murni data DB (hasil CRUD admin).
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
      if (error || !data) return // tetap statis
      const fromDb = data.map(dbRowToDestinasi)
      const slugsDb = new Set(fromDb.map((d) => d.slug).filter(Boolean))
      const sisastatis = destinasiStatis.filter((d) => !slugsDb.has(d.slug))
      const gabungan = [...fromDb, ...sisastatis]
      setDestinasi(gabungan)
      setSumber(fromDb.length === 0 ? 'statis' : sisastatis.length > 0 ? 'db+statis' : 'db')
    })()
    return () => { active = false }
  }, [])

  return { destinasi, sumber }
}
