<template>
  <div class="ztool">
    <label class="ztool-label">Expressão regular (estilo PCRE, como nas triggers/itens do Zabbix)</label>
    <div class="ztool-row">
      <input v-model="pattern" class="ztool-input" placeholder="ERROR|CRITICAL|down" spellcheck="false" />
    </div>
    <div class="ztool-row" style="margin-top:8px">
      <label v-for="f in flagDefs" :key="f.k" style="font-size:0.85rem;color:var(--vp-c-text-2);display:inline-flex;align-items:center;gap:5px">
        <input type="checkbox" v-model="flags[f.k]" /> {{ f.label }}
      </label>
    </div>

    <label class="ztool-label">Texto de teste</label>
    <textarea v-model="testText" class="ztool-textarea" rows="6" spellcheck="false" placeholder="Cole aqui linhas de log ou o valor do item para testar..."></textarea>

    <p v-if="analysis && analysis.error" class="ztool-error">Regex inválida: {{ analysis.error }}</p>

    <template v-if="analysis && !analysis.error">
      <label class="ztool-label">Resultado — <strong style="color:var(--vp-c-brand-1)">{{ analysis.count }}</strong> ocorrência(s)</label>
      <div class="ztool-highlight" v-html="analysis.html"></div>
      <div v-if="analysis.groups.length" class="ztool-summary" style="margin-top:12px">
        <div class="ztool-summary-head">Grupos capturados (primeiras ocorrências)</div>
        <div v-for="(g, i) in analysis.groups" :key="i" class="ztool-change">
          <span v-for="(v, j) in g" :key="j" class="ztool-badge">${{ j + 1 }} = {{ v ?? '∅' }}</span>
        </div>
      </div>
    </template>

    <p class="ztool-note">
      A engine é a do JavaScript (ECMAScript). Cobre a grande maioria dos casos PCRE usados no Zabbix,
      mas recursos avançados de PCRE (ex.: lookbehind variável, possessivos) podem divergir.
    </p>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const pattern = ref('')
const testText = ref('')
const flagDefs = [
  { k: 'i', label: 'ignore case (i)' },
  { k: 'm', label: 'multiline (m)' },
  { k: 's', label: 'dotall (s)' },
]
const flags = reactive({ i: false, m: false, s: false })

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

const analysis = computed(() => {
  if (!pattern.value) return null
  const flagStr = 'g' + (flags.i ? 'i' : '') + (flags.m ? 'm' : '') + (flags.s ? 's' : '')
  let re
  try {
    re = new RegExp(pattern.value, flagStr)
  } catch (e) {
    return { error: e.message }
  }
  const text = testText.value
  let html = '', last = 0, count = 0
  const groups = []
  let m
  re.lastIndex = 0
  while ((m = re.exec(text)) !== null) {
    html += esc(text.slice(last, m.index)) + '<mark>' + esc(m[0]) + '</mark>'
    last = m.index + m[0].length
    count++
    if (groups.length < 12 && m.length > 1) groups.push(m.slice(1))
    if (m.index === re.lastIndex) re.lastIndex++ // evita loop em match de largura zero
    if (count > 50000) break
  }
  html += esc(text.slice(last))
  return { count, html, groups }
})
</script>
