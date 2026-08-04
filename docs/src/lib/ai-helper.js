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

/* ── Fallback heurístico: gera um template RICO a partir de palavras-chave ── */
const TNAME = 'Template ERtech Gerado'

function mkItem(name, key, { type = 'ZABBIX_ACTIVE', delay = '1m', value_type = 'FLOAT', units = '', history = '7d', trends = '365d', component = 'System' } = {}) {
  const it = { uuid: uuid(), name, type, key, delay, value_type, history, trends, tags: { tag: [{ tag: 'component', value: component }] } }
  if (units) it.units = units
  return it
}
function mkTrigger(expression, name, priority, description) {
  return { uuid: uuid(), expression, name, priority, ...(description ? { description } : {}) }
}

// Cada receita gera items + triggers + macros detalhados.
const RECIPES = [
  {
    kw: ['cpu', 'processador'],
    build: () => ({
      items: [
        mkItem('CPU utilization', 'system.cpu.util', { units: '%', component: 'CPU' }),
        mkItem('CPU load average (1m)', 'system.cpu.load[all,avg1]', { component: 'CPU' }),
      ],
      triggers: [mkTrigger(`min(/${TNAME}/system.cpu.util,5m)>{$CPU.UTIL.MAX}`, 'CPU utilization alta (>{$CPU.UTIL.MAX}% por 5m)', 'WARNING', 'Uso de CPU acima do limite por período sustentado.')],
      macros: [{ macro: '{$CPU.UTIL.MAX}', value: '90', description: 'Limite máximo de uso de CPU (%)' }],
    }),
  },
  {
    kw: ['memória', 'memoria', 'memory', 'ram'],
    build: () => ({
      items: [
        mkItem('Memory utilization', 'vm.memory.utilization', { units: '%', component: 'Memory' }),
        mkItem('Available memory', 'vm.memory.size[available]', { value_type: 'UNSIGNED', units: 'B', component: 'Memory' }),
      ],
      triggers: [mkTrigger(`min(/${TNAME}/vm.memory.utilization,5m)>{$MEM.UTIL.MAX}`, 'Memória alta (>{$MEM.UTIL.MAX}% por 5m)', 'AVERAGE', 'Uso de memória acima do limite.')],
      macros: [{ macro: '{$MEM.UTIL.MAX}', value: '90', description: 'Limite máximo de uso de memória (%)' }],
    }),
  },
  {
    kw: ['disco', 'disk', 'espaço', 'espaco', 'storage'],
    build: () => ({
      items: [mkItem('Free disk space on / (percentage)', 'vfs.fs.size[/,pfree]', { units: '%', component: 'Storage' })],
      triggers: [mkTrigger(`max(/${TNAME}/vfs.fs.size[/,pfree],5m)<{$DISK.PFREE.MIN}`, 'Pouco espaço em / (<{$DISK.PFREE.MIN}%)', 'HIGH', 'Espaço livre em disco abaixo do limite.')],
      macros: [{ macro: '{$DISK.PFREE.MIN}', value: '10', description: 'Espaço livre mínimo em disco (%)' }],
    }),
  },
  {
    kw: ['rede', 'network', 'interface', 'tráfego', 'trafego', 'banda'],
    build: () => ({
      items: [
        mkItem('Interface eth0: bits received', 'net.if.in[eth0]', { value_type: 'UNSIGNED', units: 'bps', component: 'Network' }),
        mkItem('Interface eth0: bits sent', 'net.if.out[eth0]', { value_type: 'UNSIGNED', units: 'bps', component: 'Network' }),
      ],
      triggers: [mkTrigger(`avg(/${TNAME}/net.if.in[eth0],5m)>{$IF.IN.MAX}`, 'Tráfego de entrada alto na eth0', 'INFO', 'Uso de banda de entrada acima do esperado.')],
      macros: [{ macro: '{$IF.IN.MAX}', value: '900000000', description: 'Limite de tráfego de entrada (bps)' }],
    }),
  },
  {
    kw: ['ping', 'disponibilidade', 'online', 'icmp'],
    build: () => ({
      items: [
        mkItem('ICMP ping', 'icmpping', { type: 'SIMPLE', value_type: 'UNSIGNED', component: 'Availability' }),
        mkItem('ICMP response time', 'icmppingsec', { type: 'SIMPLE', units: 's', component: 'Availability' }),
      ],
      triggers: [mkTrigger(`max(/${TNAME}/icmpping,#3)=0`, 'Host sem resposta a ICMP (3 tentativas)', 'HIGH', 'O host não respondeu ao ping nas últimas verificações.')],
      macros: [],
    }),
  },
  {
    kw: ['http', 'web', 'site', 'url', 'https'],
    build: () => ({
      items: [
        mkItem('HTTP service is up', 'net.tcp.service[http]', { type: 'SIMPLE', value_type: 'UNSIGNED', component: 'Application' }),
        mkItem('HTTP response time', 'net.tcp.service.perf[http]', { type: 'SIMPLE', units: 's', component: 'Application' }),
      ],
      triggers: [mkTrigger(`last(/${TNAME}/net.tcp.service[http])=0`, 'Serviço HTTP indisponível', 'DISASTER', 'O serviço HTTP não está respondendo.')],
      macros: [],
    }),
  },
]

export async function heuristicTemplate(description) {
  const d = (description || '').toLowerCase()
  // Items de base (sempre presentes)
  const items = [
    mkItem('Zabbix agent availability', 'zabbix[host,agent,available]', { value_type: 'UNSIGNED', component: 'Availability' }),
    mkItem('System uptime', 'system.uptime', { value_type: 'UNSIGNED', units: 's', component: 'System' }),
    mkItem('System name', 'system.hostname', { value_type: 'CHAR', delay: '1h', trends: '0', component: 'System' }),
  ]
  const triggers = [
    mkTrigger(`max(/${TNAME}/zabbix[host,agent,available],5m)=0`, 'Agente Zabbix indisponível', 'HIGH', 'O agente não está acessível há mais de 5 minutos.'),
    mkTrigger(`last(/${TNAME}/system.uptime)<600`, 'Host foi reiniciado (uptime < 10m)', 'INFO', 'O host reiniciou recentemente.'),
  ]
  const macros = []

  for (const r of RECIPES) {
    if (!r.kw.some((k) => d.includes(k))) continue
    const built = r.build()
    items.push(...built.items)
    triggers.push(...built.triggers)
    macros.push(...built.macros)
  }

  const obj = {
    zabbix_export: {
      version: '6.0',
      template_groups: [{ uuid: uuid(), name: 'Templates/ERtech' }],
      templates: {
        template: [{
          uuid: uuid(),
          template: TNAME,
          name: TNAME,
          description: `Template gerado a partir de: "${description}". Revise antes de usar em produção.`,
          groups: { group: [{ name: 'Templates/ERtech' }] },
          items: { item: items },
          triggers: { trigger: triggers },
          ...(macros.length ? { macros: { macro: macros } } : {}),
          tags: { tag: [{ tag: 'source', value: 'ertech-suite' }] },
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
