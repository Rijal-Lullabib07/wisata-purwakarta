import { useState } from 'react'
import { motion } from 'framer-motion'
import { useCategories } from '../../hooks/useCategories'
import { useToast, Modal } from '../../components/admin/ui'

export default function Categories() {
  const { categories, loading, create, update, remove } = useCategories()
  const toast = useToast()
  const [nama, setNama] = useState('')
  const [icon, setIcon] = useState('')
  const [edit, setEdit] = useState(null)
  const [busy, setBusy] = useState(false)

  async function tambah(e) {
    e.preventDefault()
    if (!nama.trim()) return
    setBusy(true)
    const { error } = await create({ name: nama.trim(), icon })
    setBusy(false)
    if (error) toast.error('Gagal menambah kategori (slug mungkin sudah ada).')
    else { toast.success('Kategori ditambahkan.'); setNama(''); setIcon('') }
  }

  async function simpanEdit() {
    setBusy(true)
    const { error } = await update(edit.id, { name: edit.name, icon: edit.icon })
    setBusy(false)
    if (error) toast.error('Gagal memperbarui kategori.')
    else { toast.success('Kategori diperbarui.'); setEdit(null) }
  }

  async function hapus(cat) {
    if (!window.confirm(`Hapus kategori "${cat.name}"? Destinasi dengan kategori ini tidak ikut terhapus.`)) return
    const { error } = await remove(cat.id)
    if (error) toast.error('Gagal menghapus kategori.')
    else toast.success('Kategori dihapus.')
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <div className="adm-page-head">
        <div>
          <h2>Kategori</h2>
          <p className="adm-muted">{categories.length} kategori</p>
        </div>
      </div>

      <form className="adm-filters" onSubmit={tambah}>
        <input className="adm-input" placeholder="Nama kategori baru…" value={nama} onChange={(e) => setNama(e.target.value)} aria-label="Nama kategori" />
        <input className="adm-input" placeholder="Ikon (emoji, opsional)" value={icon} onChange={(e) => setIcon(e.target.value)} aria-label="Ikon kategori" maxLength={4} style={{ maxWidth: 130 }} />
        <button className="adm-btn adm-btn-primary" disabled={busy || !nama.trim()}>Tambah</button>
      </form>

      {loading ? (
        <p className="adm-muted">Memuat…</p>
      ) : categories.length === 0 ? (
        <p className="adm-empty">Belum ada kategori — tambahkan yang pertama.</p>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead><tr><th>Ikon</th><th>Nama</th><th>Slug</th><th>Aksi</th></tr></thead>
            <tbody>
              {categories.map((c) => (
                <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td>{c.icon || '—'}</td>
                  <td><strong>{c.name}</strong></td>
                  <td className="adm-muted">{c.slug}</td>
                  <td>
                    <div className="adm-actions">
                      <button className="adm-btn adm-btn-sm adm-btn-ghost" onClick={() => setEdit({ ...c })}>Edit</button>
                      <button className="adm-btn adm-btn-sm adm-btn-danger" onClick={() => hapus(c)}>Hapus</button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={Boolean(edit)}
        title="Edit kategori"
        onClose={() => setEdit(null)}
        actions={
          <>
            <button className="adm-btn adm-btn-ghost" onClick={() => setEdit(null)} disabled={busy}>Batal</button>
            <button className="adm-btn adm-btn-primary" onClick={simpanEdit} disabled={busy || !edit?.name?.trim()}>Simpan</button>
          </>
        }
      >
        {edit && (
          <>
            <div className="adm-field">
              <label htmlFor="e-nama">Nama</label>
              <input id="e-nama" className="adm-input" value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} />
            </div>
            <div className="adm-field">
              <label htmlFor="e-icon">Ikon (emoji)</label>
              <input id="e-icon" className="adm-input" value={edit.icon || ''} onChange={(e) => setEdit({ ...edit, icon: e.target.value })} maxLength={4} />
            </div>
          </>
        )}
      </Modal>
    </motion.div>
  )
}
