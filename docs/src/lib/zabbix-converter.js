/**
 * zabbix-converter.js — regras de transformação de templates entre versões do Zabbix.
 *
 * Cada regra é uma função isolada que recebe o objeto do template, aplica a mudança
 * e registra no `summary` o que fez. Assim é fácil adicionar novas regras.
 *
 * A função principal é convertTemplate(data, sourceVersion, targetVersion).
 */
import { toArray } from './zabbix-parser.js'

export const VERSIONS = ['5.4', '6.0', '6.4', '7.0']
const idx = (v) => VERSIONS.indexOf(v)
/** true se a >= b na ordem de versões suportadas. */
const gte = (a, b) => idx(a) >= idx(b)

/** UUID no formato do Zabbix: 32 hex, sem hífens. */
function zbxUuid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID().replace(/-/g, '')
  }
  // fallback simples
  return Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
}

/* ────────────────────────────────────────────────────────────────
   REGRA 1 — Atualiza o campo de versão do export (sempre aplicada)
   ──────────────────────────────────────────────────────────────── */
function updateExportVersion(root, target, summary) {
  const exp = root.zabbix_export
  if (!exp) return
  const before = exp.version
  exp.version = target
  summary.changes.push({
    type: 'version',
    description: `Versão do export atualizada de ${before || '?'} para ${target}`,
    count: 1,
  })
}

/* ────────────────────────────────────────────────────────────────
   REGRA 2 — Moderniza a sintaxe das expressões de trigger
   Zabbix 6.0 trocou {host:item.func(params)} por func(/host/item,params).
   Ex.: {App:agent.ping.last()}=0  →  last(/App/agent.ping)=0
   Aplica quando origem < 6.0 e destino >= 6.0.
   ──────────────────────────────────────────────────────────────── */
function modernizeExpression(expr, samples) {
  if (typeof expr !== 'string') return expr
  // Processa cada token {...} individualmente. Só converte os que têm a forma
  // posicional host:key.func(params) — macros como {$X} ou {HOST.NAME} passam intactas.
  // A chave (key) pode conter pontos e colchetes (ex.: vfs.fs.size[/,pfree]),
  // por isso capturamos de forma gulosa até a última .func(...) do token.
  const converted = expr.replace(/\{([^{}]+)\}/g, (whole, inner) => {
    const m = inner.match(/^([^:]+):(.+)\.(\w+)\(([^)]*)\)$/)
    if (!m) return whole
    const [, host, key, func, params] = m
    const p = params.trim()
    return p ? `${func}(/${host}/${key},${p})` : `${func}(/${host}/${key})`
  })
  if (converted !== expr) samples.push({ before: expr, after: converted })
  return converted
}

function modernizeTriggers(root, source, target, summary) {
  if (!(gte(target, '6.0') && !gte(source, '6.0'))) return
  const samples = []
  let count = 0

  const fixTrigger = (trig) => {
    if (!trig) return
    for (const field of ['expression', 'recovery_expression']) {
      if (trig[field]) {
        const before = trig[field]
        trig[field] = modernizeExpression(trig[field], samples)
        if (trig[field] !== before) count++
      }
    }
  }

  // triggers no nível do template e triggers globais do export
  for (const tpl of toArray(root.zabbix_export?.templates?.template)) {
    for (const trig of toArray(tpl.triggers?.trigger)) fixTrigger(trig)
    // trigger prototypes dentro de discovery rules
    for (const rule of toArray(tpl.discovery_rules?.discovery_rule)) {
      for (const tp of toArray(rule.trigger_prototypes?.trigger_prototype)) fixTrigger(tp)
    }
  }
  for (const trig of toArray(root.zabbix_export?.triggers?.trigger)) fixTrigger(trig)

  if (count > 0) {
    summary.changes.push({
      type: 'triggers',
      description: `${count} expressão(ões) de trigger modernizada(s) para a sintaxe do 6.0+`,
      count,
      samples: samples.slice(0, 8),
    })
  }
}

/* ────────────────────────────────────────────────────────────────
   REGRA 3 — Gera UUIDs ausentes
   Desde o 6.0, todo objeto exportado (template, item, trigger, regra de
   descoberta, gráfico, valuemap...) precisa de um `uuid`. Templates 5.4
   não têm — então geramos.
   ──────────────────────────────────────────────────────────────── */
function ensureUuids(root, target, summary) {
  if (!gte(target, '6.0')) return
  let count = 0
  const add = (obj) => {
    if (obj && typeof obj === 'object' && !obj.uuid) {
      obj.uuid = zbxUuid()
      count++
    }
  }

  const exp = root.zabbix_export || {}
  for (const tpl of toArray(exp.templates?.template)) {
    add(tpl)
    for (const it of toArray(tpl.items?.item)) add(it)
    for (const trig of toArray(tpl.triggers?.trigger)) add(trig)
    for (const g of toArray(tpl.graphs?.graph)) add(g)
    for (const vm of toArray(tpl.valuemaps?.valuemap)) add(vm)
    for (const rule of toArray(tpl.discovery_rules?.discovery_rule)) {
      add(rule)
      for (const ip of toArray(rule.item_prototypes?.item_prototype)) add(ip)
      for (const tp of toArray(rule.trigger_prototypes?.trigger_prototype)) add(tp)
      for (const gp of toArray(rule.graph_prototypes?.graph_prototype)) add(gp)
    }
  }
  // grupos de template (nível export) também usam uuid no 6.0+
  for (const grp of toArray(exp.groups?.group)) add(grp)
  for (const vm of toArray(exp.value_maps?.value_map)) add(vm)

  if (count > 0) {
    summary.changes.push({
      type: 'uuid',
      description: `${count} UUID(s) gerado(s) para objetos que não tinham (obrigatório no 6.0+)`,
      count,
    })
  }
}

/**
 * Converte o template para a versão de destino.
 * @returns {{ data: object, summary: { changes: Array } }}
 */
export function convertTemplate(data, sourceVersion, targetVersion) {
  // trabalha sobre uma cópia para não alterar o objeto original
  const root = JSON.parse(JSON.stringify(data))
  const summary = { changes: [], source: sourceVersion, target: targetVersion }

  updateExportVersion(root, targetVersion, summary)
  modernizeTriggers(root, sourceVersion, targetVersion, summary)
  ensureUuids(root, targetVersion, summary)

  return { data: root, summary }
}
