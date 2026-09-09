// Angka pariwisata terbaru dari BPS WebAPI (opsional).
//
// Cara kerja:
// - Jika secret BPS_API_KEY tersedia → ambil daftar rilis berita (press release)
//   domain 3214 (Kab. Purwakarta), lalu ekstrak angka TPK hotel dan Wisnus
//   dari judul rilis terbaru. Hasil selalu dilengkapi label periode.
// - Jika tidak ada key / API gagal → kembalikan angka statis terverifikasi
//   agar halaman penyamar tetap tampil wajar.
//
// Set key (opsional): supabase secrets set BPS_API_KEY=... (dari webapi.bps.go.id)

const corsBase = (Deno.env.get('APP_ORIGIN') ?? '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean)

function corsFor(request: Request): Record<string, string> {
  const origin = request.headers.get('origin') ?? ''
  const isLocal = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
  const hasDevEntry = corsBase.some((o) => /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(o))
  return {
    'Access-Control-Allow-Origin': corsBase.includes(origin) || (isLocal && hasDevEntry) ? origin : '',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    Vary: 'Origin',
  }
}

/** Angka statis terverifikasi (rilis resmi BPS Kab. Purwakarta). */
const FALLBACK = {
  wisnus: { nilai: '389,13 ribu', periode: 'Maret 2026' },
  tpk: { nilai: '37,04%', periode: 'Juli 2025' },
  sumber: 'BPS Kabupaten Purwakarta (rilis resmi)',
}

Deno.serve(async (request) => {
  const cors = corsFor(request)
  if (request.method === 'OPTIONS') return new Response('ok', { headers: cors })

  const result = { ...FALLBACK, live: false }
  try {
    const key = Deno.env.get('BPS_API_KEY')
    if (key) {
      const res = await fetch(
        'https://webapi.bps.go.id/v1/api/list/model/pressrelease/domain/3214/keyword/pariwisata/key/' + key + '/',
        { signal: AbortSignal.timeout(8000) },
      )
      if (res.ok) {
        const data = await res.json()
        for (const rilis of data?.data?.[0]?.pressrelease ?? []) {
          const judul = String(rilis.title ?? '')
          const isi = judul + ' ' + String(rilis.abstract ?? '')
          const tpkMatch = isi.match(/TPK[^0-9]{0,80}?(\d+[.,]\d+)\s*persen/i)
          const wisnusMatch = isi.match(/(\d+[.,]\d+)\s*(?:ribu|juta)\s*(?:perjalanan|kunjungan)/i)
          if (tpkMatch && result.tpk.periode === FALLBACK.tpk.periode) {
            result.tpk = { nilai: tpkMatch[1] + '%', periode: rilis.release_date ?? 'rilis terbaru' }
            result.live = true
          }
          if (wisnusMatch && result.wisnus.periode === FALLBACK.wisnus.periode) {
            result.wisnus = { nilai: wisnusMatch[0], periode: rilis.release_date ?? 'rilis terbaru' }
            result.live = true
          }
        }
      }
    }
  } catch {
    // diam: fallback statis tetap dikembalikan
  }

  return new Response(JSON.stringify(result), {
    headers: { ...cors, 'Content-Type': 'application/json' },
  })
})
