import * as XLSX from 'xlsx'

/**
 * Util ekspor data grafik/tabel admin.
 * - Excel: pakai library `xlsx` (SheetJS) — sudah ada di dependencies.
 * - PDF: buka jendela print dengan tabel HTML rapi → pilih "Save as PDF".
 *   Tanpa library tambahan; hasil konsisten, ringan, dan tema terjaga.
 */

/** Ekspor 1 atau lebih sheet ke file .xlsx lalu unduh otomatis. */
export function exportToExcel(filename, sheets) {
  // sheets: [{ name, rows: [{ kolom: nilai }] }]
  const wb = XLSX.utils.book_new()
  for (const s of sheets) {
    const rows = Array.isArray(s.rows) ? s.rows : []
    // Header rapi + data kosong aman (xlsx menangani object langsung)
    const ws = XLSX.utils.json_to_sheet(rows)
    XLSX.utils.book_append_sheet(wb, ws, (s.name || 'Data').slice(0, 31))
  }
  XLSX.writeFile(wb, filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`)
}

const PRINT_STYLES = `
  * { box-sizing: border-box; }
  body {
    font-family: -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
    color: #0f172a; margin: 32px;
  }
  h1 { font-size: 20px; margin: 0 0 4px; }
  .sub { color: #64748b; font-size: 12px; margin-bottom: 20px; }
  h2 { font-size: 15px; margin: 24px 0 8px; }
  table { border-collapse: collapse; width: 100%; margin-bottom: 12px; }
  th, td { border: 1px solid #cbd5e1; padding: 6px 10px; font-size: 12px; text-align: left; }
  th { background: #f1f5f9; font-weight: 700; }
  tr:nth-child(even) td { background: #f8fafc; }
  img.chart {
    width: 100%;
    max-width: 720px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    display: block;
    margin: 0 auto 8px;
  }
  @page { margin: 14mm; }
`

/**
 * Capture elemen SVG grafik (Recharts) menjadi PNG dataURL.
 * selector contoh: '#chart-klik-destinasi svg'
 * Latar digambar gelap agar teks putih pada grafik tema gelap tetap terbaca.
 */
export async function captureChartSvg(selector) {
  try {
    const svg = document.querySelector(selector)
    if (!svg) return null
    const rect = svg.getBoundingClientRect()
    const w = Math.max(360, Math.round(rect.width || 600))
    const h = Math.max(200, Math.round(rect.height || 300))

    const clone = svg.cloneNode(true)
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    clone.setAttribute('width', w)
    clone.setAttribute('height', h)
    const xml = new XMLSerializer().serializeToString(clone)
    const svg64 = btoa(unescape(encodeURIComponent(xml)))

    const img = new Image()
    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
      img.src = `data:image/svg+xml;base64,${svg64}`
    })

    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#111827' // latar kartu chart (tema gelap)
    ctx.fillRect(0, 0, w, h)
    ctx.drawImage(img, 0, 0, w, h)
    return canvas.toDataURL('image/png')
  } catch (err) {
    console.warn('[export] gagal capture grafik:', err)
    return null
  }
}

/**
 * Ekspor ke PDF lewat dialog print (pilih "Save as PDF").
 * sections: [{ title, columns: [..], rows: [[..], ..] }]
 * images  : [{ title, dataUrl }] — gambar grafik (PNG) ikut dicetak.
 */
export async function exportToPdf(title, sections, images = []) {
  const win = window.open('', '_blank', 'width=920,height=680')
  if (!win) {
    alert('Popup diblokir browser. Izinkan popup untuk mengunduh PDF.')
    return
  }
  const bagian = sections
    .map((sec) => {
      const head = (sec.columns || [])
        .map((c) => `<th>${escapeHtml(String(c))}</th>`)
        .join('')
      const body = (sec.rows || [])
        .map(
          (r) =>
            `<tr>${(r || [])
              .map((cell) => `<td>${escapeHtml(String(cell ?? '—'))}</td>`)
              .join('')}</tr>`,
        )
        .join('')
      return `<h2>${escapeHtml(sec.title || '')}</h2>
        <table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`
    })
    .join('')

  const gambar = (images || [])
    .filter((im) => im && im.dataUrl)
    .map(
      (im) =>
        `<h2>${escapeHtml(im.title || 'Grafik')}</h2>
         <img class="chart" src="${im.dataUrl}" alt="${escapeHtml(im.title || 'Grafik')}" />`,
    )
    .join('')

  win.document.write(`<!doctype html>
<html lang="id"><head><meta charset="utf-8">
<title>${escapeHtml(title)}</title>
<style>${PRINT_STYLES}</style></head>
<body>
  <h1>${escapeHtml(title)}</h1>
  <p class="sub">Diekspor: ${new Date().toLocaleString('id-ID')} — Purwakarta Wisata</p>
  ${gambar}
  ${bagian}
  <script>
    window.onload = () => {
      const imgs = Array.from(document.images)
      Promise.all(imgs.map((i) => i.complete ? 0 : new Promise((r) => { i.onload = r; i.onerror = r })))
        .then(() => setTimeout(() => window.print(), 250))
    }
  <\/script>
</body></html>`)
  win.document.close()
}

function escapeHtml(s) {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

/** Format tanggal singkat utk nama file: 2026-09-11_1530 */
export function stampNamaFile() {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}_${p(d.getHours())}${p(d.getMinutes())}`
}
