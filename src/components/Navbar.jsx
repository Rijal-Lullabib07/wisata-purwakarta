import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const links = [
    { path: '/', label: 'Beranda' },
    { path: '/destinasi', label: 'Destinasi' },
    { path: '/tentang', label: 'Tentang' },
    { path: '/kontak', label: 'Kontak' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand" onClick={() => setMenuOpen(false)}>
          <img src="/logo.svg" alt="Purwakarta Wisata" className="brand-logo" />
          <span className="brand-text">Purwakarta <span className="brand-highlight">Wisata</span></span>
        </Link>
        <button className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span className={`hamburger ${menuOpen ? 'open' : ''}`}></span>
        </button>
        <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
          {links.map(link => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={isActive(link.path) ? 'active' : ''}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
