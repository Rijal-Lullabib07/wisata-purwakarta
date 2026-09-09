import { AnimatePresence, motion } from 'framer-motion'
import { createContext, useCallback, useContext, useState } from 'react'

/* ============================== TOAST ============================== */

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const push = useCallback((pesan, tipe = 'success') => {
    const id = Date.now() + Math.random()
    setToasts((list) => [...list, { id, pesan, tipe }])
    setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), 3500)
  }, [])

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="adm-toast-wrap">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              className={`adm-toast adm-toast-${t.tipe}`}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.22 }}
              role="status"
            >
              {t.pesan}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const push = useContext(ToastContext)
  return {
    success: (pesan) => push?.(pesan, 'success'),
    error: (pesan) => push?.(pesan, 'error'),
  }
}

/* ============================== MODAL ============================== */

export function Modal({ open, title, onClose, children, actions }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="adm-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="adm-modal"
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="adm-modal-head">
              <h3>{title}</h3>
              <button className="adm-btn-icon" onClick={onClose} aria-label="Tutup">✕</button>
            </div>
            <div className="adm-modal-body">{children}</div>
            {actions && <div className="adm-modal-actions">{actions}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ============================ SKELETON ============================ */

export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div className="adm-skeleton-wrap" aria-hidden="true">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="adm-skeleton-row">
          {Array.from({ length: cols }).map((__, c) => (
            <div key={c} className="adm-skeleton-bone" style={{ animationDelay: `${(r * cols + c) * 60}ms` }} />
          ))}
        </div>
      ))}
    </div>
  )
}

/* =========================== CONFIRM DELETE =========================== */

export function ConfirmModal({ open, nama, onCancel, onConfirm, busy }) {
  return (
    <Modal
      open={open}
      title="Konfirmasi"
      onClose={onCancel}
      actions={
        <>
          <button className="adm-btn adm-btn-ghost" onClick={onCancel} disabled={busy}>Batal</button>
          <button className="adm-btn adm-btn-danger" onClick={onConfirm} disabled={busy}>
            {busy ? 'Memproses…' : 'Ya, jadikan draft'}
          </button>
        </>
      }
    >
      <p>
        Jadikan <strong>{nama}</strong> draft? Destinasi akan hilang dari situs publik,
        tetapi datanya tetap tersimpan (soft delete) dan bisa di-publish lagi.
      </p>
    </Modal>
  )
}
