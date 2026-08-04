<template>
  <div class="ztool">
    <label class="ztool-label">Descreva o que você quer monitorar</label>
    <textarea
      v-model="description"
      class="ztool-textarea"
      rows="4"
      placeholder="Ex.: servidor Linux com alerta de CPU acima de 90% e disco livre abaixo de 10%, além de ping para disponibilidade."
    ></textarea>

    <div class="ztool-row" style="margin-top:14px">
      <button class="ztool-btn" :disabled="!description.trim() || loading" @click="generate">
        {{ loading ? 'Gerando...' : 'Gerar Template' }}
      </button>
    </div>
    <p v-if="error" class="ztool-error">{{ error }}</p>

    <template v-if="output">
      <div class="ztool-row" style="margin-top:16px;justify-content:space-between">
        <span class="ztool-badge">{{ source === 'ai' ? 'Gerado por IA' : 'Gerado por heurística (offline)' }} · YAML 6.0</span>
        <span>
          <button class="ztool-btn ghost" style="padding:7px 14px;font-size:0.82rem" @click="copy">Copiar</button>
          <button class="ztool-btn" style="padding:7px 14px;font-size:0.82rem;margin-left:6px" @click="download">Baixar</button>
        </span>
      </div>
      <pre class="ztool-code"><code>{{ output }}</code></pre>
    </template>

    <p class="ztool-note">
      A geração usa IA via função serverless (sem expor chave). Sem IA configurada, um gerador
      heurístico local monta um template a partir de palavras-chave (CPU, disco, memória, ping, HTTP).
      Sempre revise antes de importar no Zabbix.
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { callAI, heuristicTemplate } from '../../../src/lib/ai-helper.js'

const description = ref('')
const output = ref('')
const source = ref('ai')
const loading = ref(false)
const error = ref('')

async function generate() {
  if (!description.value.trim()) return
  loading.value = true; error.value = ''; output.value = ''
  try {
    output.value = await callAI('generate', description.value)
    source.value = 'ai'
  } catch (e) {
    if (e.unavailable) {
      // fallback heurístico local
      output.value = await heuristicTemplate(description.value)
      source.value = 'heuristic'
    } else {
      error.value = 'Erro: ' + (e.message || e)
    }
  } finally {
    loading.value = false
  }
}

function copy() { navigator.clipboard?.writeText(output.value) }
function download() {
  const blob = new Blob([output.value], { type: 'text/yaml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = 'template_gerado.yaml'; a.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.ztool-code {
  margin-top: 10px; padding: 16px; border-radius: 10px; overflow: auto; max-height: 460px;
  background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider);
  font-family: var(--vp-font-family-mono); font-size: 0.82rem; line-height: 1.55; color: var(--vp-c-text-1);
}
</style>
