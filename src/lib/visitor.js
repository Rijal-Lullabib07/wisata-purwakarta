// ============================================================================
// Visitor identification — anonim & privasi-friendly.
// - visitor_id: random session id disimpan di localStorage (bukan cookie)
// - IP tidak pernah disimpan mentah; di-hash sha-256 lalu hanya kota/negara
//   yang dikirim via layanan geolokasi publik (ipapi.co).
// ============================================================================

const VISITOR_KEY = 'pw_visitor_id'
const GEO_KEY = 'pw_geo_cache'

function randomId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return 'v-' + Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export function getVisitorId() {
  try {
    let id = localStorage.getItem(VISITOR_KEY)
    if (!id) {
      id = randomId()
      localStorage.setItem(VISITOR_KEY, id)
    }
    return id
  } catch {
    return randomId()
  }
}

/** Hash sha-256 sebuah string (hex). Tidak bisa di-reverse → privasi terjaga. */
export async function hashIp(ip) {
  try {
    if (!ip || typeof crypto === 'undefined' || !crypto.subtle) return null
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ip))
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
  } catch {
    return null
  }
}

/**
 * Ambil info geografis (kota/negara) dari IP publik browser.
 * Hasil di-cache di sessionStorage supaya tidak memanggil API berulang-ulang.
 * Gagal/tanpa internet → mengembalikan objek kosong (tidak memblokir tracking).
 */
export async function getGeoInfo() {
  try {
    const cached = sessionStorage.getItem(GEO_KEY)
    if (cached) return JSON.parse(cached)

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 4000)
    const res = await fetch('https://ipapi.co/json/', { signal: controller.signal })
    clearTimeout(timer)
    if (!res.ok) return {}

    const data = await res.json()
    const geo = {
      ip: data.ip || null,
      city: data.city || null,
      country: data.country_name || null,
      country_code: data.country_code || null,
    }
    try { sessionStorage.setItem(GEO_KEY, JSON.stringify(geo)) } catch { /* noop */ }
    return geo
  } catch {
    return {}
  }
}

/** Deteksi tipe device + browser + OS dari user agent. */
export function parseUserAgent(ua = navigator.userAgent) {
  const u = ua.toLowerCase()
  const deviceType = /ipad|tablet/.test(u)
    ? 'tablet'
    : /mobi|android|iphone|ipod/.test(u)
      ? 'mobile'
      : 'desktop'

  let browser = 'unknown'
  if (/edg\//.test(u)) browser = 'Edge'
  else if (/opr\//.test(u) || /opera/.test(u)) browser = 'Opera'
  else if (/chrome|crios/.test(u)) browser = 'Chrome'
  else if (/firefox|fxios/.test(u)) browser = 'Firefox'
  else if (/safari/.test(u)) browser = 'Safari'

  let os = 'unknown'
  if (/windows/.test(u)) os = 'Windows'
  else if (/android/.test(u)) os = 'Android'
  else if (/iphone|ipad|ipod/.test(u)) os = 'iOS'
  else if (/mac os x/.test(u)) os = 'macOS'
  else if (/linux/.test(u)) os = 'Linux'

  return { deviceType, browser, os }
}
