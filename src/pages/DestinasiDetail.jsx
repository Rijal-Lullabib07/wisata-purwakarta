import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import destinasi from '../data/destinasi'
import { mapsDirectionsUrl } from '../lib/tracking'

const PUSAT = { latitude: -6.5569, longitude: 107.4430, nama: 'Pusat Kota Purwakarta' }

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

function haversineKm(a, b) {
  const R = 6371
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180
  const dLng = ((b.longitude - a.longitude) * Math.PI) / 180
  const lat1 = (a.latitude * Math.PI) / 180
  const lat2 = (b.latitude * Math.PI) / 180
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

const TABS = ['Ringkasan', 'Lokasi & Arah', 'Fasilitas', 'Jam Buka & Harga']

function FasilitasGrid({ fasilitas }) {
  const list = fasilitas
    ? Object.entries(fasilitas)
        .filter(([, v]) => v)
        .map(([key]) => ({ key, ...(fasilitasLabels[key] || { icon: '✅', label: key }) }))
    : []
  if (list.length === 0) return <p className="dest-desc">Belum ada data fasilitas.</p>
  return (
    <div className="fasilitas-grid">
      {list.map((f) => (
        <span key={f.key} className="fasilitas-badge">
          {f.icon} {f.label}
        </span>
      ))}
    </div>
  )
}

function InfoTab({ destination }) {
  return (
    <>
      <p className="dest-desc">{destination.deskripsi || 'Belum ada deskripsi.'}</p>
      <div className="detail-chip-row">
        {destination.kategori && <span className="dest-info-item">🏷️ {destination.kategori}</span>}
        {destination.kecamatan && <span className="dest-info-item">📍 {destination.kecamatan}</span>}
        {destination.rating && <span className="dest-info-item">⭐ {destination.rating}</span>}
        {destination.ulasan && <span className="dest-info-item">💬 {destination.ulasan} ulasan</span>}
      </div>
    </>
  )
}

function LokasiTab({ destination }) {
  const lat = destination.latitude
  const lng = destination.longitude
  const km = haversineKm(PUSAT, destination)
  const perkiraanMenit = Math.round((km / 40) * 60) // asumsi 40 km/jam

  return (
    <div className="detail-lokasi">
      <p className="dest-desc" style={{ marginBottom: 16 }}>
        {destination.alamat || `Kecamatan ${destination.kecamatan}, Purwakarta`}
      </p>

      <div className="map-embed">
        <iframe
          title={`Peta ${destination.nama}`}
          src={`https://maps.google.com/maps?q=${lat},${lng}&z=14&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        ></iframe>
      </div>

      <div className="route-box">
        <div className="route-stats">
          <div>
            <strong>± {km.toFixed(1)} km</strong>
            <span>dari pusat kota</span>
          </div>
          <div>
            <strong>± {perkiraanMenit} menit</strong>
            <span>berkendara (est.)</span>
          </div>
        </div>
        <ol className="route-steps">
          <li>
            Mulai dari <strong>Pusat Kota Purwakarta</strong> ({PUSAT.nama}).
          </li>
          <li>
            Ikuti jalan utama menuju arah <strong>Kecamatan {destination.kecamatan}</strong>.
          </li>
          <li>Ikuti petunjuk papan/GPS sampai lokasi {destination.nama}.</li>
        </ol>
        <a
          href={mapsDirectionsUrl(destination)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
          style={{ marginTop: 8 }}
        >
          🧭 Buka Rute di Google Maps
        </a>
      </div>
    </div>
  )
}

function FasilitasTab({ destination }) {
  return <FasilitasGrid fasilitas={destination.fasilitas} />
}

function JamHargaTab({ destination }) {
  const harga =
    destination.harga_tiket ||
    (destination.deskripsi && /tiket/i.test(destination.deskripsi)
      ? 'Lihat keterangan di deskripsi (harga bisa berubah)'
      : 'Belum ada info tiket — hubungi pengelola')
  return (
    <div className="jam-harga-list">
      <div className="jam-harga-item">
        <span className="jam-harga-icon">🕐</span>
        <div>
          <strong>Jam Operasional</strong>
          <p>{destination.jam || 'Setiap hari (hubungi pengelola)'}</p>
        </div>
      </div>
      <div className="jam-harga-item">
        <span className="jam-harga-icon">🎟️</span>
        <div>
          <strong>Harga Tiket</strong>
          <p>{harga}</p>
        </div>
      </div>
      {destination.telepon && (
        <div className="jam-harga-item">
          <span className="jam-harga-icon">📞</span>
          <div>
            <strong>Telepon</strong>
            <p>{destination.telepon}</p>
          </div>
        </div>
      )}
    </div>
  )
}

function DestinasiDetail() {
  const { slug } = useParams()
  const [tab, setTab] = useState('Ringkasan')

  const destination = useMemo(
    () => destinasi.find((d) => d.slug === slug) || null,
    [slug],
  )

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!destination) {
    return (
      <section className="page-section empty-state" style={{ paddingTop: 160 }}>
        <h2 style={{ marginBottom: 12 }}>Destinasi tidak ditemukan</h2>
        <Link to="/destinasi" className="btn btn-primary">
          Kembali ke Destinasi
        </Link>
      </section>
    )
  }

  const renderTab = () => {
    switch (tab) {
      case 'Lokasi & Arah': return <LokasiTab destination={destination} />
      case 'Fasilitas': return <FasilitasTab destination={destination} />
      case 'Jam Buka & Harga': return <JamHargaTab destination={destination} />
      default: return <InfoTab destination={destination} />
    }
  }

  return (
    <section className="page-section detail-page">
      <div className="section-container">
        <Link to="/destinasi" className="detail-back">
          ← Kembali ke Destinasi
        </Link>

        {/* HERO */}
        <div className="detail-hero">
          <img src={destination.gambar} alt={destination.nama} />
          <div className="detail-hero-overlay">
            <span className="dest-badge">{destination.kategori}</span>
            <h1 className="detail-title">{destination.nama}</h1>
            <p className="detail-subtitle">
              📍 {destination.kecamatan}
              {destination.rating && ` · ⭐ ${destination.rating}`}
            </p>
          </div>
        </div>

        {/* TABS */}
        <div className="detail-tabs" role="tablist">
          {TABS.map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              className={`detail-tab ${tab === t ? 'active' : ''}`}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="detail-content">{renderTab()}</div>
      </div>
    </section>
  )
}

export default DestinasiDetail
