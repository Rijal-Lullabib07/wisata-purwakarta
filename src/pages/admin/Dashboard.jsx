import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts'
import { supabase, isSupabaseReady } from '../../lib/supabase'
import { TableSkeleton } from '../../components/admin/ui'

const tooltipStyle = {
  background: '#111827',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 10,
  color: '#f1f5f9',
  fontSize: 12,
}

export default function Dashboard() {
  const [stat, setStat] = useState({ total: 0, published: 0, draft: 0, kategori: 0 })
  const [loading, setLoading] = useState(true)
  const [eda, setEda] = useState(null)
  const [visitors, setVisitors] = useState([])
  const [analyticsErr, setAnalyticsErr] = useState('')

  useEffect(() => {
    if (!isSupabaseReady) return setLoading(false)
    ;(async () => {
      // Konten: destinasi & kategori
      const [total, published, kategori] = await Promise.all([
        supabase.from('destinations').select('id', { count: 'exact', head: true }),
        supabase.from('destinations').select('id', { count: 'exact', head: true }).eq('is_published', true),
        supabase.from('categories').select('id', { count: 'exact', head: true }),
      ])
      setStat({
        total: total.count || 0,
        published: published.count || 0,
        draft: (total.count || 0) - (published.count || 0),
        kategori: kategori.count || 0,
      })
      setLoading(false)

      // Analitik klik — RPC hanya untuk admin terverifikasi; gagal → tampil kosong.
      const [edaRes, visRes] = await Promise.all([
        supabase.rpc('get_click_eda'),
        supabase.rpc('get_visitor_log', { limit_n: 15 }),
      ])
      if (edaRes.error || visRes.error) {
        setAnalyticsErr(edaRes.error?.message || visRes.error?.message || '')
        return
      }
      setEda(edaRes.data || null)
      setVisitors(visRes.data || [])
    })()
  }, [])

  const kartu = [
    { label: 'Total Destinasi', nilai: stat.total, warna: '#2dd4a7' },
    { label: 'Published', nilai: stat.published, warna: '#5b8def' },
    { label: 'Draft', nilai: stat.draft, warna: '#f59e0b' },
    { label: 'Kategori', nilai: stat.kategori, warna: '#a78bfa' },
  ]

  const growth = eda?.growth_percent
  const kartuKlik = [
    { label: 'Total Klik', nilai: (eda?.total_clicks ?? 0).toLocaleString('id-ID'), warna: '#10b981' },
    { label: 'Pengunjung Unik', nilai: (eda?.total_visitors ?? 0).toLocaleString('id-ID'), warna: '#22d3ee' },
    { label: 'Destinasi Diklik', nilai: eda?.total_destinations ?? 0, warna: '#f472b6' },
    {
      label: 'Pertumbuhan Harian',
      nilai: growth === null || growth === undefined ? '—' : `${growth > 0 ? '+' : ''}${growth}%`,
      warna: '#a78bfa',
    },
  ]

  const perDestinasi = eda?.by_destination ?? []
  const trenHarian = eda?.daily_trend ?? []
  const top5 = eda?.top5 ?? []

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <div className="adm-page-head">
        <div>
          <h2>Dashboard</h2>
          <p className="adm-muted">Ringkasan konten &amp; aktivitas pengunjung</p>
        </div>
      </div>

      {/* Konten */}
      <div className="adm-stat-grid">
        {kartu.map((k, i) => (
          <motion.div
            key={k.label}
            className="adm-stat-card"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
            style={{ borderTopColor: k.warna }}
          >
            <div className="adm-stat-nilai">{loading ? '…' : k.nilai}</div>
            <div className="adm-stat-label">{k.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Analitik klik */}
      <div className="adm-page-head" style={{ marginTop: 10 }}>
        <h2 style={{ fontSize: '1.15rem' }}>Statistik Kunjungan</h2>
      </div>
      {analyticsErr ? (
        <p className="adm-empty">Data klik belum tersedia ({analyticsErr}).</p>
      ) : (
        <>
          <div className="adm-stat-grid">
            {kartuKlik.map((k, i) => (
              <motion.div
                key={k.label}
                className="adm-stat-card"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.3 }}
                style={{ borderTopColor: k.warna }}
              >
                <div className="adm-stat-nilai">{loading ? '…' : k.nilai}</div>
                <div className="adm-stat-label">{k.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="chart-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
            <div className="chart-card">
              <h3>Klik per Destinasi</h3>
              {loading ? (
                <TableSkeleton rows={4} cols={3} />
              ) : perDestinasi.length === 0 ? (
                <p className="chart-empty">Belum ada data klik.</p>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={perDestinasi} margin={{ top: 8, right: 8, bottom: 8, left: -12 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="nama" tick={{ fill: '#94a3b8', fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={70} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} allowDecimals={false} />
                    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.04)' }} contentStyle={tooltipStyle} />
                    <Bar dataKey="klik" name="Klik" fill="#10b981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="chart-card">
              <h3>Tren Klik Harian</h3>
              {loading ? (
                <TableSkeleton rows={4} cols={3} />
              ) : trenHarian.length === 0 ? (
                <p className="chart-empty">Belum ada data klik.</p>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={trenHarian} margin={{ top: 8, right: 8, bottom: 8, left: -12 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="tanggal" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} allowDecimals={false} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Line type="monotone" dataKey="jumlah" name="Klik" stroke="#22d3ee" strokeWidth={2.5} dot={{ r: 3, fill: '#22d3ee' }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="chart-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
            <div className="chart-card">
              <h3>Destinasi Terpopuler</h3>
              {top5.length === 0 ? (
                <p className="chart-empty">Belum ada data klik.</p>
              ) : (
                <ol className="top5-list">
                  {top5.map((t, i) => (
                    <li key={t.nama}>
                      <span className={`top5-rank rank-${i + 1}`}>{i + 1}</span>
                      <span className="top5-name">{t.nama}</span>
                      <span className="top5-val">{t.klik} klik</span>
                      <div className="top5-bar">
                        <div style={{ width: `${(t.klik / top5[0].klik) * 100}%` }}></div>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </div>

            {/* Siapa yang ngeklik — anonim: kota/negara/device saja */}
            <div className="chart-card">
              <h3>Pengunjung Terakhir</h3>
              {visitors.length === 0 ? (
                <p className="chart-empty">Belum ada visitor tercatat.</p>
              ) : (
                <div className="visitor-table-wrap">
                  <table className="visitor-table">
                    <thead>
                      <tr>
                        <th>Waktu</th>
                        <th>Destinasi</th>
                        <th>Kota</th>
                        <th>Device</th>
                        <th>Browser</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visitors.map((v, i) => (
                        <tr key={i}>
                          <td>{new Date(v.clicked_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}</td>
                          <td>{v.destination_name}</td>
                          <td>{v.city || v.country || '—'}</td>
                          <td>{v.device_type || '—'}</td>
                          <td>{v.browser ? `${v.browser}${v.os ? ' · ' + v.os : ''}` : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </motion.div>
  )
}
