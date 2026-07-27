/**
 * Formulário de contato / orçamento da ERtech.
 * Rota: POST /api/contact   Body: { name, email, message, company?, _hp? }
 *
 * Encaminha a mensagem para um webhook configurável (n8n, Discord, Telegram,
 * Slack, Make...). Configure no Cloudflare Pages:
 *   Settings > Variables and secrets > CONTACT_WEBHOOK = <url do webhook>
 * A URL fica no servidor — nunca é exposta ao cliente.
 */
function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  })
}

const clean = (s, max) => String(s ?? '').trim().slice(0, max)

export async function onRequestPost({ request, env }) {
  let body
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Requisição inválida.' }, 400)
  }

  // Honeypot anti-spam: se preenchido, finge sucesso e ignora.
  if (clean(body._hp, 50)) return json({ ok: true })

  const name = clean(body.name, 120)
  const email = clean(body.email, 160)
  const company = clean(body.company, 120)
  const message = clean(body.message, 3000)

  if (!name || !email || !message) return json({ error: 'Preencha nome, e-mail e mensagem.' }, 400)
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json({ error: 'E-mail inválido.' }, 400)

  const webhook = env.CONTACT_WEBHOOK
  if (!webhook) {
    return json({
      error: 'Envio ainda não configurado no servidor. Use o e-mail direto por enquanto.',
      fallback: true,
    }, 503)
  }

  const payload = {
    fonte: 'ertechnol.com.br',
    recebido_em: new Date().toISOString(),
    nome: name,
    email,
    empresa: company || null,
    mensagem: message,
    ip: request.headers.get('CF-Connecting-IP') || null,
    // Formatos comuns já prontos:
    content: `Novo contato ERtech\nNome: ${name}\nE-mail: ${email}${company ? `\nEmpresa: ${company}` : ''}\n\n${message}`,
    text: `Novo contato ERtech — ${name} <${email}>`,
  }

  try {
    const r = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!r.ok) return json({ error: 'Não foi possível enviar agora. Tente novamente.' }, 502)
  } catch {
    return json({ error: 'Falha ao enviar a mensagem.' }, 502)
  }

  return json({ ok: true })
}
