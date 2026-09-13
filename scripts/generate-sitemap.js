import fs from 'fs'
import path from 'path'

import destinasi from '../src/data/destinasi.js'

const BASE_URL = 'https://wisata-purwakarta.vercel.app'

const coreSitemap = fs.readFileSync(path.resolve('public/sitemap-core.xml'), 'utf8')

const destUrls = destinasi
  .map((d) => {
    const loc = `${BASE_URL}/destinasi/${d.slug}`
    const lastmod = '2026-09-11'
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>0.8</priority>
  </url>`
  })
  .join('\n')

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${coreSitemap.match(/<url>[\s\S]*?<\/urlset>/)?.[0]?.replace('</urlset>', '') || ''}
${destUrls}

</urlset>`

fs.writeFileSync(path.resolve('public/sitemap.xml'), sitemap.trim() + '\n')
console.log(`✅ sitemap.xml dibuat — ${destinasi.length} destinasi ditambahkan`)
console.log(`   Total URL: ${destinasi.length + 5} halaman`)
