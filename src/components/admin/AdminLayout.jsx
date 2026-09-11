import { useState } from 'react'
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth'
import { ToastProvider, useToast } from './ui'

const MENU = [
  { to: '/panel-kj29xz', label: 'Dashboard', icon: '📊', end: true },
  { to: '/panel-kj29xz/destinasi', label: 'Destinasi', icon: '🗺️' },
  { to: '/panel-kj29xz/kategori', label: 'Kategori', icon: '🏷️' },
  { to: '/panel-kj29xz/statistik', label: 'Statistik Kunjungan', icon: '📈' },
]

function LogoutButton({ onNavigate }) {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  return (
    <button
      className="adm-btn adm-btn-ghost adm-logout"
      onClick={async () => {
        await logout()
        toast.success('Berhasil keluar.')
        onNavigate?.()
        navigate('/panel-kj29xz', { replace: true })
      }}
    >
      ⏻ Keluar
    </button>
  )
}

export default function AdminLayout() {
  const location = useLocation()
  // Di HP sidebar jadi drawer: dibuka lewat tombol hamburger di bar admin,
  // dan tertutup otomatis saat memilih menu (onClick NavLink) atau pindah halaman.
  const [menuOpen, setMenuOpen] = useState(false)
  const tutupMenu = () => setMenuOpen(false)

  return (
    <ToastProvider>
      <div className={`adm-layout ${menuOpen ? 'menu-open' : ''}`}>
        {/* Bar khusus HP: hamburger + judul, menempel di bawah navbar situs */}
        <div className="adm-mobilebar">
          <button
            className="adm-burger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Buka menu admin"
            aria-expanded={menuOpen}
          >
            <span className={`hamburger ${menuOpen ? 'open' : ''}`}></span>
          </button>
          <span className="adm-mobilebar-title">Panel Admin</span>
        </div>

        {/* Gelap-digelap layar saat drawer terbuka — tap untuk menutup */}
        <div
          className={`adm-scrim ${menuOpen ? 'show' : ''}`}
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />

        <aside className="adm-sidebar" aria-label="Menu admin">
          <div className="adm-sidebar-brand">
            <span className="adm-sidebar-title">Panel Admin</span>
            <small className="adm-muted">Purwakarta Wisata</small>
          </div>
          <nav className="adm-nav">
            {MENU.map((m) => (
              <NavLink
                key={m.to}
                to={m.to}
                end={m.end}
                onClick={tutupMenu}
                className={({ isActive }) => `adm-nav-item ${isActive ? 'active' : ''}`}
              >
                <span aria-hidden="true">{m.icon}</span> {m.label}
              </NavLink>
            ))}
          </nav>
          <LogoutButton onNavigate={() => setMenuOpen(false)} />
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
