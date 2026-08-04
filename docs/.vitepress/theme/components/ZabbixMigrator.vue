<template>
  <div class="ztool">
    <!-- Upload -->
    <div
      class="ztool-drop"
      :class="{ over: dragOver }"
      @click="$refs.fileEl.click()"
      @dragover.prevent="dragOver = true"
      @dragleave.prevent="dragOver = false"
      @drop.prevent="onDrop"
    >
      <p><strong>Arraste o template aqui</strong> ou clique para escolher</p>
      <p style="font-size:0.8rem;margin:6px 0 0">Formatos: .xml, .json, .yaml</p>
      <input ref="fileEl" type="file" accept=".xml,.json,.yaml,.yml" style="display:none" @change="onPick" />
    </div>
    <div v-if="fileName" class="ztool-file">Arquivo: <span class="name">{{ fileName }}</span></div>

    <!-- Regras de substituição -->
    <label class="ztool-label">Substituições (de → para) — hosts, grupos, macros, IPs...</label>
    <div v-for="(r, i) in rules" :key="i" class="ztool-row" style="margin-bottom:8px">
      <input v-model="r.from" class="ztool-input" placeholder="Template App PROD" spellcheck="false" />
      <span style="color:var(--vp-c-text-2)">→</span>
      <input v-model="r.to" class="ztool-input" placeholder="Template App HML" spellcheck="false" />
      <button class="ztool-btn ghost" style="padding:8px 12px" @click="rules.splice(i, 1)" title="Remover">×</button>
    </div>
    <button class="ztool-btn ghost" style="padding:7px 14px;font-size:0.82rem" @click="rules.push({ from: '', to: '' })">+ substituição</button>

    <div class="ztool-row" style="margin-top:16px">
      <button class="ztool-btn" :disabled="!content || !hasRule" @click="migrate">Migrar e Baixar</button>
    </div>
    <p v-if="error" class="ztool-error">{{ error }}</p>

    <div v-if="report" class="ztool-summary">
      <div class="ztool-summary-head">Substituições aplicadas</div>
      <div v-for="(r, i) in report" :key="i" class="ztool-change">
        <span class="ztool-v">{{ r.from }}</span> → <span class="ztool-v">{{ r.to }}</span>
        <span class="ztool-badge">{{ r.count }}×</span>
      </div>
      <div v-if="!report.length" class="ztool-change">Nenhuma ocorrência encontrada para as regras informadas.</div>
    </div>

    <p class="ztool-note">
      A migração troca texto literal no arquivo (mantém o formato original), ideal para adaptar um template
      entre ambientes (PROD → HML, troca de grupos, macros, IPs). Processamento 100% no seu navegador.
    </p>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { detectFormat, extFor } from '../../../src/lib/zabbix-parser.js'

const fileName = ref('')
const content = ref('')
const format = ref('xml')
const dragOver = ref(false)
const error = ref('')
const report = ref(null)
const rules = reactive([
  { from: '', to: '' },
  { from: '', to: '' },
  { from: '', to: '' },
])

const hasRule = computed(() => rules.some((r) => r.from))

async function loadFile(file) {
  error.value = ''; report.value = null
  fileName.value = file.name
  content.value = await file.text()
  format.value = detectFormat(file.name, content.value)
}
function onPick(e) { const f = e.target.files[0]; if (f) loadFile(f) }
function onDrop(e) { dragOver.value = false; const f = e.dataTransfer.files[0]; if (f) loadFile(f) }

function download(text, name, mime) {
  const blob = new Blob([text], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = name; a.click()
  URL.revokeObjectURL(url)
}

function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') }

function migrate() {
  error.value = ''; report.value = null
  if (!content.value) { error.value = 'Envie um template primeiro.'; return }
  let out = content.value
  const applied = []
  for (const r of rules) {
    if (!r.from) continue
    const re = new RegExp(escapeRe(r.from), 'g')
    const count = (out.match(re) || []).length
    if (count > 0) out = out.replace(re, r.to)
    applied.push({ from: r.from, to: r.to, count })
  }
  const base = fileName.value.replace(/\.[^.]+$/, '')
  const mime = format.value === 'json' ? 'application/json' : format.value === 'xml' ? 'application/xml' : 'text/yaml'
  download(out, `${base}_migrado.${extFor(format.value)}`, mime)
  report.value = applied
}
</script>
