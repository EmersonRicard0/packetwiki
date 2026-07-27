/**
 * "Meu IP" — mostra IP, ASN, país e detalhes da conexão do visitante.
 * Rota: GET /api/whoami   (usa os dados de borda do Cloudflare)
 */
function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  })
}

export async function onRequestGet({ request }) {
  const cf = request.cf || {}
  return json({
    ip: request.headers.get('CF-Connecting-IP') || null,
    asn: cf.asn ? 'AS' + cf.asn : null,
    org: cf.asOrganization || null,
    country: cf.country || null,
    region: cf.region || null,
    city: cf.city || null,
    colo: cf.colo || null,
    tlsVersion: cf.tlsVersion || null,
    httpProtocol: cf.httpProtocol || null,
    userAgent: request.headers.get('User-Agent') || null,
  })
}
