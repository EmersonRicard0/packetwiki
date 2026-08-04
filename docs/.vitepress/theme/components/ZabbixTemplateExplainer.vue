<template>
  <div class="ztool">
    <div
      class="ztool-drop"
      :class="{ over: dragOver }"
      @click="$refs.fileEl.click()"
      @dragover.prevent="dragOver = true"
      @dragleave.prevent="dragOver = false"
      @drop.prevent="onDrop"
    >
      <p><strong>Arraste o template</strong> ou clique para escolher</p>
      <p style="font-size:0.8rem;margin:6px 0 0">Formatos: .xml, .json, .yaml</p>
      <input ref="fileEl" type="file" accept=".xml,.json,.yaml,.yml" style="display:none" @change="onPick" />
    </div>
    <div v-if="fileName" class="ztool-file">Arquivo: <span class="name">{{ fileName }}</span></div>

    <div class="ztool-row" style="margin-top:14px">
      <button class="ztool-btn" :disabled="!content || loading" @click="explain">
        {{ loading ? 'Explicando...' : 'Explicar Template' }}
      </button>
    </div>
    <p v-if="error" class="ztool-error">{{ error }}</p>

    <template v-if="result">
      <div class="ztool-summary" style="margin-top:16px">
        <div class="ztool-summary-head">Explicação {{ source === 'ai' ? '(IA)' : '(resumo local)' }}</div>
        <div class="ztool-change" v-html="rendered"></div>
      </div>

      <!-- Perguntas adicionais (só com IA) -->
      <label class="ztool-label">Pergunta adicional sobre este template</label>
      <div class="ztool-row">
        <input v-model="question" class="ztool-input" placeholder="Ex.: o que a trigger de CPU faz exatamente?" @keydown.enter="ask" />
        <button class="ztool-btn" :disabled="!question.trim() || loading" @click="ask">Perguntar</button>
      </div>
      <div v-if="answer" class="ztool-summary" style="margin-top:10px">
        <div class="ztool-change" v-html="renderMd(answer)"></div>
      </div>
    </template>

    <p class="ztool-note">
      A explicação usa IA via função serverless. Sem IA configurada, é exibido um resumo estrutural
      local (contagem de items/triggers/macros). Perguntas adicionais exigem IA ativa.
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { detectFormat } from '../../../src/lib/zabbix-parser.js'
import { callAI, heuristicExplain } from '../../../src/lib/ai-helper.js'

const fileName = ref('')
const content = ref('')
const result = ref('')
const answer = ref('')
const question = ref('')
const source = ref('ai')
const loading = ref(false)
const error = ref('')
const dragOver = ref(false)

async function loadFile(file) {
  error.value = ''; result.value = ''; answer.value = ''
  fileName.value = file.name
  content.value = await file.text()
}
function onPick(e) { const f = e.target.files[0]; if (f) loadFile(f) }
function onDrop(e) { dragOver.value = false; const f = e.dataTransfer.files[0]; if (f) loadFile(f) }

// Render leve de markdown (títulos, listas, negrito, código, quebras).
function renderMd(text) {
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  return esc(text)
    .replace(/^### (.*)$/gm, '<strong style="color:var(--vp-c-brand-1)">$1</strong>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^- (.*)$/gm, '• $1')
    .replace(/\n/g, '<br>')
}
const rendered = computed(() => renderMd(result.value))

async function explain() {
  if (!content.value) return
  loading.value = true; error.value = ''; result.value = ''; answer.value = ''
  try {
    result.value = await callAI('explain', content.value)
    source.value = 'ai'
  } catch (e) {
    if (e.unavailable) {
      result.value = await heuristicExplain(content.value, fileName.value)
      source.value = 'heuristic'
    } else {
      error.value = 'Erro: ' + (e.message || e)
    }
  } finally {
    loading.value = false
  }
}

async function ask() {
  if (!question.value.trim()) return
  loading.value = true; error.value = ''; answer.value = ''
  try {
    answer.value = await callAI('explain', content.value, question.value)
  } catch (e) {
    error.value = e.unavailable ? 'Perguntas adicionais precisam da IA ativa (site publicado).' : 'Erro: ' + (e.message || e)
  } finally {
    loading.value = false
  }
}
</script>
