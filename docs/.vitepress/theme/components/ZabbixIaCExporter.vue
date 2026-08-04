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
      <p><strong>Arraste o template Zabbix</strong> ou clique para escolher</p>
      <p style="font-size:0.8rem;margin:6px 0 0">Formatos: .xml, .json, .yaml</p>
      <input ref="fileEl" type="file" accept=".xml,.json,.yaml,.yml" style="display:none" @change="onPick" />
    </div>
    <div v-if="fileName" class="ztool-file">Arquivo: <span class="name">{{ fileName }}</span></div>

    <label class="ztool-label">Formato de saída (IaC)</label>
    <div class="ztool-row">
      <select v-model="target" class="ztool-select">
        <option value="terraform">Terraform (provider zabbix)</option>
        <option value="ansible">Ansible (community.zabbix)</option>
      </select>
      <button class="ztool-btn" :disabled="!content || generating" @click="generate">
        {{ generating ? 'Gerando...' : 'Gerar código' }}
      </button>
    </div>
    <p v-if="error" class="ztool-error">{{ error }}</p>

    <template v-if="output">
      <div class="ztool-row" style="margin-top:16px;justify-content:space-between">
        <span class="ztool-badge">{{ target === 'terraform' ? 'main.tf' : 'playbook.yml' }}</span>
        <span>
          <button class="ztool-btn ghost" style="padding:7px 14px;font-size:0.82rem" @click="copy">Copiar</button>
          <button class="ztool-btn" style="padding:7px 14px;font-size:0.82rem;margin-left:6px" @click="download">Baixar</button>
        </span>
      </div>
      <pre class="ztool-code"><code>{{ output }}</code></pre>
    </template>

    <p class="ztool-note">
      Mapeamento ilustrativo para acelerar a escrita de IaC — os schemas dos providers podem variar por versão.
      Sempre revise antes de aplicar. Processamento 100% no navegador.
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { detectFormat, parseTemplate } from '../../../src/lib/zabbix-parser.js'
import { toTerraform, toAnsible } from '../../../src/lib/iac-converter.js'

const fileName = ref('')
const content = ref('')
const format = ref('xml')
const target = ref('terraform')
const output = ref('')
const generating = ref(false)
const error = ref('')
const dragOver = ref(false)

async function loadFile(file) {
  error.value = ''; output.value = ''
  fileName.value = file.name
  content.value = await file.text()
  format.value = detectFormat(file.name, content.value)
}
function onPick(e) { const f = e.target.files[0]; if (f) loadFile(f) }
function onDrop(e) { dragOver.value = false; const f = e.dataTransfer.files[0]; if (f) loadFile(f) }

async function generate() {
  if (!content.value) return
  generating.value = true; error.value = ''; output.value = ''
  try {
    const data = await parseTemplate(content.value, format.value)
    output.value = target.value === 'terraform' ? toTerraform(data) : toAnsible(data)
  } catch (e) {
    error.value = 'Erro ao gerar: ' + (e.message || e)
  } finally {
    generating.value = false
  }
}

function copy() { navigator.clipboard?.writeText(output.value) }
function download() {
  const name = target.value === 'terraform' ? 'zabbix.tf' : 'zabbix-playbook.yml'
  const blob = new Blob([output.value], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = name; a.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.ztool-code {
  margin-top: 10px; padding: 16px; border-radius: 10px; overflow-x: auto;
  background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider);
  font-family: var(--vp-font-family-mono); font-size: 0.82rem; line-height: 1.55;
  color: var(--vp-c-text-1); max-height: 460px; overflow-y: auto;
}
</style>
