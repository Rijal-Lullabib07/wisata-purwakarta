import { useCallback, useEffect, useState } from 'react'
import { supabase, isSupabaseReady } from '../lib/supabase'

/** Daftar kategori dari DB; fallback: kategori unik dari data statis. */
export function useCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!isSupabaseReady) return setLoading(false)
    setLoading(true)
    const { data } = await supabase.from('categories').select('id, name, slug, icon').order('name')
    setCategories(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const create = async ({ name, icon }) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/[\s_]+/g, '-')
    const { error } = await supabase.from('categories').insert({ name, slug, icon: icon || null })
    if (!error) await refresh()
    return { error }
  }

  const update = async (id, fields) => {
    const { error } = await supabase.from('categories').update(fields).eq('id', id)
    if (!error) await refresh()
    return { error }
  }

  const remove = async (id) => {
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (!error) await refresh()
    return { error }
  }

  return { categories, loading, create, update, remove, refresh }
}
