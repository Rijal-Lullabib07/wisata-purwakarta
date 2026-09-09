import { supabase, isSupabaseReady, TABLES } from './supabase'
import { getVisitorId, getGeoInfo, parseUserAgent, hashIp } from './visitor'

export function slugify(text = '') {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
}

/**
 * Catat klik sebuah destinasi ke tabel `destination_clicks`.
 * Aman dipanggil berulang: bila Supabase belum dikonfigurasi → no-op.
 */
export async function trackDestinationClick(destination) {
  if (!isSupabaseReady || !destination) return

  try {
    const visitorId = getVisitorId()
    const [geo, { deviceType, browser, os }] = await Promise.all([
      getGeoInfo(),
      Promise.resolve(parseUserAgent()),
    ])
    const ipHash = geo.ip ? await hashIp(geo.ip) : null

    const payload = {
      destination_slug: destination.slug || slugify(destination.nama),
      destination_name: destination.nama,
      visitor_id: visitorId,
      ip_hash: ipHash,
      city: geo.city || null,
      country: geo.country || null,
      country_code: geo.country_code || null,
      device_type: deviceType,
      browser,
      os,
      user_agent: navigator.userAgent.slice(0, 500),
      referrer: document.referrer || null,
      page_url: window.location.href.slice(0, 1000),
    }

    const { error } = await supabase.from(TABLES.destinationClicks).insert(payload)
    if (error) console.warn('[tracking] gagal mencatat klik:', error.message)
  } catch (err) {
    console.warn('[tracking] error:', err)
  }
}

/** Klik tombol "Buka di Maps" — referrer diset agar tampil di log. */
export function openGoogleMaps(destination) {
  if (!destination) return
  const lat = destination.latitude
  const lng = destination.longitude
  const query = lat && lng ? `${lat},${lng}` : encodeURIComponent(destination.nama)
  const url = `https://www.google.com/maps/search/?api=1&query=${query}`
  window.open(url, '_blank', 'noopener,noreferrer')
}

/** Link rute (directions) dari pusat Purwakarta menuju destinasi. */
export function mapsDirectionsUrl(destination) {
  const origin = '-6.5569,107.4442' // pusat kota Purwakarta
  const dest =
    destination.latitude && destination.longitude
      ? `${destination.latitude},${destination.longitude}`
      : encodeURIComponent(destination.nama)
  return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}&travelmode=driving`
}
