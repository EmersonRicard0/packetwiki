/**
 * zabbix-parser.js — leitura, detecção de formato e serialização de templates Zabbix.
 *
 * Suporta os três formatos de export do Zabbix: XML (antigo), JSON e YAML (novos).
 * Tudo é normalizado para um objeto JS com a raiz `zabbix_export`, o que facilita
 * a manipulação pelas regras de conversão/migração.
 *
 * As bibliotecas pesadas (fast-xml-parser, js-yaml) são carregadas via import
 * dinâmico — só entram no bundle quando a função é chamada (no cliente).
 */

/** Garante que um nó vire array (fast-xml-parser devolve objeto único quando há 1 item). */
export function toArray(x) {
  if (x === undefined || x === null) return []
  return Array.isArray(x) ? x : [x]
}

/** Detecta o formato pelo nome do arquivo e/ou pelo conteúdo. */
export function detectFormat(fileName = '', content = '') {
  const ext = (fileName.split('.').pop() || '').toLowerCase()
  if (ext === 'xml') return 'xml'
  if (ext === 'json') return 'json'
  if (ext === 'yaml' || ext === 'yml') return 'yaml'
  // fallback por conteúdo
  const t = content.trimStart()
  if (t.startsWith('<')) return 'xml'
  if (t.startsWith('{')) return 'json'
  return 'yaml'
}

/** Lê o conteúdo e retorna { format, data } com data = { zabbix_export: {...} }. */
export async function parseTemplate(content, format) {
  if (format === 'json') {
    return JSON.parse(content)
  }
  if (format === 'yaml') {
    const yaml = await import('js-yaml')
    return yaml.load(content)
  }
  // xml
  const { XMLParser } = await import('fast-xml-parser')
  const parser = new XMLParser({
    ignoreAttributes: true, // Zabbix usa elementos, não atributos
    ignoreDeclaration: true, // descarta <?xml ... ?>
    ignorePiTags: true,
    parseTagValue: false, // mantém valores como string (evita perder zeros à esquerda)
    trimValues: true,
  })
  return parser.parse(content)
}

/** Serializa o objeto de volta para o formato escolhido. */
export async function serializeTemplate(data, outputFormat) {
  if (outputFormat === 'json') {
    return JSON.stringify(data, null, 4)
  }
  if (outputFormat === 'yaml') {
    const yaml = await import('js-yaml')
    return yaml.dump(data, { lineWidth: -1, noRefs: true })
  }
  // xml
  const { XMLBuilder } = await import('fast-xml-parser')
  const builder = new XMLBuilder({
    ignoreAttributes: true,
    format: true,
    indentBy: '    ',
    suppressEmptyNode: false,
  })
  return '<?xml version="1.0" encoding="UTF-8"?>\n' + builder.build(data)
}

/** Extensão de arquivo correspondente ao formato. */
export function extFor(format) {
  return format === 'xml' ? 'xml' : format === 'json' ? 'json' : 'yaml'
}
