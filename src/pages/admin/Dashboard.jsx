import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase, isSupabaseReady } from '../../lib/supabase'

export default function Dashboard() {
  const [stat, setStat] = useState({ total: 0, published: 0, draft: 0, kategori: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseReady) return setLoading(false)
    ;(async () => {
      const { count: total } = await supabase.from('destinations').select('id', { count: 'exact', head: true })
      const { count: published } = await supabase.from('destinations').select('id', { count: 'exact', head: true }).eq('is_published', true)
      const { count: kategori } = await supabase.from('categories').select('id', { count: 'exact', head: true })
      setStat({ total: total || 0, published: published || 0, draft: (total || 0) - (published || 0), kategori: kategori || 0 })
      setLoading(false)
    })()
  }, [])

  const kartu = [
    { label: 'Total Destinasi', nilai: stat.total, warna: '#2dd4a7' },
    { label: 'Published', nilai: stat.published, warna: '#5b8def' },
    { label: 'Draft', nilai: stat.draft, warna: '#f59e0b' },
    { label: 'Kategori', nilai: stat.kategori, warna: '#a78bfa' },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <div className="adm-page-head">
        <div>
          <h2>Dashboard</h2>
          <p className="adm-muted">Ringkasan konten destinasi</p>
        </div>
      </div>

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
    </motion.div>
  )
}
