import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase, isSupabaseReady } from '../../lib/supabase'
import { useAdminDestinations } from '../../hooks/useDestinations'
import { useCategories } from '../../hooks/useCategories'
import { useToast, TableSkeleton, ConfirmModal } from '../../components/admin/ui'
import { useImageUploader } from '../../hooks/useImageUploader'

export default function Destinations() {
  const navigate = useNavigate()
  const toast = useToast()
  const { removeFile } = useImageUploader()
  const { categories } = useCategories()

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [kategori, setKategori] = useState('')
  const [status, setStatus] = useState('')
  const [selected, setSelected] = useState(new Set())
  const [hapusTarget, setHapusTarget] = useState(null)
  const [busy, setBusy] = useState(false)

  const { rows, count, pages, loading, refresh } = useAdminDestinations({ page, search, kategori, status })

  async function togglePublish(id, nilai) {
    const { error } = await supabase.from('destinations').update({ is_published: nilai }).eq('id', id)
    if (error) toast.error('Gagal mengubah status.')
    else toast.success(nilai ? 'Destinasi di-publish.' : 'Destinasi dijadikan draft.')
    refresh()
  }

  async function softDelete() {
    if (!hapusTarget) return
    setBusy(true)
    const { error } = await supabase
      .from('destinations')
      .update({ is_published: false })
      .eq('id', hapusTarget.id)
    setBusy(false)
    setHapusTarget(null)
    if (error) toast.error('Gagal mengubah status.')
    else toast.success('Destinasi dijadikan draft (soft delete).')
    refresh()
  }

  async function bulkPublish(nilai) {
    if (!selected.size) return
    setBusy(true)
    const { error } = await supabase
      .from('destinations')
      .update({ is_published: nilai })
      .in('id', [...selected])
    setBusy(false)
    setSelected(new Set())
    if (error) toast.error('Bulk update gagal.')
    else toast.success(`${selected.size} destinasi di-${nilai ? 'publish' : 'draft'}-kan.`)
    refresh()
  }

  function toggleSelect(id) {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  if (!isSupabaseReady) {
    return <p className="adm-empty">Supabase belum dikonfigurasi — CRUD tidak tersedia.</p>
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <div className="adm-page-head">
        <div>
          <h2>Destinasi</h2>
          <p className="adm-muted">{count} destinasi terdaftar</p>
        </div>
        <Link to="/panel-kj29xz/destinasi/baru" className="adm-btn adm-btn-primary">+ Destinasi Baru</Link>
      </div>

      <div className="adm-filters">
        <input
          className="adm-input"
          placeholder="Cari nama destinasi…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          aria-label="Cari destinasi"
        />
        <select className="adm-input" value={kategori} onChange={(e) => { setKategori(e.target.value); setPage(1) }} aria-label="Filter kategori">
          <option value="">Semua kategori</option>
          {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
        <select className="adm-input" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }} aria-label="Filter status">
          <option value="">Semua status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {selected.size > 0 && (
        <motion.div
          className="adm-bulkbar"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span>{selected.size} dipilih</span>
          <button className="adm-btn adm-btn-sm adm-btn-primary" disabled={busy} onClick={() => bulkPublish(true)}>Publish</button>
          <button className="adm-btn adm-btn-sm adm-btn-ghost" disabled={busy} onClick={() => bulkPublish(false)}>Jadikan draft</button>
        </motion.div>
      )}

      {loading ? (
        <TableSkeleton rows={6} cols={5} />
      ) : rows.length === 0 ? (
        <p className="adm-empty">Tidak ada destinasi yang cocok.</p>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th><input type="checkbox" aria-label="Pilih semua"
                  checked={rows.length > 0 && rows.every((r) => selected.has(r.id))}
                  onChange={(e) => setSelected(e.target.checked ? new Set(rows.map((r) => r.id)) : new Set())} /></th>
                <th>Nama</th>
                <th>Kategori</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <motion.tr
                  key={r.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.18 }}
                >
                  <td><input type="checkbox" checked={selected.has(r.id)} onChange={() => toggleSelect(r.id)} aria-label={`Pilih ${r.nama}`} /></td>
                  <td>
                    <div className="adm-cell-name">
                      {r.galeri?.[0] && <img src={r.galeri[0]} alt="" className="adm-thumb" loading="lazy" />}
                      <div>
                        <strong>{r.nama}</strong>
                        <small className="adm-muted d-block">{r.kecamatan || '—'}</small>
                      </div>
                    </div>
                  </td>
                  <td>{r.kategori || '—'}</td>
                  <td>{r.rating ? `${r.rating} ★` : '—'}</td>
                  <td>
                    <span className={`adm-badge ${r.is_published ? 'adm-badge-ok' : 'adm-badge-draft'}`}>
                      {r.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td>
                    <div className="adm-actions">
                      <button className="adm-btn adm-btn-sm adm-btn-ghost" onClick={() => togglePublish(r.id, !r.is_published)}>
                        {r.is_published ? 'Unpublish' : 'Publish'}
                      </button>
                      <Link className="adm-btn adm-btn-sm adm-btn-ghost" to={`/panel-kj29xz/destinasi/${r.id}/edit`}>Edit</Link>
                      <button className="adm-btn adm-btn-sm adm-btn-danger" onClick={() => setHapusTarget(r)}>Hapus</button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pages > 1 && (
        <div className="adm-pagination">
          <button className="adm-btn adm-btn-sm adm-btn-ghost" disabled={page <= 1} onClick={() => setPage(page - 1)}>← Sebelumnya</button>
          <span>Halaman {page} dari {pages}</span>
          <button className="adm-btn adm-btn-sm adm-btn-ghost" disabled={page >= pages} onClick={() => setPage(page + 1)}>Berikutnya →</button>
        </div>
      )}

      <ConfirmModal
        open={Boolean(hapusTarget)}
        nama={hapusTarget?.nama}
        busy={busy}
        onCancel={() => setHapusTarget(null)}
        onConfirm={softDelete}
      />
    </motion.div>
  )
}
