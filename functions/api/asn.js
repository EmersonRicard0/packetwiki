/**
 * Consulta de ASN / IP via RIPEstat (dados públicos).
 * Rota: GET /api/asn?q=AS13335   ou   /api/asn?q=1.1.1.1
 * Retorna: dono (holder), país, prefixos anunciados / ASN de origem do IP.
 */

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  })
}

async function ripe(call, resource) {
  try {
    const r = await fetch(
      `https://stat.ripe.net/data/${call}/data.json?resource=${encodeURIComponent(resource)}&sourceapp=ertech-wiki`
    )
    return r.ok ? await r.json() : null
  } catch {
    return null
  }
}

const isIPv4 = (s) => /^(\d{1,3}\.){3}\d{1,3}$/.test(s) && s.split('.').every((o) => +o <= 255)
const isIPv6 = (s) => /^[0-9a-f:]+$/i.test(s) && s.includes(':')

export async function onRequestGet({ request }) {
  const q = (new URL(request.url).searchParams.get('q') || '').trim()
  if (!q) return json({ error: 'Informe um ASN (ex.: AS13335) ou um IP.' }, 400)

  const asMatch = q.match(/^as[\s]*?(\d{1,10})$/i)

  // ── ASN ──
  if (asMatch) {
    const asn = 'AS' + asMatch[1]
    const [ov, pref] = await Promise.all([
      ripe('as-overview', asn),
      ripe('announced-prefixes', asn),
    ])
    if (!ov?.data) return json({ error: 'ASN não encontrado.' }, 404)
    const prefixes = (pref?.data?.prefixes || []).map((p) => p.prefix)
    return json({
      kind: 'asn',
      asn,
      holder: ov.data.holder || null,
      announced: ov.data.announced,
      prefixCount: prefixes.length,
      prefixes: prefixes.slice(0, 250),
    })
  }

  // ── IP ──
  if (isIPv4(q) || isIPv6(q)) {
    const ni = await ripe('network-info', q)
    const asns = (ni?.data?.asns || []).map((a) => 'AS' + a)
    const prefix = ni?.data?.prefix || null
    let holder = null
    if (asns[0]) {
      const ov = await ripe('as-overview', asns[0])
      holder = ov?.data?.holder || null
    }
    if (!asns.length && !prefix) return json({ error: 'IP sem informação de roteamento.' }, 404)
    return json({ kind: 'ip', ip: q, asns, prefix, holder })
  }

  return json({ error: 'Entrada inválida. Use um ASN (AS13335) ou um IP.' }, 400)
}
