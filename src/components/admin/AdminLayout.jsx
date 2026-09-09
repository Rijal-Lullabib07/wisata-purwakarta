import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { ToastProvider, useToast } from './ui'

const MENU = [
  { to: '/panel-kj29xz', label: 'Dashboard', icon: '📊', end: true },
  { to: '/panel-kj29xz/destinasi', label: 'Destinasi', icon: '🗺️' },
  { to: '/panel-kj29xz/kategori', label: 'Kategori', icon: '🏷️' },
  { to: '/panel-kj29xz/statistik', label: 'Statistik Kunjungan', icon: '📈' },
]

function LogoutButton() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  return (
    <button
      className="adm-btn adm-btn-ghost adm-logout"
      onClick={async () => {
        await logout()
        toast.success('Berhasil keluar.')
        navigate('/panel-kj29xz', { replace: true })
      }}
    >
      ⏻ Keluar
    </button>
  )
}

export default function AdminLayout() {
  const location = useLocation()
  return (
    <ToastProvider>
      <div className="adm-layout">
        <aside className="adm-sidebar">
          <div className="adm-sidebar-brand">
            <span className="adm-sidebar-title">Panel Admin</span>
            <small className="adm-muted">Purwakarta Wisata</small>
          </div>
          <nav className="adm-nav" aria-label="Menu admin">
            {MENU.map((m) => (
              <NavLink
                key={m.to}
                to={m.to}
                end={m.end}
                className={({ isActive }) => `adm-nav-item ${isActive ? 'active' : ''}`}
              >
                <span aria-hidden="true">{m.icon}</span> {m.label}
              </NavLink>
            ))}
          </nav>
          <LogoutButton />
        </aside>

        <main className="adm-main">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -14 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              style={{ minHeight: '100%' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </ToastProvider>
  )
}
