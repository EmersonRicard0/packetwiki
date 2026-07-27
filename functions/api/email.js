/**
 * Verificação de e-mail: SPF, DMARC e (opcional) DKIM, via DNS-over-HTTPS.
 * Rota: GET /api/email?domain=exemplo.com&selector=default
 */
function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  })
}

async function txt(name) {
  try {
    const r = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=TXT`,
      { headers: { accept: 'application/dns-json' } }
    )
    if (!r.ok) return []
    const d = await r.json()
    return (d.Answer || []).map((a) => (a.data || '').replace(/^"|"$/g, '').replace(/" "/g, ''))
  } catch {
    return []
  }
}

export async function onRequestGet({ request }) {
  const url = new URL(request.url)
  const domain = (url.searchParams.get('domain') || '').trim().toLowerCase()
  const selector = (url.searchParams.get('selector') || '').trim().toLowerCase()
  if (!domain || !/^[a-z0-9.-]+$/.test(domain)) return json({ error: 'Informe um domínio válido.' }, 400)

  const [root, dmarc] = await Promise.all([txt(domain), txt('_dmarc.' + domain)])

  const spfRec = root.find((r) => /^v=spf1/i.test(r)) || null
  const dmarcRec = dmarc.find((r) => /^v=dmarc1/i.test(r)) || null

  const dmarcPolicy = dmarcRec ? (dmarcRec.match(/\bp=([a-z]+)/i)?.[1] || null) : null
  const spfAll = spfRec ? (spfRec.match(/([-~?+]all)\b/i)?.[1] || null) : null

  let dkim = null
  if (selector) {
    const rec = await txt(`${selector}._domainkey.${domain}`)
    const found = rec.find((r) => /v=dkim1|p=/i.test(r)) || null
    dkim = { selector, found: !!found, record: found }
  }

  return json({
    domain,
    spf: { present: !!spfRec, record: spfRec, policy: spfAll },
    dmarc: { present: !!dmarcRec, record: dmarcRec, policy: dmarcPolicy },
    dkim,
    resumo: {
      spf: spfRec ? (spfAll === '-all' ? 'forte' : 'presente') : 'ausente',
      dmarc: dmarcRec ? (dmarcPolicy === 'reject' ? 'forte' : dmarcPolicy === 'quarantine' ? 'médio' : 'fraco (p=none)') : 'ausente',
    },
  })
}
