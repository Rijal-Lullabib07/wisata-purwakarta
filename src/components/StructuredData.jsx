import { useEffect } from 'react'

/**
 * Structured data schema.org untuk halaman destinasi.
 * Google pakai ini buat paham konten wisata — bisa muncul di rich results.
 */
export default function StructuredData({ dest }) {
  if (!dest) return null

  const data = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: dest.nama,
    description: dest.deskripsi || undefined,
    address: {
      '@type': 'PostalAddress',
      addressLocality: dest.kecamatan,
      addressCountry: 'ID',
    },
    geo: dest.latitude && dest.longitude
      ? {
          '@type': 'GeoCoordinates',
          latitude: dest.latitude,
          longitude: dest.longitude,
        }
      : undefined,
    telephone: dest.telepon || undefined,
    openingHours: dest.jam || undefined,
    image: dest.gambar || undefined,
    aggregateRating: dest.rating && dest.ulasan
      ? {
          '@type': 'AggregateRating',
          ratingValue: dest.rating,
          reviewCount: dest.ulasan,
        }
      : undefined,
  }

  // Hapus properti undefined biar JSON lebih bersih
  Object.keys(data).forEach((key) => {
    if (data[key] === undefined) delete data[key]
  })

  useEffect(() => {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify(data, null, 2)
    document.head.appendChild(script)
    return () => {
      document.head.removeChild(script)
    }
  }, [data])

  return null
}
