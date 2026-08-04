<template>
  <div class="ztool">
    <label class="ztool-label">Macros (nome e valor)</label>
    <div v-for="(mac, i) in macros" :key="i" class="ztool-row" style="margin-bottom:8px">
      <input v-model="mac.name" class="ztool-input" style="max-width:220px" placeholder="{$THRESHOLD}" spellcheck="false" />
      <input v-model="mac.value" class="ztool-input" placeholder="90" spellcheck="false" />
      <button class="ztool-btn ghost" style="padding:8px 12px" @click="macros.splice(i, 1)" title="Remover">×</button>
    </div>
    <button class="ztool-btn ghost" style="padding:7px 14px;font-size:0.82rem" @click="macros.push({ name: '', value: '' })">+ macro</button>

    <label class="ztool-label">Valor simulado do item (substitui as funções tipo <code>last(/host/key)</code>)</label>
    <div class="ztool-row"><input v-model="itemValue" class="ztool-input" placeholder="95" spellcheck="false" /></div>

    <label class="ztool-label">Expressão (trigger)</label>
    <div class="ztool-row"><input v-model="expression" class="ztool-input" placeholder="last(/Host/key) > {$THRESHOLD}" spellcheck="false" @keydown.enter="resolve" /></div>

    <div class="ztool-row" style="margin-top:14px"><button class="ztool-btn" @click="resolve">Resolver</button></div>
    <p v-if="error" class="ztool-error">{{ error }}</p>

    <div v-if="result" class="ztool-summary">
      <div class="ztool-summary-head">Resultado da simulação</div>
      <div class="ztool-change"><span class="ztool-k">Expressão resolvida</span><br /><span class="ztool-v">{{ result.resolved }}</span></div>
      <div class="ztool-change">
        <span class="ztool-k">Avaliação</span><br />
        <span class="ztool-v" :style="{ color: result.fires === true ? '#22c55e' : result.fires === false ? 'var(--vp-c-text-1)' : 'var(--vp-c-text-2)' }">
          {{ result.verdict }}
        </span>
      </div>
    </div>

    <p class="ztool-note">
      Simulação didática: as macros são substituídas literalmente e as funções são trocadas pelo valor simulado.
      A avaliação booleana cobre expressões numéricas simples (comparações e <code>and</code>/<code>or</code>).
    </p>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const macros = reactive([
  { name: '{$THRESHOLD}', value: '90' },
  { name: '{$MIN}', value: '10' },
])
const itemValue = ref('95')
const expression = ref('last(/Host/key) > {$THRESHOLD}')
const result = ref(null)
const error = ref('')

// Avalia com segurança uma expressão numérica/booleana já resolvida.
// Só aceita dígitos, operadores e as palavras and/or/not — sem eval de código arbitrário.
function safeEval(expr) {
  let js = expr
    .replace(/\band\b/gi, '&&')
    .replace(/\bor\b/gi, '||')
    .replace(/\bnot\b/gi, '!')
    .replace(/<>/g, '!=')
    .replace(/(^|[^<>=!])=(?!=)/g, '$1==') // = simples -> ==
  if (!/^[\d\s.()+\-*/%<>=!&|]+$/.test(js)) return null // sobrou macro/função não resolvida
  try {
    // eslint-disable-next-line no-new-func
    return Function('"use strict";return (' + js + ')')()
  } catch {
    return null
  }
}

function resolve() {
  error.value = ''; result.value = null
  let expr = expression.value.trim()
  if (!expr) { error.value = 'Informe uma expressão.'; return }

  // 1) substitui macros (nome literal -> valor)
  for (const m of macros) {
    if (!m.name) continue
    expr = expr.split(m.name).join(m.value)
  }
  // 2) substitui funções func(/host/key,params) ou {host:key.func()} pelo valor simulado
  const resolved = expr
    .replace(/\b[a-z_]+\s*\(\s*\/[^)]*\)/gi, itemValue.value)
    .replace(/\{[^:{}]+:[^{}]+\.\w+\([^)]*\)\}/g, itemValue.value)

  const val = safeEval(resolved)
  let verdict, fires
  if (val === null || Number.isNaN(val)) { verdict = 'Não avaliável (ainda há macros/funções não resolvidas)'; fires = null }
  else { fires = !!val; verdict = fires ? 'Dispararia (verdadeiro)' : 'Não dispararia (falso)' }

  result.value = { resolved, verdict, fires }
}
</script>
