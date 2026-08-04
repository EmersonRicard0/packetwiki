/**
 * iac-converter.js — gera código Terraform / Ansible a partir de um template Zabbix.
 *
 * É um mapeamento ILUSTRATIVO (ponto de partida): os schemas reais dos providers
 * podem variar por versão. A ideia é acelerar a escrita de IaC, não substituir a
 * revisão manual. Baseado no provider `zabbix` (Terraform) e na coleção
 * `community.zabbix` (Ansible).
 */
import { toArray } from './zabbix-parser.js'

/** Sanitiza um nome para virar identificador HCL/YAML (letras, números, _). */
function slug(name, fallback = 'res') {
  const s = String(name || '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '')
  return s || fallback
}

function templates(data) {
  return toArray(data?.zabbix_export?.templates?.template)
}

/* ───────────────────────── Terraform ───────────────────────── */
export function toTerraform(data) {
  const lines = []
  lines.push('# Gerado pela suíte ERtech — revise antes de aplicar (schemas do provider podem variar).')
  lines.push('terraform {')
  lines.push('  required_providers {')
  lines.push('    zabbix = {')
  lines.push('      source = "claranet/zabbix"')
  lines.push('    }')
  lines.push('  }')
  lines.push('}')
  lines.push('')

  for (const tpl of templates(data)) {
    const tName = tpl.name || 'Template'
    const tId = slug(tName, 'template')
    const groups = toArray(tpl.groups?.group).map((g) => g.name).filter(Boolean)

    lines.push(`# Template: ${tName}`)
    lines.push(`resource "zabbix_template" "${tId}" {`)
    lines.push(`  host   = "${tName}"`)
    lines.push(`  name   = "${tName}"`)
    if (groups.length) lines.push(`  groups = [${groups.map((g) => `"${g}"`).join(', ')}]`)
    lines.push('}')
    lines.push('')

    for (const it of toArray(tpl.items?.item)) {
      const iId = `${tId}_${slug(it.key || it.name, 'item')}`
      lines.push(`resource "zabbix_item" "${iId}" {`)
      lines.push(`  template_id = zabbix_template.${tId}.id`)
      lines.push(`  name        = "${it.name || ''}"`)
      lines.push(`  key         = "${it.key || ''}"`)
      if (it.delay) lines.push(`  delay       = "${it.delay}"`)
      lines.push('}')
      lines.push('')
    }

    for (const tr of toArray(tpl.triggers?.trigger)) {
      const trId = `${tId}_${slug(tr.name, 'trigger')}`
      lines.push(`resource "zabbix_trigger" "${trId}" {`)
      lines.push(`  description = "${tr.name || ''}"`)
      lines.push(`  expression  = "${(tr.expression || '').replace(/"/g, '\\"')}"`)
      if (tr.priority) lines.push(`  priority    = "${tr.priority}"`)
      lines.push('}')
      lines.push('')
    }
  }
  return lines.join('\n')
}

/* ───────────────────────── Ansible ───────────────────────── */
export function toAnsible(data) {
  const out = []
  out.push('# Gerado pela suíte ERtech — revise antes de aplicar (coleção community.zabbix).')
  out.push('- name: Provisionar templates Zabbix')
  out.push('  hosts: zabbix_server')
  out.push('  gather_facts: false')
  out.push('  tasks:')

  for (const tpl of templates(data)) {
    const tName = tpl.name || 'Template'
    const groups = toArray(tpl.groups?.group).map((g) => g.name).filter(Boolean)

    out.push(`    - name: "Template ${tName}"`)
    out.push('      community.zabbix.zabbix_template:')
    out.push(`        template_name: "${tName}"`)
    if (groups.length) {
      out.push('        template_groups:')
      groups.forEach((g) => out.push(`          - "${g}"`))
    }
    out.push('        state: present')
    out.push('')

    for (const it of toArray(tpl.items?.item)) {
      out.push(`    - name: "Item ${it.name || it.key}"`)
      out.push('      community.zabbix.zabbix_item:')
      out.push(`        name: "${it.name || ''}"`)
      out.push(`        key: "${it.key || ''}"`)
      out.push(`        template_name: "${tName}"`)
      if (it.delay) out.push(`        delay: "${it.delay}"`)
      out.push('        state: present')
      out.push('')
    }

    for (const tr of toArray(tpl.triggers?.trigger)) {
      out.push(`    - name: "Trigger ${tr.name || ''}"`)
      out.push('      community.zabbix.zabbix_trigger:')
      out.push(`        name: "${tr.name || ''}"`)
      out.push(`        expression: "${(tr.expression || '').replace(/"/g, '\\"')}"`)
      out.push(`        template_name: "${tName}"`)
      out.push('        state: present')
      out.push('')
    }
  }
  return out.join('\n')
}
