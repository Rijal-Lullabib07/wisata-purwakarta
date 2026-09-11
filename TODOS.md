# TODOS — Perbaikan Purwakarta Wisata

## Point 9 — Switcher bahasa jadi dropdown (klik untuk buka pilihan)

**Status: selesai**

- [x] 9.1. `LanguageSwitcher.jsx` ditulis ulang: bukan lagi 3 tombol berjejer
      lurus di navbar, melainkan tombol ringkas (globe + kode bahasa aktif +
      caret) — pilihan ID/Sunda/English baru MUNCUL saat diklik (dropdown).
- [x] 9.2. Menu pilihan: baris penuh per bahasa (✓ bahasa aktif + nama + kode),
      rapat kanan (tidak keluar layar), tutup otomatis saat klik luar / pilih /
      tekan Escape.
- [x] 9.3. Mobile ≤768px: trigger 36px (ikon+caret saja, kode disembunyikan),
      menu fixed tepat di bawah navbar (sadar notch), tap target pilihan 48px.
- [x] 9.4. Animasi tetap ringan (0.15s, hanya opacity/transform) — responsif
      di HP, sesuai perbaikan performa Point 1.
- [x] 9.5. Verifikasi: lint 0 error + build ✅

## Point 8 — Halaman statistik (decoy) berantakan: full-bleed & di-bawah navbar

**Status: selesai**

- [x] 8.1. Konten decoy statistik (publik /statistik & penyamar route admin)
      kini dibungkus `.ds-wrap` max-width 1080px — sebelumnya full-bleed
      menempel tepi layar.
- [x] 8.2. Mobile ≤600px: kartu angka jadi grid 2 kolom ringkas, bar chart
      full-width, "Rating Tertinggi" 2 kolom, padding & gap dirapatkan.
- [x] 8.3. Catatan: halaman ini sengaja TAMPIL saat sesi admin berakhir
      (idle 15 menit → auto signOut) sebagai penyamaran route admin —
      bukan bug. Login ulang untuk kembali ke panel.
- [x] 8.4. Verifikasi: lint 0 error + build ✅

## Point 7 — Admin tidak terlihat di HP + dashboard terlalu panjang

**Status: selesai**

- [x] 7.1. AKAR MASALAH: di ≤920px sidebar dijadikan top-strip di posisi
      paling atas dokumen → tertutup navbar situs yang fixed (z-index 1000)
      → menu admin TIDAK TERLIHAT di HP. Kini: bar admin khusus HP
      (hamburger + judul, fixed tepat di bawah navbar) + sidebar menjadi
      DRAWER kiri yang slide masuk (z-index 820 di atas scrim 800,
      di bawah navbar 1000 & toast 1100).
- [x] 7.2. Drawer otomatis tertutup saat memilih menu / logout / tap scrim.
- [x] 7.3. Safe-area iPhone ikut dihitung (bar & drawer & padding .adm-main).
- [x] 7.4. Dashboard dirapatkan di HP (≤600px): kartu statistik ringkas
      (padding & angka kecil), tombol Excel/PDF kompak sebaris (tidak
      full-width), kartu grafik ramping, tabel pengunjung scroll horizontal.
- [x] 7.5. Navbar situs di HP: teks brand di-ellipsis (tidak lagi menabrak
      switcher bahasa & hamburger), tombol bahasa 36px agar 3 tombol muat,
      posisi menu mobile selaras navbar 68px + safe-area.
- [x] 7.6. Footer HP kini 2 kolom (tidak lagi 1 kolom panjang) + brand
      full-width di atas; sentuhan link tetap nyaman (≥44px).
- [x] 7.7. Verifikasi: lint 0 error + build ✅

## Point 6 — Halaman destinasi publik blank saat mencari

**Status: selesai**

- [x] 6.1. Akar masalah: baris DB punya kecamatan/alamat NULL →
      `d.kecamatan.toLowerCase()` melempar TypeError → React me-unmount
      halaman (blank). Filter pencarian kini null-safe
      (`String(x || '')`) + searchable deskripsi + query di-trim.
- [x] 6.2. Bentuk fasilitas array (dari DB) & object (dari statis) didukung
      di kartu & halaman detail.
- [x] 6.3. Kartu/hero tanpa foto (galeri kosong) menampilkan fallback rapi.
- [x] 6.4. Halaman detail: tanpa koordinat → peta pakai pencarian nama
      (bukan `NaN`), jarak/menit tampil '—', langkah rute tanpa kecamatan.
- [x] 6.5. Verifikasi: lint 0 error + build ✅

## Point 5 — Header admin ketutup + error 400 simpan + warning input null + export Excel/PDF

**Status: selesai (kode) — ⚠️ butuh 1 aksi di Supabase Dashboard**

- [x] 5.1. Konten admin ketutup navbar fixed → `.adm-main` & `.statistik-page`
      diberi padding-top clearance (desktop/tablet/mobile).
- [x] 5.2. Error 400 "admin_audit_logs_status_check": DB lama punya constraint
      tanpa nilai crud_*. File **`supabase/migration-fix-audit-log.sql`** dibuat
      (REVISI 2: fix error 42601 — variabel `r` kini dideklarasikan di DO block).
      **→ JALANKAN ulang di Supabase > SQL Editor (versi revisi 2).**
- [x] 5.3. Warning React "value prop on input should not be null": field teks
      dari DB dinormalisasi '' saat load form edit (DestinationForm).
- [x] 5.4. `src/lib/exportData.js`: exportToExcel (SheetJS) + exportToPdf
      (print dialog) + stampNamaFile.
- [x] 5.5. Tombol **⤓ Excel** & **🖨 PDF** di Dashboard admin (section Statistik
      Kunjungan) dan di halaman Statistik — berisi ringkasan, klik per
      destinasi, tren harian, jam klik, top 5, log pengunjung.
- [x] 5.7. Export PDF kini MENYERTAKAN GAMBAR GRAFIK: bar & line chart di-
      capture dari DOM (SVG → PNG via canvas, latar gelap) lalu dicetak di
      atas tabel data. Berlaku di Dashboard admin & halaman Statistik.
      (Excel tetap tabel data — format xlsx tidak mendukung embed gambar.)
- [x] 5.8. Verifikasi: lint 0 error + build ✅

## Point 4 — Tombol "Simpan" di form destinasi tidak ada reaksi

**Status: selesai**

- [x] 4.1. Akar masalah: `validasi()` memanggil `.trim()` pada field yang
      NULL (baris dari DB bisa punya deskripsi/alamat NULL) → TypeError
      → handler mati senyap sebelum toast/busy → klik terasa mati total.
      Sekarang semua field dibaca null-safe (`String(x || '').trim()`).
- [x] 4.2. `simpan()` dibungkus try/catch/finally: exception kini tampil
      sebagai toast + console.error, dan tombol TIDAK terkunci lagi.
- [x] 4.3. Error Supabase ditampilkan apa adanya (bukan pesan generik) —
      mis. pelanggaran RLS langsung terlihat penyebabnya.
- [x] 4.4. Guard Supabase belum dikonfigurasi + cegah dobel-submit.
- [x] 4.5. Verifikasi: lint 0 error + build ✅

> File ini adalah catatan progres. Kalau eksekusi terputus/ada trouble, baca
> checkbox di bawah: item `[ ]` = belum selesai, `[x]` = sudah selesai.
> Lanjutkan dari item `[ ]` pertama pada point terkait.

---

## Point 1 — Switcher bahasa (ID/SU/EN) lambat saat dibuka di HP Android/iPhone

**Status: selesai (kode)**

- [x] 1.1. Perbesar tombol bahasa di mobile (dari 27px → 40px, batas nyaman
      jempol) — `src/App.css` (`.lang-option` + blok ≤768px).
- [x] 1.2. `touch-action: manipulation` + `:active` feedback instan untuk
      tombol bahasa, hamburger, link menu, dan semua kontrol interaktif.
- [x] 1.3. Kurangi beban GPU di mobile:
      - navbar ≤768px tanpa `backdrop-filter: blur(20px)` & tanpa animasi drop
      - menu mobile: transisi 0.18s hanya transform/opacity (dari 0.3s all)
      - partikel hero `display:none` + zoom hero mati di ≤768px
      - hapus `will-change: transform` pada puluhan kartu (layer explosion)
- [x] 1.4. Memoize value `LanguageContext` di `src/i18n/LanguageContext.jsx`.
- [x] 1.5. Verifikasi: `npm run lint` (0 error) + `npm run build` ✅ 5.1s

## Point 2b — Follow-up: 60 destinasi tampil di publik + ikon install = logo asli

**Status: selesai**

- [x] 2b.1. `usePublicDestinations` diperbaiki: DB yang hanya berisi 4 baris
      tidak lagi menimpa tampilan publik. Sekarang GABUNGAN — baris DB tampil
      duluan, sisanya diisi destinasi statis (tanpa duplikat slug), jadi 60
      selalu tampil di halaman user apa pun isi DB.
- [x] 2b.2. Ikon PWA dibuat dari `logo.jpg` (crop tengah persegi):
      `pwa-192.jpg`, `pwa-512.jpg`, `apple-touch-icon.jpg` — manifest &
      index.html diupdate. Logo install app kini = logo Purwakarta Wisata.
      (Untuk hasil terbaik, ganti nanti dengan PNG 512px resmi jika ada.)
- [x] 2b.3. Verifikasi: lint 0 error + build ✅

## Point 2 — Data admin CRUD hanya 4, sedangkan destinasi statis ada 60

**Status: selesai (kode)**

- [x] 2.1. Tombol **"⤓ Impor 60 destinasi"** di Admin › Destinasi:
      upsert dari `src/data/destinasi.js` ke tabel `destinations`
      (on-conflict slug = skip, data yang sudah ada TIDAK ditimpa).
      Fungsi: `importStatisKeDb()` + `destinasiStatisToRow()` di
      `src/hooks/useDestinations.js`.
- [x] 2.2. Hook `usePublicDestinations` (DB + fallback statis) kini dipakai di:
      - `src/pages/Destinasi.jsx` (+ indikator sumber data)
      - `src/pages/Beranda.jsx` (statistik & populer dihitung dari data DB)
      - `src/pages/DestinasiDetail.jsx` (cari by slug dari daftar gabungan)
- [x] 2.3. Verifikasi: `npm run lint` (0 error) + `npm run build` ✅
      (Catatan runtime: klik tombol Impor sekali di panel admin untuk
      memindahkan 60 destinasi statis ke Supabase.)

## Point 3 — Penyesuaian UI interaktif untuk PWA / mobile (agar rapih & nyaman)

**Status: selesai (kode)**

- [x] 3.1. `index.html`: viewport `viewport-fit=cover`, `theme-color`,
      apple-touch-icon, meta PWA (standalone, status bar, judul app).
- [x] 3.2. `public/manifest.webmanifest` dibuat (nama, warna tema, ikon
      SVG + maskable logo, display standalone, portrait).
- [x] 3.3. Navbar mobile: sadar notch iPhone (`env(safe-area-inset-*)`),
      tinggi navbar + menu menyesuaikan safe-area atas, tanpa blur.
- [x] 3.4. Admin panel mobile (≤600px):
      - sidebar → top-nav horizontal scroll tanpa scrollbar
      - stat grid dipaksa 2 kolom, kartu rapat
      - tombol aksi header full-width, filter 1 kolom
      - pagination wrap, toast full-width + safe-area bawah
      - form action button full-width (column-reverse)
- [x] 3.5. Halaman publik mobile (≤600px): padding section dirapatkan,
      hover-lift kartu dimatikan di sentuhan, input ≥46px + font 16px
      (anti auto-zoom Safari), filter & tombol ≥44px touch target.
- [x] 3.6. Verifikasi: `npm run lint` (0 error) + `npm run build` ✅
      (Cek visual via devtools responsive mode direkomendasikan.)
