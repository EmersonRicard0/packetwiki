/**
 * Checador HTTP/HTTPS + cabeçalhos de segurança + certificado (best-effort via CT logs).
 * Rota: GET /api/httpcheck?url=exemplo.com
 */
function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  })
}

const SEC_HEADERS = [
  ['strict-transport-security', 'HSTS'],
  ['content-security-policy', 'CSP'],
  ['x-frame-options', 'X-Frame-Options'],
  ['x-content-type-options', 'X-Content-Type-Options'],
  ['referrer-policy', 'Referrer-Policy'],
  ['permissions-policy', 'Permissions-Policy'],
]

// Busca o certificado mais recente nos logs de Certificate Transparency (crt.sh).
async function certInfo(host) {
  try {
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), 4500)
    const r = await fetch(`https://crt.sh/?q=${encodeURIComponent(host)}&output=json`, {
      signal: ctrl.signal,
      headers: { 'User-Agent': 'ertech-wiki' },
    })
    clearTimeout(t)
    if (!r.ok) return null
    const arr = await r.json()
    if (!Array.isArray(arr) || !arr.length) return null
    arr.sort((a, b) => new Date(b.not_after) - new Date(a.not_after))
    const c = arr[0]
    const notAfter = new Date(c.not_after + 'Z')
    const days = Math.round((notAfter - Date.now()) / 86400000)
    return {
      issuer: (c.issuer_name || '').replace(/.*O=([^,]+).*/, '$1') || c.issuer_name,
      notBefore: c.not_before,
      notAfter: c.not_after,
      daysLeft: days,
    }
  } catch {
    return null
  }
}

export async function onRequestGet({ request }) {
  let input = (new URL(request.url).searchParams.get('url') || '').trim()
  if (!input) return json({ error: 'Informe uma URL ou domínio.' }, 400)
  if (!/^https?:\/\//i.test(input)) input = 'https://' + input

  let target
  try {
    target = new URL(input)
  } catch {
    return json({ error: 'URL inválida.' }, 400)
  }
  if (!/^[a-z0-9.-]+$/i.test(target.hostname)) return json({ error: 'Host inválido.' }, 400)

  const started = Date.now()
  let resp
  try {
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), 9000)
    resp = await fetch(target.toString(), {
      method: 'GET',
      redirect: 'follow',
      signal: ctrl.signal,
      headers: { 'User-Agent': 'ERtech-HTTPCheck/1.0' },
    })
    clearTimeout(t)
  } catch (e) {
    return json({ error: 'Não foi possível conectar ao destino.', detail: String(e.message || e).slice(0, 120) }, 200)
  }
  const ms = Date.now() - started

  const headers = {}
  const security = SEC_HEADERS.map(([h, label]) => ({
    label,
    present: resp.headers.has(h),
    value: resp.headers.get(h) || null,
  }))
  ;['server', 'content-type'].forEach((h) => { if (resp.headers.get(h)) headers[h] = resp.headers.get(h) })

  const cert = target.protocol === 'https:' ? await certInfo(target.hostname) : null
  const secScore = security.filter((s) => s.present).length

  return json({
    url: target.toString(),
    finalUrl: resp.url,
    redirected: resp.redirected,
    status: resp.status,
    statusText: resp.statusText,
    https: target.protocol === 'https:',
    responseTimeMs: ms,
    server: headers.server || null,
    contentType: headers['content-type'] || null,
    security,
    securityScore: `${secScore}/${SEC_HEADERS.length}`,
    cert,
  })
}
