<template>
  <div class="ztool">
    <!-- Upload drag-and-drop -->
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
    <div v-if="fileName" class="ztool-file">
      Arquivo: <span class="name">{{ fileName }}</span>
      <span class="ztool-badge">{{ detectedFormat.toUpperCase() }}</span>
    </div>

    <!-- Seletores -->
    <div class="ztool-grid" style="margin-top:16px">
      <label class="ztool-cell"><span class="ztool-k">Versão de origem</span>
        <select v-model="sourceVersion" class="ztool-select"><option v-for="v in versions" :key="v" :value="v">{{ v }}</option></select>
      </label>
      <label class="ztool-cell"><span class="ztool-k">Versão de destino</span>
        <select v-model="targetVersion" class="ztool-select"><option v-for="v in versions" :key="v" :value="v">{{ v }}</option></select>
      </label>
      <label class="ztool-cell"><span class="ztool-k">Formato de saída</span>
        <select v-model="outputFormat" class="ztool-select"><option value="xml">XML</option><option value="json">JSON</option><option value="yaml">YAML</option></select>
      </label>
    </div>

    <div class="ztool-row" style="margin-top:16px">
      <button class="ztool-btn" :disabled="!canConvert || converting" @click="convert">
        {{ converting ? 'Convertendo...' : 'Converter e Baixar' }}
      </button>
    </div>
    <p v-if="error" class="ztool-error">{{ error }}</p>

    <!-- Resumo -->
    <div v-if="summary" class="ztool-summary">
      <div class="ztool-summary-head">Resumo da conversão ({{ summary.source }} → {{ summary.target }})</div>
      <div v-for="(c, i) in summary.changes" :key="i" class="ztool-change">
        {{ c.description }}
        <div v-if="c.samples && c.samples.length" class="ztool-diff">
          <div v-for="(s, j) in c.samples" :key="j">
            <span class="before">− {{ s.before }}</span><br />
            <span class="after">+ {{ s.after }}</span>
          </div>
        </div>
      </div>
      <div v-if="!summary.changes.length" class="ztool-change">Nenhuma alteração necessária.</div>
    </div>

    <p class="ztool-note">
      Auxiliar de migração — cobre as diferenças mais comuns (versão do export, sintaxe de trigger 6.0+, UUIDs).
      Sempre revise o resultado antes de importar no Zabbix. Processamento 100% no seu navegador.
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { detectFormat, parseTemplate, serializeTemplate, extFor } from '../../../src/lib/zabbix-parser.js'
import { convertTemplate, VERSIONS } from '../../../src/lib/zabbix-converter.js'

const versions = VERSIONS
const fileName = ref('')
const fileContent = ref('')
const detectedFormat = ref('xml')
const sourceVersion = ref('5.4')
const targetVersion = ref('6.0')
const outputFormat = ref('xml')
const converting = ref(false)
const error = ref('')
const summary = ref(null)
const dragOver = ref(false)

const canConvert = computed(() => !!fileContent.value && sourceVersion.value && targetVersion.value)

async function loadFile(file) {
  error.value = ''; summary.value = null
  fileName.value = file.name
  fileContent.value = await file.text()
  detectedFormat.value = detectFormat(file.name, fileContent.value)
  outputFormat.value = detectedFormat.value
}
function onPick(e) { const f = e.target.files[0]; if (f) loadFile(f) }
function onDrop(e) { dragOver.value = false; const f = e.dataTransfer.files[0]; if (f) loadFile(f) }

function download(content, name, mime) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = name; a.click()
  URL.revokeObjectURL(url)
}

async function convert() {
  if (!canConvert.value) return
  converting.value = true; error.value = ''; summary.value = null
  try {
    const data = await parseTemplate(fileContent.value, detectedFormat.value)
    const { data: out, summary: sum } = convertTemplate(data, sourceVersion.value, targetVersion.value)
    const output = await serializeTemplate(out, outputFormat.value)
    const mime = outputFormat.value === 'json' ? 'application/json' : outputFormat.value === 'xml' ? 'application/xml' : 'text/yaml'
    download(output, `template_v${targetVersion.value}.${extFor(outputFormat.value)}`, mime)
    summary.value = sum
  } catch (e) {
    error.value = 'Erro ao converter: ' + (e.message || e)
  } finally {
    converting.value = false
  }
}
</script>
