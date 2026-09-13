import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

// ---------------------------------------------------------------------------
// Konfigurasi — isi dari environment / .env
// ---------------------------------------------------------------------------
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !GOOGLE_PLACES_API_KEY) {
  console.error('❌ Wajib set environment variable:')
  console.error('   export SUPABASE_URL=...')
  console.error('   export SUPABASE_SERVICE_ROLE_KEY=...')
  console.error('   export GOOGLE_PLACES_API_KEY=...')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
})

// Kemiripan nama — pakai sekumpulan kata kunci yang sama (sederhana & cepat).
// Similarity dianggap cukup kalau >= 2 kata dari nama asli ada di hasil Places.
const ambilKataKunci = (teks) =>
  teks
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((k) => k.length >= 3)

function hitungSimilarity(namaDb, namaPlaces) {
  const kataDb = ambilKataKunci(namaDb)
  const kataPlaces = ambilKataKunci(namaPlaces)
  if (kataDb.length === 0 || kataPlaces.length === 0) return 0
  const potong = kataDb.filter((k) => kataPlaces.includes(k)).length
  return potong / kataDb.length
}

// Kecamatan yang wajib cocok (daftar singkat — bisa diperluas).
// Kalau koordinat hasil Places berada di kecamatan berbeda, flag review.
const KECAMATAN_TARGET = new Set([
  'Bojong',
  'Bungursari',
  'Campaka',
  'Cibatu',
  'Darangdan',
  'Jatiluhur',
  'Kiarapedes',
  'Maniis',
  'Pasawahan',
  'Plered',
  'Purwakarta',
  'Sukasari',
  'Sukatani',
  'Tegalwaru',
  'Wanayasa',
])

// radius maksimal (km) biar koordinat tidak jauh dari pusat kecamatan yang diketahui.
// Ini aproksimasi — untuk verifikasi cepat, bukan GPS presisi.
const RADIUS_KM_MAKS = 12

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

// Pusat perkiraan tiap kecamatan (mirip data di src/data/destinasi.js).
const KOORD_KECAMATAN = {
  Bojong: { latitude: -6.634, longitude: 107.497 },
  Bungursari: { latitude: -6.590, longitude: 107.456 },
  Campaka: { latitude: -6.617, longitude: 107.472 },
  Cibatu: { latitude: -6.601, longitude: 107.515 },
  Darangdan: { latitude: -6.679, longitude: 107.468 },
  Jatiluhur: { latitude: -6.556, longitude: 107.409 },
  Kiarapedes: { latitude: -6.661, longitude: 107.552 },
  Maniis: { latitude: -6.706, longitude: 107.440 },
  Pasawahan: { latitude: -6.629, longitude: 107.392 },
  Plered: { latitude: -6.618, longitude: 107.431 },
  Purwakarta: { latitude: -6.5569, longitude: 107.443 },
  Sukasari: { latitude: -6.658, longitude: 107.412 },
  Sukatani: { latitude: -6.599, longitude: 107.499 },
  Tegalwaru: { latitude: -6.650, longitude: 107.470 },
  Wanayasa: { latitude: -6.695, longitude: 107.335 },
}

// ---------------------------------------------------------------------------
// API Google Places (New)
// ---------------------------------------------------------------------------
async function textSearch(query) {
  const url = 'https://places.googleapis.com/v1/places:searchText'
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
      'X-Goog-FieldMask': 'places.id,places.displayName,places.location,places.photos',
    },
    body: JSON.stringify({ textQuery: query }),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`TextSearch gagal: ${res.status} ${body}`)
  }
  const json = await res.json()
  return (json.places || []).map((p) => ({
    placeId: p.id,
    name: p.displayName?.text || '',
    latitude: p.location?.latitude,
    longitude: p.location?.longitude,
    photoRefs: (p.photos || []).map((ph) => ph.name),
  }))
}

async function placeDetails(placeId) {
  const url = `https://places.googleapis.com/v1/places/${placeId}`
  const res = await fetch(url, {
    headers: {
      'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
      'X-Goog-FieldMask':
        'displayName,location,photos,googleMapsUrl,formattedAddress',
    },
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`PlaceDetails gagal: ${res.status} ${body}`)
  }
  return res.json()
}

async function placePhoto(photoRef, maxWidth = 1200) {
  const url = `https://places.googleapis.com/v1/${photoRef}/media`
  const res = await fetch(url, {
    headers: {
      'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
      'X-Goog-FieldMask': 'photo~image',
    },
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`PlacePhoto gagal: ${res.status} ${body}`)
  }
  const json = await res.json()
  const blob = json['photo~image']?.image?.imageContents
  if (!blob) return null
  // imageContents biasanya base64 atau binary — tapi Google Places API (New)
  // mengembalikan binary via Fetch response body. Di sini kita paksa respon
  // mentah lewat response.body karena fieldmask 'photo~image' mengembalikan
  // binary langsung.
  return null
}

// Implementasi photo yang benar: request sebagai blob via Fetch biasa.
async function fetchPhotoBlob(photoRef, maxWidth = 1200) {
  const url = `https://places.googleapis.com/v1/${photoRef}/media?maxWidthPx=${maxWidth}`
  const res = await fetch(url, {
    headers: {
      'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
    },
  })
  if (!res.ok) {
    const body = await res.text()
    console.error(`   ⚠ Gagal download foto ${photoRef}: ${res.status} ${body}`)
    return null
  }
  const buffer = await res.arrayBuffer()
  return Buffer.from(buffer)
}

// ---------------------------------------------------------------------------
// Upload foto ke Supabase Storage bucket 'destinasi-galeri'
// ---------------------------------------------------------------------------
const BUCKET = 'destinasi-galeri'
const FOLDER_GOOGLE = 'google-places'

async function uploadFoto(placeId, photoIndex, buffer, mime) {
  const ext = mime?.startsWith('image/jpeg') ? 'jpg' : mime?.startsWith('image/png') ? 'png' : 'jpg'
  const namaFile = `google-places/${placeId}/photo_${String(photoIndex).padStart(3, '0')}.${ext}`
  const { data, error } = await supabase.storage.from(BUCKET).upload(namaFile, buffer, {
    contentType: mime || 'image/jpeg',
    upsert: true,
  })
  if (error) {
    console.error(`   ⚠ Gagal upload ${namaFile}: ${error.message}`)
    return null
  }
  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(namaFile)
  return urlData.publicUrl
}

// ---------------------------------------------------------------------------
// Logika utama per destinasi
// ---------------------------------------------------------------------------
const THRESHOLD_SIMILARITY = 0.4 // minimal >= 2 kata kunci dari nama DB

async function prosesDestinasi(dest) {
  const { id, nama, kecamatan, slug, galeri = [] } = dest

  // Skip kalau sudah ada google_place_id di database (udah pernah proses).
  if (dest.google_place_id) {
    return { status: 'SKIP', alasan: 'sudah ada google_place_id', dest }
  }

  console.log(`\n── ${nama} [${kecamatan}]`)
  const query = `${nama} ${kecamatan} Purwakarta`

  let candidates
  try {
    candidates = await textSearch(query)
  } catch (err) {
    return { status: 'ERROR', alasan: `TextSearch error: ${err.message}`, dest }
  }

  if (candidates.length === 0) {
    return { status: 'KOSONG', alasan: 'TextSearch tidak menemukan tempat', dest }
  }

  // Urutkan: pilih yang namanya paling mirip.
  candidates.sort(
    (a, b) =>
      hitungSimilarity(nama, b.name) - hitungSimilarity(nama, a.name),
  )
  const terpilih = candidates[0]

  // 1) Verifikasi nama
  const sim = hitungSimilarity(nama, terpilih.name)
  const namaCocok = sim >= THRESHOLD_SIMILARITY

  // 2) Verifikasi koordinat (jika ada)
  let koordCocok = null
  if (terpilih.latitude && terpilih.longitude && kecamatan) {
    const pusat = KOORD_KECAMATAN[kecamatan]
    if (pusat) {
      const jarak = haversineKm(pusat, {
        latitude: terpilih.latitude,
        longitude: terpilih.longitude,
      })
      koordCocok = jarak <= RADIUS_KM_MAKS
      console.log(`   📍 ${terpilih.name} → (${terpilih.latitude}, ${terpilih.longitude})  jarak ${jarak.toFixed(1)} km dari pusat ${kecamatan}`)
    }
  }

  // Jika nama OR koordinat nggak cocok → masukkan review manual.
  if (!namaCocok || (koordCocok === false)) {
    return {
      status: 'REVIEW_MANUAL',
      alasan: namaCocok ? 'koordinat tidak cocok dengan kecamatan' : 'nama tidak mirip',
      dest,
      details: {
        namaDatabase: nama,
        namaPlaces: terpilih.name,
        similarity: Math.round(sim * 100),
        koordinatPlaces: terpilih.latitude && terpilih.longitude ? [terpilih.latitude, terpilih.longitude] : null,
        koordinatDatabase: dest.latitude && dest.longitude ? [dest.latitude, dest.longitude] : null,
        kecamatanDatabase: kecamatan,
      },
    }
  }

  console.log(`   ✅ terpilih: ${terpilih.name}  (similarity ${Math.round(sim * 100)}%)`)
  const { placeId, photoRefs } = terpilih

  // 3) Jika tidak ada foto sama sekali → catat kosong, jangan download apapun.
  if (!photoRefs || photoRefs.length === 0) {
    return {
      status: 'KOSONG_FOTO',
      alasan: 'place_id valid tapi tidak ada foto di Google Places',
      dest,
      details: { placeId, googleMapsUrl: `https://maps.google.com/?cid=${placeId}` },
    }
  }

  // 4) Download foto (maksimal 5 foto per destinasi)
  const fotoPath = []
  const maksFoto = Math.min(photoRefs.length, 5)

  for (let i = 0; i < maksFoto; i++) {
    const photoRef = photoRefs[i]
    console.log(`   📷 foto ${i + 1}/${maksFoto} …`)
    const buffer = await fetchPhotoBlob(photoRef, 1200)
    if (!buffer) continue

    // Tentukan mime type dari magic bytes (sederhana).
    const mime = buffer[0] === 0xff && buffer[1] === 0xd8 ? 'image/jpeg' : 'image/png'

    const publicUrl = await uploadFoto(placeId, i + 1, buffer, mime)
    if (publicUrl) fotoPath.push(publicUrl)
    // delay kecil biar nggak kena rate-limit
    await new Promise((r) => setTimeout(r, 300))
  }

  if (fotoPath.length === 0) {
    return {
      status: 'KOSONG_FOTO',
      alasan: 'gagal mengunduh foto (mungkin API key tidak memiliki quota/photo)',
      dest,
      details: { placeId },
    }
  }

  // 5) Update database
  const galeriBaru = [...galeri, ...fotoPath]
  const mapsUrl = `https://maps.google.com/?cid=${placeId}`

  const { error: updateError } = await supabase
    .from('destinations')
    .update({
      google_place_id: placeId,
      google_maps_url: mapsUrl,
      galeri: galeriBaru,
      photo_count: galeriBaru.length,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (updateError) {
    console.error(`   ❌ Gagal update DB: ${updateError.message}`)
    return {
      status: 'ERROR',
      alasan: `update DB gagal: ${updateError.message}`,
      dest,
      details: { placeId, fotoPath },
    }
  }

  console.log(`   ✅ ${fotoPath.length} foto dikirim ke storage`)
  return {
    status: 'BERHASIL',
    fotoCount: fotoPath.length,
    dest,
    details: { placeId, mapsUrl, fotoPath },
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log('🔎 Mengambil daftar destinasi dari database …')

  const { data, error } = await supabase
    .from('destinations')
    .select('id, nama, kecamatan, slug, latitude, longitude, galeri, google_place_id, google_maps_url')
    .neq('is_published', false)

  if (error) {
    console.error('❌ Gagal query destinations:', error.message)
    process.exit(1)
  }

  const destinasi = data || []
  console.log(`📌 Ditemukan ${destinasi.length} destinasi terpublikasi`)

  const laporan = {
    berhasil: [],
    kosong: [],
    kosongFoto: [],
    reviewManual: [],
    error: [],
    skip: [],
  }

  for (const dest of destinasi) {
    const hasil = await prosesDestinasi(dest)

    if (hasil.status === 'BERHASIL') {
      laporan.berhasil.push({
        nama: dest.nama,
        slug: dest.slug,
        fotoCount: hasil.fotoCount,
        placeId: hasil.details.placeId,
      })
    } else if (hasil.status === 'KOSONG_FOTO') {
      laporan.kosongFoto.push({
        nama: dest.nama,
        slug: dest.slug,
        alasan: hasil.alasan,
        placeId: hasil.details?.placeId || null,
      })
    } else if (hasil.status === 'KOSONG') {
      laporan.kosong.push({ nama: dest.nama, slug: dest.slug, alasan: hasil.alasan })
    } else if (hasil.status === 'REVIEW_MANUAL') {
      laporan.reviewManual.push({
        namaDatabase: hasil.details.namaDatabase,
        slug: dest.slug,
        namaPlaces: hasil.details.namaPlaces,
        similarityPercent: hasil.details.similarity,
        koordinatDatabase: hasil.details.koordinatDatabase,
        koordinatPlaces: hasil.details.koordinatPlaces,
        kecamatanDatabase: hasil.details.kecamatanDatabase,
      })
    } else if (hasil.status === 'ERROR') {
      laporan.error.push({ nama: dest.nama, slug: dest.slug, alasan: hasil.alasan })
    } else if (hasil.status === 'SKIP') {
      laporan.skip.push({ nama: dest.nama, slug: dest.slug, alasan: hasil.alasan })
    }
  }

  // Ringkasan laporan
  console.log('\n\n═══════════════════════════════════════════════════════')
  console.log('📊 LAPORAN FETCH FOTO GOOGLE PLACES')
  console.log('═══════════════════════════════════════════════════════')
  console.log(`✅ Berhasil dapat foto    : ${laporan.berhasil.length} destinasi`)
  console.log(`📭 Tidak ada foto (Places): ${laporan.kosongFoto.length} destinasi`)
  console.log(`❓ Kosong (tidak ditemukan): ${laporan.kosong.length} destinasi`)
  console.log(`🔍 Perlu review manual    : ${laporan.reviewManual.length} destinasi`)
  console.log(`❌ Error                  : ${laporan.error.length} destinasi`)
  console.log(`⏭️  Skip (sudah ada)      : ${laporan.skip.length} destinasi`)

  console.log('\n── Daftar BERHASIL ──')
  laporan.berhasil.forEach((d) =>
    console.log(`   ✅ ${d.nama} — ${d.fotoCount} foto  (placeId: ${d.placeId})`),
  )

  if (laporan.kosongFoto.length) {
    console.log('\n── TIDAK ADA FOTO (perlu foto manual/survey) ──')
    laporan.kosongFoto.forEach((d) =>
      console.log(`   📭 ${d.nama} — ${d.alasan}`),
    )
  }

  if (laporan.reviewManual.length) {
    console.log('\n── PERLU REVIEW MANUAL (nama/koordinat tidak cocok) ──')
    laporan.reviewManual.forEach((d) =>
      console.log(
        `   🔍 ${d.namaDatabase} [db: ${d.kecamatanDatabase}] → Places: "${d.namaPlaces}" (similarity ${d.similarityPercent}%)` +
          (d.koordinatDatabase && d.koordinatPlaces
            ? ` | koordDb: ${d.koordinatDatabase.join(',')}  koordPlaces: ${d.koordinatPlaces.join(',')}`
            : ''),
      ),
    )
  }

  if (laporan.error.length) {
    console.log('\n── ERROR ──')
    laporan.error.forEach((d) => console.log(`   ❌ ${d.nama} — ${d.alasan}`))
  }

  // Simpan laporan ke file JSON biar nggak hilang
  const laporanPath = path.resolve('scripts/laporan-places-foto.json')
  fs.writeFileSync(laporanPath, JSON.stringify(laporan, null, 2))
  console.log(`\n💾 Laporan tersimpan: ${laporanPath}`)
}

main().catch((err) => {
  console.error('💥 Script gagal:', err)
  process.exit(1)
})
