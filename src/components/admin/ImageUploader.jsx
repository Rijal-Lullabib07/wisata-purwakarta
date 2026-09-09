import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useImageUploader } from '../../hooks/useImageUploader'

/**
 * ImageUploader multi-gambar HD.
 * - Preview sebelum & sesudah upload
 * - Kompres HD otomatis di browser (max 1920px, WebP 0.85)
 * - Hapus gambar (opsional menghapus file dari Storage via onRemoveFile)
 */
export default function ImageUploader({ value = [], onChange, onRemoveFile }) {
  const inputRef = useRef(null)
  const { upload, uploading, progress, error } = useImageUploader()
  const [previews, setPreviews] = useState([])

  async function pilihFile(event) {
    const files = Array.from(event.target.files || [])
    if (!files.length) return
    setPreviews(files.map((f) => ({ nama: f.name, url: URL.createObjectURL(f) })))

    const hasil = await upload(files)
    setPreviews([])
    if (hasil.length) onChange([...value, ...hasil.map((h) => h.url)], hasil.map((h) => h.path))
    if (inputRef.current) inputRef.current.value = ''
  }

  async function hapus(index) {
    const url = value[index]
    const baru = value.filter((_, i) => i !== index)
    onChange(baru)
    const path = url?.split('/storage/v1/object/public/destinasi-galeri/')[1]
    if (path && onRemoveFile) await onRemoveFile(decodeURIComponent(path))
  }

  return (
    <div className="adm-uploader">
      <div
        className="adm-dropzone"
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={pilihFile}
        />
        {uploading ? (
          <div className="adm-upload-progress">
            <p>Mengunggah & mengompres (HD)… {progress}%</p>
            <div className="adm-progress-track">
              <motion.div
                className="adm-progress-fill"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        ) : (
          <>
            <span className="adm-dropzone-icon">📷</span>
            <p>Klik untuk pilih gambar (bisa banyak sekaligus)</p>
            <small>Kompres otomatis: maks 1920px, WebP — kualitas HD terjaga</small>
          </>
        )}
      </div>

      {error && <p className="adm-error" role="alert">{error}</p>}

      {(previews.length > 0 || value.length > 0) && (
        <div className="adm-preview-grid">
          {previews.map((p) => (
            <div key={p.nama} className="adm-preview-item adm-preview-pending">
              <img src={p.url} alt={p.nama} />
              <span className="adm-preview-badge">menunggu…</span>
            </div>
          ))}
          {value.map((url, i) => (
            <motion.div
              key={url}
              className="adm-preview-item"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <img src={url} alt={`Galeri ${i + 1}`} loading="lazy" />
              <button
                type="button"
                className="adm-preview-remove"
                onClick={() => hapus(i)}
                aria-label={`Hapus gambar ${i + 1}`}
              >
                ✕
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
