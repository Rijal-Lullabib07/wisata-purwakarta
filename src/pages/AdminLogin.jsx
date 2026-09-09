import { useEffect, useRef, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { supabase, isSupabaseReady } from '../lib/supabase'
import DecoyStatistik from '../components/DecoyStatistik'

function AdminLogin() {
  const navigate = useNavigate()
  const location = useLocation()
  const [session, setSession] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [factor, setFactor] = useState(null)
  const [qr, setQr] = useState('')
  const [secret, setSecret] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [failures, setFailures] = useState(0)
  const [turnstileToken, setTurnstileToken] = useState('')
  const turnstileRef = useRef(null)

  useEffect(() => {
    if (failures < 3 || !import.meta.env.VITE_TURNSTILE_SITE_KEY || !turnstileRef.current) return
    const render = () => window.turnstile?.render(turnstileRef.current, {
      sitekey: import.meta.env.VITE_TURNSTILE_SITE_KEY,
      callback: setTurnstileToken,
    })
    const timer = window.setInterval(() => {
      if (window.turnstile) {
        window.clearInterval(timer)
        render()
      }
    }, 250)
    return () => window.clearInterval(timer)
  }, [failures])

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
  }, [])

  /** Ambil pesan error asli dari body respons Edge Function (non-2xx). */
  async function readServerError(error) {
    try {
      const body = await error?.context?.json()
      return body?.error || ''
    } catch {
      return ''
    }
  }

  async function submitLogin(event) {
    event.preventDefault()
    setBusy(true)
    setMessage('')
    if (failures >= 3 && !turnstileToken) {
      setMessage('Selesaikan verifikasi keamanan terlebih dahulu.')
      setBusy(false)
      return
    }
    const { data, error } = await supabase.functions.invoke('admin-login', {
      body: { email, password, turnstile_token: turnstileToken },
    })
    if (error || !data?.session) {
      const reason = (data?.error || (await readServerError(error)) || '').toLowerCase()
      turnstileRef.current?.querySelector('iframe') && window.turnstile?.reset()
      setTurnstileToken('')
      if (reason.includes('captcha')) {
        // Server menuntut captcha (hitungan gagal di server >= 3) — paksa tampilkan widget.
        setFailures(3)
        setMessage('Verifikasi keamanan diperlukan — selesaikan captcha di bawah lalu coba lagi.')
      } else if (reason.includes('locked')) {
        setMessage('Akses dikunci 15 menit karena terlalu banyak percobaan gagal.')
      } else if (reason.includes('challenge')) {
        setFailures((count) => Math.max(count, 3))
        setMessage('Captcha tidak valid — coba lagi.')
      } else {
        setFailures((count) => count + 1)
        setMessage('Kredensial tidak valid.')
      }
      setPassword('')
      setBusy(false)
      return
    }
    await supabase.auth.setSession(data.session)
    setSession(data.session)
    setFailures(0)
    if (data.mfa_required) await prepareMfa()
    else navigate('/panel-kj29xz', { replace: true })
    setBusy(false)
  }

  async function prepareMfa() {
    const { data } = await supabase.auth.mfa.listFactors()
    const verified = data?.totp?.find((item) => item.status === 'verified')
    if (verified) {
      setFactor(verified)
      return
    }
    // Bersihkan faktor sisa yang belum pernah diverifikasi, kalau tidak Supabase
    // menolak enroll baru dengan 422 (Unprocessable Content).
    await Promise.all(
      (data?.totp ?? [])
        .filter((item) => item.status !== 'verified')
        .map((item) => supabase.auth.mfa.unenroll({ factorId: item.id })),
    )
    const { data: enrolled, error } = await supabase.auth.mfa.enroll({ factorType: 'totp', friendlyName: 'Purwakarta Admin' })
    if (error) return setMessage('MFA belum dapat disiapkan — coba muat ulang halaman.')
    setFactor(enrolled)
    setQr(enrolled.totp.uri)
    setSecret(enrolled.totp.uri.match(/secret=([^&]+)/)?.[1] ?? '')
  }

  async function verifyMfa(event) {
    event.preventDefault()
    setBusy(true)
    const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId: factor.id })
    if (challengeError) return setMessage('MFA gagal diproses.')
    const { error } = await supabase.auth.mfa.verify({ factorId: factor.id, challengeId: challenge.id, code })
    if (error) setMessage('Kode MFA salah atau sudah kedaluwarsa.')
    else navigate('/panel-kj29xz', { replace: true })
    setBusy(false)
  }

  if (!isSupabaseReady) return <DecoyStatistik />
  if (session && !factor && !location.state?.mfaRequired) return <Navigate to="/panel-kj29xz" replace />

  return (
    <section className="page-section empty-state" style={{ paddingTop: 150 }}>
      <div className="stat-setup">
        <h2 style={{ margin: '12px 0' }}>{factor ? 'Verifikasi MFA' : 'Admin Access'}</h2>
        <p>Akses terbatas.</p>
        {!factor ? (
          <form className="kontak-form" onSubmit={submitLogin} style={{ maxWidth: 360, margin: '20px auto 0', textAlign: 'left' }}>
            <div className="form-group"><label htmlFor="admin-email">Email</label><input id="admin-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="username" /></div>
            <div className="form-group"><label htmlFor="admin-password">Password</label><input id="admin-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} autoComplete="current-password" /></div>
            {failures >= 3 && <div ref={turnstileRef} aria-label="Verifikasi keamanan" style={{ marginBottom: 16 }} />}
            {message && <p role="alert" className="form-error">{message}</p>}
            <button type="submit" className="btn btn-primary" disabled={busy}>Masuk</button>
          </form>
        ) : (
          <form className="kontak-form" onSubmit={verifyMfa} style={{ maxWidth: 360, margin: '20px auto 0', textAlign: 'left' }}>
            {secret && (
              <>
                <p style={{ marginBottom: 4 }}><strong>Langkah setup:</strong> buka Google Authenticator di HP → tombol <strong>+</strong> → <em>Enter a setup key</em> → paste kode ini:</p>
                <input
                  value={secret}
                  readOnly
                  aria-label="Kode rahasia MFA"
                  onFocus={(event) => event.target.select()}
                  onClick={(event) => event.target.select()}
                  style={{ width: '100%', marginBottom: 12, fontWeight: 700, letterSpacing: 1 }}
                />
                <details style={{ marginBottom: 12 }}>
                  <summary style={{ cursor: 'pointer', fontSize: 13 }}>URI lengkap (alternatif scan)</summary>
                  <input value={qr} readOnly aria-label="MFA provisioning URI" onFocus={(event) => event.target.select()} onClick={(event) => event.target.select()} style={{ width: '100%', fontSize: 12 }} />
                </details>
              </>
            )}
            <div className="form-group"><label htmlFor="mfa-code">Kode authenticator</label><input id="mfa-code" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={code} onChange={(event) => setCode(event.target.value)} required /></div>
            {message && <p role="alert" className="form-error">{message}</p>}
            <button type="submit" className="btn btn-primary" disabled={busy}>Verifikasi</button>
          </form>
        )}
      </div>
    </section>
  )
}

export default AdminLogin
