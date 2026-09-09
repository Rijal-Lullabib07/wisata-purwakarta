import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const cors = {
  'Access-Control-Allow-Origin': Deno.env.get('APP_ORIGIN') ?? '',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Credentials': 'true',
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: cors })
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  const ip = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || 'unknown'
  const userAgent = request.headers.get('user-agent')?.slice(0, 500) || null
  const body = await request.json().catch(() => null)
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
  const password = typeof body?.password === 'string' ? body.password : ''
  const turnstileToken = typeof body?.turnstile_token === 'string' ? body.turnstile_token : ''
  if (!email || password.length < 8) return json({ error: 'Invalid credentials' }, 400)

  const service = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } })
  const key = await digest(`${ip}:${email}`)
  const { data: attempt } = await service.from('admin_login_attempts').select('failed_count, locked_until').eq('key', key).maybeSingle()
  if (attempt?.locked_until && new Date(attempt.locked_until) > new Date()) {
    await audit(service, null, ip, userAgent, 'locked')
    return json({ error: 'Temporarily locked' }, 429)
  }
  // Captcha wajib setelah 3x gagal dan SELALU diverifikasi di sisi server,
  // supaya tidak bisa dilewati dengan memanggil API langsung tanpa token.
  if ((attempt?.failed_count ?? 0) >= 3 && !(turnstileToken && (await verifyTurnstile(turnstileToken, ip)))) {
    await audit(service, null, ip, userAgent, 'failure')
    return json({ error: 'Captcha required' }, 400)
  }
  if (turnstileToken && !(await verifyTurnstile(turnstileToken, ip))) return json({ error: 'Challenge failed' }, 400)

  const publicClient = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, { auth: { persistSession: false } })
  const { data, error } = await publicClient.auth.signInWithPassword({ email, password })
  if (error || !data.user || !data.session) {
    const failedCount = (attempt?.failed_count ?? 0) + 1
    await service.from('admin_login_attempts').upsert({ key, failed_count: failedCount, locked_until: failedCount >= 5 ? new Date(Date.now() + 15 * 60 * 1000).toISOString() : null, updated_at: new Date().toISOString() })
    await audit(service, null, ip, userAgent, failedCount >= 5 ? 'locked' : 'failure')
    return json({ error: 'Invalid credentials' }, 401)
  }

  const { data: admin } = await service.from('admin_users').select('user_id, role, is_active, mfa_required').eq('user_id', data.user.id).maybeSingle()
  if (!admin?.is_active || admin.role !== 'admin') {
    await publicClient.auth.signOut()
    await audit(service, data.user.id, ip, userAgent, 'failure')
    return json({ error: 'Invalid credentials' }, 401)
  }
  const { data: previous } = await service.from('admin_audit_logs').select('id').eq('user_id', data.user.id).eq('ip_address', ip.split(',')[0].trim()).eq('user_agent', userAgent).limit(1)
  await service.from('admin_login_attempts').delete().eq('key', key)
  await audit(service, data.user.id, ip, userAgent, 'success')
  if (!previous?.length) await notifyTelegram(`Admin login baru\nIP: ${ip}\nUser-Agent: ${userAgent || 'unknown'}`)
  return json({ session: data.session, mfa_required: admin.mfa_required })
})

async function audit(client: ReturnType<typeof createClient>, userId: string | null, ip: string, userAgent: string | null, status: string) {
  await client.from('admin_audit_logs').insert({ user_id: userId, ip_address: ip === 'unknown' ? null : ip.split(',')[0].trim(), user_agent: userAgent, status })
}

async function digest(value: string) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))
  return Array.from(new Uint8Array(bytes)).map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } })
}

async function verifyTurnstile(token: string, remoteip: string) {
  const secret = Deno.env.get('TURNSTILE_SECRET_KEY')
  if (!secret) return false
  const form = new FormData()
  form.append('secret', secret)
  form.append('response', token)
  if (remoteip !== 'unknown') form.append('remoteip', remoteip.split(',')[0].trim())
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form })
  return (await response.json()).success === true
}

async function notifyTelegram(message: string) {
  const token = Deno.env.get('TELEGRAM_BOT_TOKEN')
  const chatId = Deno.env.get('TELEGRAM_CHAT_ID')
  if (!token || !chatId) return
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: message }),
  })
}
