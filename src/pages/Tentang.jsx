import { Link } from 'react-router-dom'

const sejarahItems = [
  {
    tahun: 'Abad ke-7',
    judul: 'Kerajaan Tarumanagara',
    deskripsi: 'Purwakarta merupakan bagian dari wilayah Kerajaan Tarumanagara, kerajaan Hindu tertua di Jawa Barat. Beberapa prasasta ditemukan di kawasan ini.',
  },
  {
    tahun: '1619',
    judul: 'Pengaruh Kesultanan Cirebon',
    deskripsi: 'Kawasan ini masuk dalam pengaruh Kesultanan Cirebon dan menjadi jalur perdagangan penting antara pesisir dan dataran tinggi.',
  },
  {
    tahun: '1826',
    judul: 'Era Kolonial Belanda',
    deskripsi: 'Pembangunan Waduk Jatiluhur dimulai oleh pemerintah Hindia Belanda sebagai proyek irigasi terbesar di Asia Tenggara pada masanya.',
  },
  {
    tahun: '2001',
    judul: 'Era Modern',
    deskripsi: 'Purwakarta mulai berkembang pesat sebagai kota wisata dengan berbagai inovasi program pariwisata berbasis budaya Sunda.',
  },
]

const budayaItems = [
  {
    icon: '🎶',
    judul: 'Seni Wayang Golek',
    deskripsi: 'Seni pewayangan khas Sunda yang menggunakan boneka kayu, menjadi warisan budaya tak benda nasional.',
  },
  {
    icon: '🍛',
    judul: 'Kuliner Khas',
    deskripsi: 'Soto Purwakarta, Lotek, Batagor, dan Nasi Timbel menjadi sajian wajib yang menggugah selera.',
  },
  {
    icon: '🎪',
    judul: 'Festival Budaya',
    deskripsi: 'Berbagai festival tahunan seperti Purwakarta Karnival dan Karnaval Kebudayaan Sunda menarik ribuan pengunjung.',
  },
  {
    icon: '🗣️',
    judul: 'Bahasa Sunda',
    deskripsi: 'Bahasa Sunda menjadi bahasa sehari-hari dengan filosofi "Silih Asuh, Silih Asuh" yang mencerminkan keramahan warganya.',
  },
]

function Tentang() {
  return (
    <section className="page-section tentang-page">
      {/* HERO TENTANG */}
      <div className="tentang-hero">
        <div className="section-container">
          <p className="section-subtitle">Mengenal Lebih Dekat</p>
          <h1 className="section-title" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>Kota Purwakarta</h1>
          <p className="section-desc" style={{ margin: '0 auto' }}>
            Kabupaten Purwakarta terletak di provinsi Jawa Barat, Indonesia. Dikenal dengan julukan
            <strong> "Kota Istimewa"</strong>, Purwakarta menyuguhkan perpaduan sempurna antara
            keindahan alam, warisan sejarah, dan kearifan lokal Sunda.
          </p>
        </div>
      </div>

      {/* FAKTA CEPAT */}
      <div className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <span className="stat-angka">876 km²</span>
            <span className="stat-label">Luas Wilayah</span>
          </div>
          <div className="stat-item">
            <span className="stat-angka">1M+</span>
            <span className="stat-label">Penduduk</span>
          </div>
          <div className="stat-item">
            <span className="stat-angka">17</span>
            <span className="stat-label">Kecamatan</span>
          </div>
          <div className="stat-item">
            <span className="stat-angka">284</span>
            <span className="stat-label">Desa & Kelurahan</span>
          </div>
        </div>
      </div>

      {/* SEJARAH */}
      <div className="tentang-section">
        <div className="section-container">
          <div className="section-header">
            <p className="section-subtitle">Perjalanan Waktu</p>
            <h2 className="section-title">Sejarah Purwakarta</h2>
          </div>
          <div className="timeline">
            {sejarahItems.map((item, i) => (
              <div className={`timeline-item ${i % 2 === 0 ? 'left' : 'right'}`} key={i}>
                <div className="timeline-content">
                  <span className="timeline-year">{item.tahun}</span>
                  <h3 className="timeline-title">{item.judul}</h3>
                  <p className="timeline-desc">{item.deskripsi}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BUDAYA */}
      <div className="tentang-section" style={{ background: 'var(--bg-dark)' }}>
        <div className="section-container">
          <div className="section-header">
            <p className="section-subtitle">Warisan Lokal</p>
            <h2 className="section-title">Budaya & Tradisi</h2>
            <p className="section-desc">
              Purwakarta kaya akan warisan budaya Sunda yang masih lestari hingga kini
            </p>
          </div>
          <div className="budaya-grid">
            {budayaItems.map((item, i) => (
              <div className="budaya-card" key={i}>
                <span className="budaya-icon">{item.icon}</span>
                <h3>{item.judul}</h3>
                <p>{item.deskripsi}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* KEUNGGULAN */}
      <div className="tentang-section">
        <div className="section-container tentang-grid">
          <div className="tentang-image">
            <div className="tentang-img-placeholder">
              <span>🏯</span>
              <p>Purwakarta</p>
            </div>
          </div>
          <div className="tentang-content">
            <p className="section-subtitle">Mengapa Purwakarta?</p>
            <h2 className="section-title">Keunggulan Kota Istimewa</h2>
            <p className="tentang-text">
              Purwakarta bukan sekadar kota kecil di Jawa Barat. Dengan kombinasi
              <strong> alam yang memesona</strong>, <strong>sejarah yang kaya</strong>, dan
              <strong> masyarakat yang ramah</strong>, Purwakarta menawarkan pengalaman wisata
              yang tak terlupakan.
            </p>
            <div className="tentang-highlights">
              <div className="highlight-item">
                <span className="highlight-icon">🌊</span>
                <div>
                  <strong>Waduk Jatiluhur</strong>
                  <p>Waduk terbesar di Jawa Barat</p>
                </div>
              </div>
              <div className="highlight-item">
                <span className="highlight-icon">🎭</span>
                <div>
                  <strong>Budaya Sunda</strong>
                  <p>Tari tradisional & kuliner khas</p>
                </div>
              </div>
              <div className="highlight-item">
                <span className="highlight-icon">🌿</span>
                <div>
                  <strong>Alam Asri</strong>
                  <p>Curug, gunung & hutan tropis</p>
                </div>
              </div>
              <div className="highlight-item">
                <span className="highlight-icon">🏗️</span>
                <div>
                  <strong>Pembangunan Modern</strong>
                  <p>Inovasi pariwisata berkelanjutan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <section className="cta-section">
        <div className="section-container">
          <div className="cta-content">
            <h2 className="section-title">Siap Menjelajahi?</h2>
            <p className="section-desc" style={{ margin: '0 auto 32px' }}>
              Lihat daftar lengkap destinasi wisata yang ada di Purwakarta.
            </p>
            <Link to="/destinasi" className="btn btn-primary">Lihat Destinasi</Link>
          </div>
        </div>
      </section>
    </section>
  )
}

export default Tentang
