/**
 * nslookup / dig via DNS-over-HTTPS (Cloudflare 1.1.1.1).
 * Rota: GET /api/dns?name=exemplo.com&type=A
 * Não expõe nada sensível; só consulta DNS pública.
 */

const TYPES = ['A', 'AAAA', 'MX', 'TXT', 'NS', 'CNAME', 'SOA', 'CAA', 'SRV', 'PTR']

// Mapa número->nome de tipo (para exibir bonito)
const TYPE_NAMES = {
  1: 'A', 28: 'AAAA', 15: 'MX', 16: 'TXT', 2: 'NS',
  5: 'CNAME', 6: 'SOA', 257: 'CAA', 33: 'SRV', 12: 'PTR',
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  })
}

// Converte IP em nome reverso (in-addr.arpa / ip6.arpa) para PTR
function reverseName(ip) {
  if (ip.includes(':')) {
    // IPv6: expande e inverte nibbles
    const parts = ip.split('::')
    let head = parts[0] ? parts[0].split(':') : []
    let tail = parts[1] ? parts[1].split(':') : []
    const missing = 8 - head.length - tail.length
    const full = [...head, ...Array(missing).fill('0'), ...tail]
      .map((h) => h.padStart(4, '0')).join('')
    if (full.length !== 32) return null
    return full.split('').reverse().join('.') + '.ip6.arpa'
  }
  const o = ip.split('.')
  if (o.length !== 4 || o.some((x) => +x < 0 || +x > 255)) return null
  return o.reverse().join('.') + '.in-addr.arpa'
}

export async function onRequestGet({ request }) {
  const url = new URL(request.url)
  let name = (url.searchParams.get('name') || '').trim().toLowerCase()
  const type = (url.searchParams.get('type') || 'A').toUpperCase()

  if (!name) return json({ error: 'Informe um domínio ou IP.' }, 400)
  if (!TYPES.includes(type)) return json({ error: 'Tipo de registro não suportado.' }, 400)

  if (type === 'PTR') {
    const rev = reverseName(name)
    if (!rev) return json({ error: 'Para PTR, informe um IP válido.' }, 400)
    name = rev
  }

  if (!/^[a-z0-9._-]+$/.test(name)) return json({ error: 'Nome inválido.' }, 400)

  try {
    const res = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=${type}`,
      { headers: { accept: 'application/dns-json' } }
    )
    if (!res.ok) return json({ error: 'Falha na consulta DNS.' }, 502)
    const data = await res.json()

    const answers = (data.Answer || []).map((a) => ({
      name: a.name,
      type: TYPE_NAMES[a.type] || a.type,
      ttl: a.TTL,
      data: a.data,
    }))

    return json({
      name,
      type,
      status: data.Status, // 0 = NOERROR, 3 = NXDOMAIN
      authority: (data.Authority || []).map((a) => a.data),
      answers,
    })
  } catch {
    return json({ error: 'Erro ao consultar o DNS.' }, 502)
  }
}
