/**
 * zabbix-plugins.js — "ecossistema de plugins" do conversor de templates.
 *
 * Plugins são conjuntos de regras de substituição (regex) que o usuário instala
 * para estender a conversão. Ficam salvos no localStorage do navegador.
 *
 * Formato de um plugin:
 * {
 *   "id": "meu-plugin",
 *   "name": "Nome amigável",
 *   "version": "1.0.0",
 *   "description": "O que faz",
 *   "rules": [
 *     { "description": "troca X por Y", "pattern": "X", "flags": "g", "replace": "Y" }
 *   ]
 * }
 */
const KEY = 'ertech-zbx-plugins'

export function listPlugins() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function persist(plugins) {
  localStorage.setItem(KEY, JSON.stringify(plugins))
}

/** Valida o formato básico de um plugin. Lança erro com mensagem amigável. */
export function validatePlugin(p) {
  if (!p || typeof p !== 'object') throw new Error('JSON inválido.')
  if (!p.id || !p.name) throw new Error('Plugin precisa de "id" e "name".')
  if (!Array.isArray(p.rules) || !p.rules.length) throw new Error('Plugin precisa de ao menos uma regra em "rules".')
  for (const r of p.rules) {
    if (typeof r.pattern !== 'string' || typeof r.replace !== 'string') {
      throw new Error('Cada regra precisa de "pattern" e "replace" (string).')
    }
    // valida a regex já aqui
    new RegExp(r.pattern, r.flags || 'g')
  }
  return true
}

export function addPlugin(plugin) {
  validatePlugin(plugin)
  const plugins = listPlugins()
  const idx = plugins.findIndex((p) => p.id === plugin.id)
  const entry = { ...plugin, enabled: plugin.enabled !== false }
  if (idx >= 0) plugins[idx] = entry
  else plugins.push(entry)
  persist(plugins)
  return plugins
}

export function removePlugin(id) {
  const plugins = listPlugins().filter((p) => p.id !== id)
  persist(plugins)
  return plugins
}

export function togglePlugin(id) {
  const plugins = listPlugins()
  const p = plugins.find((x) => x.id === id)
  if (p) p.enabled = !p.enabled
  persist(plugins)
  return plugins
}

/**
 * Aplica as regras dos plugins ATIVOS sobre o texto (template já serializado).
 * @returns {{ text: string, applied: Array<{plugin, description, count}> }}
 */
export function applyPlugins(text) {
  let out = text
  const applied = []
  for (const p of listPlugins()) {
    if (p.enabled === false) continue
    for (const r of p.rules) {
      let re
      try {
        re = new RegExp(r.pattern, r.flags || 'g')
      } catch {
        continue
      }
      const count = (out.match(re) || []).length
      if (count > 0) {
        out = out.replace(re, r.replace)
        applied.push({ plugin: p.name, description: r.description || `${r.pattern} → ${r.replace}`, count })
      }
    }
  }
  return { text: out, applied }
}
