import { Link } from 'react-router-dom'

/**
 * Halaman 404 — dipakai BERSAMA oleh:
 *  1. Route "*" (halaman publik yang memang tidak ada)
 *  2. Route admin saat pengunjung belum terotorisasi
 * Tujuannya: tampilan 404 palsu dan 404 sungguhan identik piksel demi piksel,
 * sehingga keberadaan route admin tidak bisa dideteksi dengan membandingkan keduanya.
 */
export default function NotFound() {
  return (
    <section className="page-section empty-state" style={{ paddingTop: 110, textAlign: 'center' }}>
      <svg
        width="180"
        height="120"
        viewBox="0 0 180 120"
        fill="none"
        aria-hidden="true"
        style={{ margin: '0 auto 12px', display: 'block', color: 'var(--text, inherit)' }}
      >
        {/* ilustrasi "tersesat": planet dengan cincin + bintang */}
        <circle cx="90" cy="62" r="34" stroke="currentColor" strokeWidth="3" opacity="0.25" />
        <ellipse cx="90" cy="62" rx="52" ry="14" stroke="#2dd4a7" strokeWidth="3" opacity="0.8" />
        <circle cx="90" cy="62" r="10" fill="#2dd4a7" opacity="0.85" />
        <circle cx="24" cy="28" r="2.5" fill="currentColor" opacity="0.5" />
        <circle cx="156" cy="24" r="2" fill="currentColor" opacity="0.4" />
        <circle cx="146" cy="96" r="2.5" fill="currentColor" opacity="0.5" />
        <circle cx="30" cy="92" r="2" fill="currentColor" opacity="0.4" />
      </svg>
      <h2 style={{ margin: '8px 0' }}>404 Not Found</h2>
      <p>Halaman yang kamu cari tidak ditemukan atau sudah dipindahkan.</p>
      <Link to="/" className="btn btn-primary" style={{ marginTop: 12 }}>
        Kembali ke Beranda
      </Link>
    </section>
  )
}
