import { useState, useMemo } from 'react'
import destinasi from '../data/destinasi'

const fasilitasLabels = {
  toilet: { icon: '🚻', label: 'Toilet' },
  mushola: { icon: '🕌', label: 'Mushola' },
  parkir: { icon: '🅿️', label: 'Parkir' },
  warung: { icon: '🍜', label: 'Warung/Kafe' },
  wifi: { icon: '📶', label: 'WiFi' },
  penginapan: { icon: '🏨', label: 'Penginapan' },
  kolamRenang: { icon: '🏊', label: 'Kolam Renang' },
  camping: { icon: '⛺', label: 'Camping' },
  joggingTrack: { icon: '🏃', label: 'Jogging Track' },
  flyingFox: { icon: '🪂', label: 'Flying Fox' },
  areaBBQ: { icon: '🔥', label: 'Area BBQ' },
  sewaPerahu: { icon: '⛵', label: 'Sewa Perahu' },
  playground: { icon: '🎠', label: 'Playground' },
}

function getFasilitasList(fasilitas) {
  if (!fasilitas) return []
  return Object.entries(fasilitas)
    .filter(([, v]) => v)
    .map(([key]) => ({ key, ...fasilitasLabels[key] || { icon: '✅', label: key } }))
}

function Destinasi() {
  const [filter, setFilter] = useState('Semua')
  const [search, setSearch] = useState('')

  const kategoriList = useMemo(() => ['Semua', ...new Set(destinasi.map(d => d.kategori))], [])

  const filtered = useMemo(() => {
    return destinasi.filter(d => {
      const matchKategori = filter === 'Semua' || d.kategori === filter
      const matchSearch = search === '' ||
        d.nama.toLowerCase().includes(search.toLowerCase()) ||
        d.kecamatan.toLowerCase().includes(search.toLowerCase()) ||
        d.alamat.toLowerCase().includes(search.toLowerCase())
      return matchKategori && matchSearch
    })
  }, [filter, search])

  return (
    <section className="page-section destinasi-section">
      <div className="section-container">
        <div className="section-header">
          <p className="section-subtitle">Jelajahi Semua Tempat</p>
          <h2 className="section-title">Destinasi Wisata</h2>
          <p className="section-desc">
            {destinasi.length} destinasi wisata di Kabupaten Purwakarta. Gunakan filter dan pencarian untuk menemukan wisata sesuai minat Anda.
          </p>
        </div>

        {/* Search */}
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Cari destinasi, kecamatan, atau alamat..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-input"
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch('')}>✕</button>
          )}
        </div>

        <div className="filter-bar">
          {kategoriList.map(k => (
            <button
              key={k}
              className={`filter-btn ${filter === k ? 'active' : ''}`}
              onClick={() => setFilter(k)}
            >
              {k}
            </button>
          ))}
        </div>

        <div className="destinasi-count">
          Menampilkan <strong>{filtered.length}</strong> dari {destinasi.length} destinasi
        </div>

        <div className="destinasi-grid">
          {filtered.map((d, i) => {
            const fasilitasList = getFasilitasList(d.fasilitas)
            return (
              <div className="dest-card" key={i}>
                <div className="dest-image">
                  <img src={d.gambar} alt={d.nama} loading="lazy" />
                  <span className="dest-badge">{d.kategori}</span>
                  {d.rating && (
                    <span className="dest-rating">⭐ {d.rating}</span>
                  )}
                </div>
                <div className="dest-body">
                  <h3 className="dest-name">{d.nama}</h3>
                  <p className="dest-kecamatan">📍 {d.kecamatan}</p>
                  <p className="dest-desc">{d.deskripsi}</p>
                  <div className="dest-info">
                    {d.alamat && <span className="dest-info-item">🗺️ {d.alamat}</span>}
                    {d.jam && <span className="dest-info-item">🕐 {d.jam}</span>}
                    {d.telepon && <span className="dest-info-item">📞 {d.telepon}</span>}
                  </div>

                  {/* Fasilitas */}
                  {fasilitasList.length > 0 && (
                    <div className="fasilitas-section">
                      <p className="fasilitas-title">Fasilitas:</p>
                      <div className="fasilitas-grid">
                        {fasilitasList.map(f => (
                          <span key={f.key} className="fasilitas-badge" title={f.label}>
                            {f.icon} {f.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {d.ulasan && (
                    <p className="dest-ulasan">💬 {d.ulasan} ulasan</p>
                  )}
                  {d.maps ? (
                    <a href={d.maps} target="_blank" rel="noopener noreferrer" className="btn btn-sm">
                      Buka di Maps →
                    </a>
                  ) : (
                    <button className="btn btn-sm" disabled style={{ opacity: 0.5 }}>
                      Info Lokasi
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="empty-state">
            <p>Tidak ada destinasi yang cocok dengan pencarian Anda.</p>
            <button className="btn btn-sm" onClick={() => { setFilter('Semua'); setSearch('') }}>
              Tampilkan Semua
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default Destinasi
