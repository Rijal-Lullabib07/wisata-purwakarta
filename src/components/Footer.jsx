import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <img src="/logo.svg" alt="Purwakarta Wisata" className="brand-logo" />
          <span className="brand-text">Purwakarta <span className="brand-highlight">Wisata</span></span>
          <p className="footer-tagline">Kota Istimewa yang Menyimpan Sejuta Pesona</p>
        </div>
        <div className="footer-links">
          <h4>Navigasi</h4>
          <Link to="/">Beranda</Link>
          <Link to="/destinasi">Destinasi</Link>
          <Link to="/tentang">Tentang</Link>
          <Link to="/kontak">Kontak</Link>
        </div>
        <div className="footer-links">
          <h4>Destinasi Populer</h4>
          <Link to="/destinasi">Waduk Jatiluhur</Link>
          <Link to="/destinasi">Curug Cinulang</Link>
          <Link to="/destinasi">Situ Buleud</Link>
          <Link to="/destinasi">Taman Karilan</Link>
        </div>
        <div className="footer-links">
          <h4>Ikuti Kami</h4>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter / X</a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">YouTube</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 Pemerintah Kabupaten Purwakarta. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
