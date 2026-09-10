import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase, isSupabaseReady } from '../../lib/supabase'
import { useCategories } from '../../hooks/useCategories'
import { useImageUploader } from '../../hooks/useImageUploader'
import { useToast } from '../../components/admin/ui'
import ImageUploader from '../../components/admin/ImageUploader'

const KOSONG = {
  nama: '', deskripsi: '', kategori: '', kecamatan: '', alamat: '',
  latitude: '', longitude: '', harga_tiket: '', jam_operasional: '',
  telepon: '', rating: '', maps_url: '', galeri: [], storage_paths: [],
  meta_title: '', meta_description: '', is_published: true,
}

function buatSlug(nama) {
  return nama.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/[\s_]+/g, '-').replace(/-+/g, '-')
}

export default function DestinationForm() {
  const { id } = useParams() // ada = mode edit
  const navigate = useNavigate()
  const toast = useToast()
  const { categories, refresh: refreshKategori } = useCategories()
  const { removeFile } = useImageUploader()

  const [form, setForm] = useState(KOSONG)
  const [loading, setLoading] = useState(Boolean(id))
  const [busy, setBusy] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!id || !isSupabaseReady) return
    ;(async () => {
      const { data } = await supabase.from('destinations').select('*').eq('id', id).maybeSingle()
      if (data) {
        /* Kolom teks dari DB bisa NULL → input React jadi uncontrolled
           (warning "value prop on input should not be null"). Normalisasi
           semua field teks ke string kosong. */
        const TEKS = [
          'nama', 'slug', 'deskripsi', 'kategori', 'kecamatan', 'alamat',
          'latitude', 'longitude', 'harga_tiket', 'jam_operasional',
          'telepon', 'rating', 'maps_url', 'meta_title', 'meta_description',
        ]
        const bersih = { ...KOSONG, ...data }
        for (const k of TEKS) {
          if (bersih[k] === null || bersih[k] === undefined) bersih[k] = ''
        }
        bersih.galeri = Array.isArray(data.galeri) ? data.galeri : []
        bersih.storage_paths = Array.isArray(data.storage_paths) ? data.storage_paths : []
        setForm(bersih)
      }
      setLoading(false)
    })()
  }, [id])

  function set(field, nilai) {
    setForm((f) => ({ ...f, [field]: nilai }))
    setErrors((e) => ({ ...e, [field]: undefined }))
  }

  function validasi() {
    const e = {}
    /* Semua field dibaca null-safe: baris dari DB bisa punya deskripsi/alamat
       NULL, dan .trim() pada null dulu melempar TypeError yang membuat tombol
       Simpan mati total tanpa pesan apa pun. */
    const nama = String(form.nama || '').trim()
    const deskripsi = String(form.deskripsi || '').trim()
    const alamat = String(form.alamat || '').trim()
    const telepon = String(form.telepon || '').trim()
    if (!nama) e.nama = 'Nama wajib diisi.'
    else if (nama.length < 3) e.nama = 'Nama minimal 3 karakter.'
    if (!deskripsi) e.deskripsi = 'Deskripsi wajib diisi.'
    if (!form.kategori) e.kategori = 'Kategori wajib dipilih.'
    if (!alamat) e.alamat = 'Alamat wajib diisi.'
    if (form.latitude && Number.isNaN(Number(form.latitude))) e.latitude = 'Latitude harus angka.'
    if (form.longitude && Number.isNaN(Number(form.longitude))) e.longitude = 'Longitude harus angka.'
    if (form.rating && (Number(form.rating) < 0 || Number(form.rating) > 5)) e.rating = 'Rating 0–5.'
    if (telepon && !/^[0-9+\-\s()]{6,20}$/.test(telepon)) e.telepon = 'Format telepon tidak valid.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function simpan(event) {
    event.preventDefault()
    if (busy) return // cegah dobel-submit
    if (!isSupabaseReady) {
      toast.error('Supabase belum dikonfigurasi — isi VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY di .env.')
      return
    }
    if (!validasi()) {
      toast.error('Periksa kembali form — ada isian yang belum benar.')
      return
    }
    setBusy(true)

    try {
      const baris = {
        nama: String(form.nama || '').trim(),
        slug: String(form.slug || '').trim() || buatSlug(String(form.nama || '')),
        deskripsi: form.deskripsi ?? null,
        kategori: form.kategori || null,
        kecamatan: form.kecamatan || null,
        alamat: form.alamat || null,
        latitude: form.latitude ? Number(form.latitude) : null,
        longitude: form.longitude ? Number(form.longitude) : null,
        harga_tiket: form.harga_tiket || null,
        jam_operasional: form.jam_operasional || null,
        telepon: form.telepon || null,
        rating: form.rating ? Number(form.rating) : null,
        maps_url: form.maps_url || null,
        galeri: Array.isArray(form.galeri) ? form.galeri : [],
        storage_paths: Array.isArray(form.storage_paths) ? form.storage_paths : [],
        meta_title: form.meta_title || null,
        meta_description: form.meta_description || null,
        is_published: Boolean(form.is_published),
      }

      const { error } = id
        ? await supabase.from('destinations').update(baris).eq('id', id)
        : await supabase.from('destinations').insert(baris)

      if (error) {
        // Tampilkan pesan asli supaya masalah (RLS/slug/dll) terlihat jelas
        const pesan =
          error.code === '23505'
            ? 'Slug sudah dipakai destinasi lain.'
            : `Gagal menyimpan: ${error.message || 'error tidak diketahui'}`
        console.error('[DestinationForm] supabase error:', error)
        toast.error(pesan)
        return
      }

      toast.success(id ? 'Perubahan tersimpan.' : 'Destinasi baru dibuat.')
      navigate('/panel-kj29xz/destinasi')
    } catch (err) {
      // Dulu: exception di sini mati senyap → tombol terkunci & "tidak ada reaksi".
      console.error('[DestinationForm] gagal menyimpan:', err)
      toast.error(`Terjadi kesalahan: ${err?.message || err}`)
    } finally {
      setBusy(false) // SELALU pulihkan tombol, apa pun hasilnya
    }
  }

  if (loading) return <p className="adm-muted">Memuat data destinasi…</p>

  return (
    <form className="adm-form" onSubmit={simpan} noValidate>
      <div className="adm-page-head">
        <h2>{id ? 'Edit Destinasi' : 'Destinasi Baru'}</h2>
      </div>

      <div className="adm-form-grid">
        <div className="adm-field">
          <label htmlFor="f-nama">Nama *</label>
          <input id="f-nama" className={`adm-input ${errors.nama ? 'is-invalid' : ''}`} value={form.nama}
            onChange={(e) => { set('nama', e.target.value); if (!form.slug && !id) set('slug', buatSlug(e.target.value)) }} />
          {errors.nama && <small className="adm-error">{errors.nama}</small>}
        </div>

        <div className="adm-field">
          <label htmlFor="f-slug">Slug (URL)</label>
          <input id="f-slug" className="adm-input" value={form.slug || ''} onChange={(e) => set('slug', e.target.value)} placeholder="otomatis dari nama" />
        </div>

        <div className="adm-field">
          <label htmlFor="f-kategori">Kategori *</label>
          <select id="f-kategori" className={`adm-input ${errors.kategori ? 'is-invalid' : ''}`} value={form.kategori} onChange={(e) => set('kategori', e.target.value)}>
            <option value="">— pilih kategori —</option>
            {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
          {errors.kategori && <small className="adm-error">{errors.kategori}</small>}
        </div>

        <div className="adm-field">
          <label htmlFor="f-kec">Kecamatan</label>
          <input id="f-kec" className="adm-input" value={form.kecamatan || ''} onChange={(e) => set('kecamatan', e.target.value)} />
        </div>

        <div className="adm-field adm-field-full">
          <label htmlFor="f-alamat">Alamat *</label>
          <input id="f-alamat" className={`adm-input ${errors.alamat ? 'is-invalid' : ''}`} value={form.alamat} onChange={(e) => set('alamat', e.target.value)} />
          {errors.alamat && <small className="adm-error">{errors.alamat}</small>}
        </div>

        <div className="adm-field adm-field-full">
          <label htmlFor="f-desc">Deskripsi *</label>
          <textarea id="f-desc" className={`adm-input ${errors.deskripsi ? 'is-invalid' : ''}`} rows={4} value={form.deskripsi} onChange={(e) => set('deskripsi', e.target.value)} />
          {errors.deskripsi && <small className="adm-error">{errors.deskripsi}</small>}
        </div>

        <div className="adm-field">
          <label htmlFor="f-lat">Latitude</label>
          <input id="f-lat" className={`adm-input ${errors.latitude ? 'is-invalid' : ''}`} value={form.latitude ?? ''} onChange={(e) => set('latitude', e.target.value)} placeholder="-6.5569" inputMode="decimal" />
          {errors.latitude && <small className="adm-error">{errors.latitude}</small>}
        </div>

        <div className="adm-field">
          <label htmlFor="f-lng">Longitude</label>
          <input id="f-lng" className={`adm-input ${errors.longitude ? 'is-invalid' : ''}`} value={form.longitude ?? ''} onChange={(e) => set('longitude', e.target.value)} placeholder="107.4442" inputMode="decimal" />
          {errors.longitude && <small className="adm-error">{errors.longitude}</small>}
        </div>

        <div className="adm-field">
          <label htmlFor="f-harga">Kisaran harga</label>
          <input id="f-harga" className="adm-input" value={form.harga_tiket || ''} onChange={(e) => set('harga_tiket', e.target.value)} placeholder="Rp 10.000 / orang" />
        </div>

        <div className="adm-field">
          <label htmlFor="f-jam">Jam operasional</label>
          <input id="f-jam" className="adm-input" value={form.jam_operasional || ''} onChange={(e) => set('jam_operasional', e.target.value)} placeholder="Setiap hari 07.30-17.30" />
        </div>

        <div className="adm-field">
          <label htmlFor="f-tel">Telepon</label>
          <input id="f-tel" className={`adm-input ${errors.telepon ? 'is-invalid' : ''}`} value={form.telepon || ''} onChange={(e) => set('telepon', e.target.value)} />
          {errors.telepon && <small className="adm-error">{errors.telepon}</small>}
        </div>

        <div className="adm-field">
          <label htmlFor="f-rating">Rating (0–5)</label>
          <input id="f-rating" className={`adm-input ${errors.rating ? 'is-invalid' : ''}`} value={form.rating ?? ''} onChange={(e) => set('rating', e.target.value)} inputMode="decimal" />
          {errors.rating && <small className="adm-error">{errors.rating}</small>}
        </div>

        <div className="adm-field adm-field-full">
          <label htmlFor="f-maps">URL Google Maps</label>
          <input id="f-maps" className="adm-input" value={form.maps_url || ''} onChange={(e) => set('maps_url', e.target.value)} />
        </div>

        <div className="adm-field adm-field-full">
          <label>Galeri gambar (HD)</label>
          <ImageUploader
            value={form.galeri}
            onRemoveFile={removeFile}
            onChange={(galeri, paths) => {
              setForm((f) => ({
                ...f,
                galeri,
                storage_paths: paths?.length ? [...(f.storage_paths || []), ...paths] : f.storage_paths,
              }))
            }}
          />
        </div>

        <details className="adm-field adm-field-full adm-seo">
          <summary>SEO (opsional)</summary>
          <div className="adm-field" style={{ marginTop: 10 }}>
            <label htmlFor="f-mt">Meta title</label>
            <input id="f-mt" className="adm-input" value={form.meta_title || ''} onChange={(e) => set('meta_title', e.target.value)} />
          </div>
          <div className="adm-field">
            <label htmlFor="f-md">Meta description</label>
            <textarea id="f-md" className="adm-input" rows={2} value={form.meta_description || ''} onChange={(e) => set('meta_description', e.target.value)} />
          </div>
        </details>

        <div className="adm-field adm-field-full">
          <label className="adm-check">
            <input type="checkbox" checked={form.is_published} onChange={(e) => set('is_published', e.target.checked)} />
            <span>Ter-publish (tampil di situs publik)</span>
          </label>
        </div>
      </div>

      <div className="adm-form-actions">
        <button type="button" className="adm-btn adm-btn-ghost" onClick={() => navigate('/panel-kj29xz/destinasi')} disabled={busy}>Batal</button>
        <button type="submit" className="adm-btn adm-btn-primary" disabled={busy}>{busy ? 'Menyimpan…' : 'Simpan'}</button>
      </div>
    </form>
  )
}
