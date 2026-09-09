import { useEffect, useState } from 'react'
import { supabase, isSupabaseReady } from '../lib/supabase'

/**
 * Hook auth untuk admin panel.
 * Mengembalikan { session, admin, loading, logout }.
 * `admin` hanya terisi bila user adalah admin aktif (dari tabel admin_users).
 */
export function useAuth() {
  const [state, setState] = useState({ session: null, admin: null, loading: true })

  useEffect(() => {
    if (!isSupabaseReady) {
      setState({ session: null, admin: null, loading: false })
      return
    }
    let active = true

    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        if (active) setState({ session: null, admin: null, loading: false })
        return
      }
      const { data: admin } = await supabase
        .from('admin_users')
        .select('user_id, role, is_active')
        .eq('user_id', session.user.id)
        .eq('is_active', true)
        .maybeSingle()
      if (active) setState({ session, admin: admin?.role === 'admin' ? admin : null, loading: false })
    }

    load()
    const { data: sub } = supabase.auth.onAuthStateChange(() => load())
    return () => {
      active = false
      sub?.subscription?.unsubscribe()
    }
  }, [])

  async function logout() {
    await supabase?.auth.signOut()
  }

  return { ...state, logout }
}
