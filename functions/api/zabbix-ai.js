/**
 * Proxy de IA para as ferramentas Zabbix (geração e explicação de templates).
 * Reutiliza a chave Gemini já usada pelo PacketBot — NUNCA exposta ao cliente.
 *
 * Rota: POST /api/zabbix-ai   Body: { mode: 'generate' | 'explain', input, question? }
 */
const MODEL = 'gemini-flash-latest'
const MAX_INPUT = 12000

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  })
}

const PROMPTS = {
  generate: `Você é um especialista em Zabbix. A partir da descrição do usuário, gere um template de export do Zabbix 6.0 COMPLETO e VÁLIDO no formato YAML.
Regras:
- Responda APENAS com o YAML do template (comece em "zabbix_export:"), sem cercas de código markdown, sem explicações.
- Use a sintaxe de trigger do 6.0+: func(/Template/key). Inclua uuid (32 hex) em template, items e triggers.
- Crie items e triggers coerentes com o que foi pedido (CPU, disco, memória, ping, HTTP etc.).
- Use macros ({$MACRO}) para limiares quando fizer sentido.`,
  explain: `Você é um especialista em Zabbix. Explique o template abaixo em português do Brasil, de forma clara e organizada:
- Visão geral do que o template monitora.
- Liste os principais items (o que cada um coleta).
- Liste as triggers (o que dispara cada alerta e em que condição).
- Aponte macros e valores configuráveis.
Seja objetivo e use listas. Não invente elementos que não estão no template.`,
}

export async function onRequestPost({ request, env }) {
  const KEY = env.GEMINI_KEY || env.VITE_GEMINI_KEY
  if (!KEY) return json({ error: 'IA indisponível: chave não configurada no servidor.' }, 503)

  let body
  try { body = await request.json() } catch { return json({ error: 'Requisição inválida.' }, 400) }

  const mode = body?.mode === 'explain' ? 'explain' : 'generate'
  const input = String(body?.input ?? '').slice(0, MAX_INPUT)
  const question = String(body?.question ?? '').slice(0, 500)
  if (!input.trim()) return json({ error: 'Entrada vazia.' }, 400)

  let userText = input
  if (mode === 'explain' && question) {
    userText = `Template:\n${input}\n\nPergunta adicional do usuário: ${question}`
  }

  const payload = {
    system_instruction: { parts: [{ text: PROMPTS[mode] }] },
    contents: [{ role: 'user', parts: [{ text: userText }] }],
    generationConfig: {
      temperature: mode === 'generate' ? 0.4 : 0.5,
      maxOutputTokens: 2048,
    },
  }

  let data
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }
    )
    data = await res.json()
    if (!res.ok) return json({ error: 'Não consegui responder agora. Tente novamente.' }, 502)
  } catch {
    return json({ error: 'Falha de conexão com a IA.' }, 502)
  }

  let reply = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') ?? ''
  // remove cercas de markdown se o modelo insistir
  reply = reply.replace(/^```[a-z]*\n?/i, '').replace(/\n?```\s*$/i, '').trim()
  if (!reply) return json({ error: 'Resposta vazia.' }, 200)

  return json({ reply })
}
