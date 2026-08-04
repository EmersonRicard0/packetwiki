/**
 * ai-helper.js — cliente das ferramentas de IA (Assistente e Explicador).
 *
 * Chama a função serverless /api/zabbix-ai (que usa a chave Gemini no servidor).
 * Se a IA não estiver disponível (sem chave / preview local), cai num fallback
 * HEURÍSTICO que roda 100% no navegador, para a ferramenta nunca ficar "morta".
 */
import { parseTemplate, serializeTemplate, detectFormat, toArray } from './zabbix-parser.js'

const AI_ENDPOINT = '/api/zabbix-ai'

/** Chamada à IA. Lança { unavailable: true } quando não há backend de IA. */
export async function callAI(mode, input, question = '') {
  const res = await fetch(AI_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mode, input, question }),
  })
  if (res.status === 404 || res.status === 405 || res.status === 503) {
    const err = new Error('IA indisponível')
    err.unavailable = true
    throw err
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok || data.error) throw new Error(data.error || 'Falha na IA.')
  return data.reply
}

function uuid() {
  return (crypto?.randomUUID?.() || Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('')).replace(/-/g, '')
}

/* ── Fallback heurístico: gera um template a partir de palavras-chave ── */
const RECIPES = [
  { kw: ['cpu', 'processador'], item: { name: 'CPU utilization', key: 'system.cpu.util' }, macro: ['{$CPU.MAX}', '90'], op: '>', unit: '%' },
  { kw: ['disco', 'disk', 'espaço'], item: { name: 'Free disk space on /', key: 'vfs.fs.size[/,pfree]' }, macro: ['{$DISK.MIN}', '10'], op: '<', unit: '%' },
  { kw: ['memória', 'memoria', 'memory', 'ram'], item: { name: 'Memory utilization', key: 'vm.memory.utilization' }, macro: ['{$MEM.MAX}', '90'], op: '>', unit: '%' },
  { kw: ['ping', 'disponibilidade', 'up', 'online'], item: { name: 'ICMP ping', key: 'icmpping' }, macro: null, op: '=', unit: '', value: '0' },
  { kw: ['http', 'web', 'site', 'url'], item: { name: 'HTTP service', key: 'net.tcp.service[http]' }, macro: null, op: '=', unit: '', value: '0' },
]

export async function heuristicTemplate(description) {
  const d = (description || '').toLowerCase()
  const tName = 'Template ERtech Gerado'
  const items = []
  const triggers = []
  const macros = []

  for (const r of RECIPES) {
    if (!r.kw.some((k) => d.includes(k))) continue
    const it = { uuid: uuid(), name: r.item.name, type: 'ZABBIX_ACTIVE', key: r.item.key, delay: '1m' }
    items.push(it)
    if (r.macro) macros.push({ macro: r.macro[0], value: r.macro[1] })
    const rhs = r.macro ? r.macro[0] : r.value
    triggers.push({
      uuid: uuid(),
      expression: `last(/${tName}/${r.item.key})${r.op}${rhs}`,
      name: `${r.item.name} ${r.op} ${rhs}${r.unit}`,
      priority: 'WARNING',
    })
  }

  if (!items.length) {
    // nada reconhecido: cria um item genérico de ping
    items.push({ uuid: uuid(), name: 'ICMP ping', type: 'SIMPLE', key: 'icmpping', delay: '1m' })
    triggers.push({ uuid: uuid(), expression: `last(/${tName}/icmpping)=0`, name: 'Host indisponível', priority: 'HIGH' })
  }

  const obj = {
    zabbix_export: {
      version: '6.0',
      template_groups: [{ uuid: uuid(), name: 'Templates/ERtech' }],
      templates: {
        template: [{
          uuid: uuid(),
          template: tName,
          name: tName,
          groups: { group: [{ name: 'Templates/ERtech' }] },
          items: { item: items },
          triggers: { trigger: triggers },
          ...(macros.length ? { macros: { macro: macros } } : {}),
        }],
      },
    },
  }
  return await serializeTemplate(obj, 'yaml')
}

/* ── Fallback heurístico: resume o template sem IA ── */
export async function heuristicExplain(content, fileName = '') {
  const fmt = detectFormat(fileName, content)
  const data = await parseTemplate(content, fmt)
  const exp = data?.zabbix_export || {}
  const tpls = toArray(exp.templates?.template)
  const lines = []
  lines.push(`Versão do export: ${exp.version || '?'}. Templates: ${tpls.length}.`)
  for (const t of tpls) {
    const items = toArray(t.items?.item)
    const trigs = toArray(t.triggers?.trigger)
    const macros = toArray(t.macros?.macro)
    lines.push(`\n### ${t.name || t.template}`)
    lines.push(`- ${items.length} item(s), ${trigs.length} trigger(s), ${macros.length} macro(s).`)
    if (items.length) lines.push('- Items: ' + items.slice(0, 15).map((i) => `${i.name || i.key} (\`${i.key}\`)`).join('; '))
    if (trigs.length) lines.push('- Triggers: ' + trigs.slice(0, 15).map((t2) => `${t2.name}`).join('; '))
    if (macros.length) lines.push('- Macros: ' + macros.map((m) => `${m.macro}=${m.value}`).join('; '))
  }
  lines.push('\n_(Resumo heurístico local — configure a IA no servidor para uma explicação detalhada.)_')
  return lines.join('\n')
}
