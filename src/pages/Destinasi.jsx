import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import destinasi from '../data/destinasi'
import { trackDestinationClick } from '../lib/tracking'
import { useLanguage } from '../i18n/LanguageContext'

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
  const { t } = useLanguage()
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
      {/* HERO BACKGROUND */}
      <div className="page-hero page-hero-destinasi">
        <div className="section-container">
          <p className="section-subtitle">{t('dest.sub')}</p>
          <h1 className="section-title">{t('dest.title')}</h1>
          <p className="section-desc">
            {t('dest.desc', { count: destinasi.length })}
          </p>
        </div>
      </div>

      <div className="section-container">
        {/* Search */}
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder={t('dest.searchPh')}
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
              {k === 'Semua' ? t('dest.all') : k}
            </button>
          ))}
        </div>

        <div className="destinasi-count">
          {t('dest.showing')} <strong>{filtered.length}</strong> {t('dest.of')} {destinasi.length} {t('dest.destWord')}
        </div>

        <div className="destinasi-grid">
          {filtered.map((d, i) => {
            const fasilitasList = getFasilitasList(d.fasilitas)
            const detailTo = `/destinasi/${d.slug}`
            return (
              <div className="dest-card" key={i} onClick={() => trackDestinationClick(d)}>
                <Link to={detailTo} className="dest-image" aria-label={`Lihat detail ${d.nama}`}>
                  <img src={d.gambar} alt={d.nama} loading="lazy" />
                  <span className="dest-badge">{d.kategori}</span>
                  {d.rating && (
                    <span className="dest-rating">⭐ {d.rating}</span>
                  )}
                </Link>
                <div className="dest-body">
                  <h3 className="dest-name">
                    <Link to={detailTo}>{d.nama}</Link>
                  </h3>
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
                      <p className="fasilitas-title">{t('dest.fasilitas')}</p>
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
                    <p className="dest-ulasan">💬 {d.ulasan} {t('dest.reviews')}</p>
                  )}

                  <div className="dest-actions">
                    <Link to={detailTo} className="btn btn-sm">
                      {t('dest.detail')}
                    </Link>
                    {d.maps ? (
                      <a href={d.maps} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-ghost">
                        {t('dest.maps')}
                      </a>
                    ) : (
                      <button className="btn btn-sm btn-ghost" disabled style={{ opacity: 0.5 }}>
                        {t('dest.locInfo')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="empty-state">
            <p>{t('dest.empty')}</p>
            <button className="btn btn-sm" onClick={() => { setFilter('Semua'); setSearch('') }}>
              {t('dest.showAll')}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default Destinasi
