<template>
  <div class="ztool">
    <!-- Plugins instalados -->
    <label class="ztool-label">Plugins instalados ({{ plugins.length }})</label>
    <div v-if="!plugins.length" class="ztool-note" style="margin-top:4px">Nenhum plugin instalado ainda. Instale da loja abaixo ou envie um JSON.</div>
    <div v-for="p in plugins" :key="p.id" class="ztool-summary" style="margin-bottom:8px">
      <div class="ztool-change" style="display:flex;align-items:center;justify-content:space-between;gap:12px">
        <div>
          <strong>{{ p.name }}</strong> <span class="ztool-badge">v{{ p.version || '?' }}</span>
          <div style="font-size:0.82rem;color:var(--vp-c-text-2);margin-top:2px">{{ p.description }} · {{ p.rules.length }} regra(s)</div>
        </div>
        <div style="white-space:nowrap">
          <label style="font-size:0.8rem;margin-right:10px;display:inline-flex;align-items:center;gap:5px">
            <input type="checkbox" :checked="p.enabled !== false" @change="toggle(p.id)" /> ativo
          </label>
          <button class="ztool-btn ghost" style="padding:6px 10px;font-size:0.8rem" @click="remove(p.id)">remover</button>
        </div>
      </div>
    </div>

    <!-- Instalar por JSON -->
    <label class="ztool-label">Instalar plugin (upload de JSON ou colar)</label>
    <div class="ztool-row">
      <input ref="fileEl" type="file" accept=".json" style="display:none" @change="onPick" />
      <button class="ztool-btn ghost" @click="$refs.fileEl.click()">Enviar arquivo .json</button>
    </div>
    <textarea v-model="pasteJson" class="ztool-textarea" rows="4" style="margin-top:8px" placeholder='{"id":"meu","name":"Meu plugin","version":"1.0.0","rules":[{"pattern":"foo","replace":"bar","flags":"g"}]}'></textarea>
    <div class="ztool-row" style="margin-top:8px"><button class="ztool-btn" @click="installPaste">Instalar do texto</button></div>
    <p v-if="error" class="ztool-error">{{ error }}</p>
    <p v-if="msg" class="ztool-note" style="color:var(--vp-c-brand-1)">{{ msg }}</p>

    <!-- Loja da comunidade -->
    <label class="ztool-label">Loja da comunidade</label>
    <div class="ztool-row"><button class="ztool-btn ghost" @click="loadStore">Carregar loja</button></div>
    <div v-for="s in store" :key="s.id" class="ztool-summary" style="margin-top:8px">
      <div class="ztool-change" style="display:flex;align-items:center;justify-content:space-between;gap:12px">
        <div>
          <strong>{{ s.name }}</strong> <span class="ztool-badge">v{{ s.version }}</span>
          <div style="font-size:0.82rem;color:var(--vp-c-text-2);margin-top:2px">{{ s.description }}</div>
        </div>
        <button class="ztool-btn" style="padding:6px 12px;font-size:0.82rem" @click="install(s)">instalar</button>
      </div>
    </div>

    <p class="ztool-note">
      Os plugins ficam salvos no seu navegador (localStorage) e são aplicados automaticamente no
      <a href="/pt/ferramentas/zabbix/conversor">Conversor de Templates</a>. Cada regra é uma substituição regex sobre o template gerado.
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { listPlugins, addPlugin, removePlugin, togglePlugin } from '../../../src/lib/zabbix-plugins.js'

const plugins = ref([])
const store = ref([])
const pasteJson = ref('')
const error = ref('')
const msg = ref('')

onMounted(() => { plugins.value = listPlugins() })

function flash(m) { msg.value = m; setTimeout(() => (msg.value = ''), 3000) }

function toggle(id) { plugins.value = togglePlugin(id) }
function remove(id) { plugins.value = removePlugin(id); flash('Plugin removido.') }

function tryInstall(obj) {
  error.value = ''
  try {
    plugins.value = addPlugin(obj)
    flash(`Plugin "${obj.name}" instalado.`)
  } catch (e) {
    error.value = 'Erro: ' + e.message
  }
}

function install(s) { tryInstall(s) }

function installPaste() {
  try {
    tryInstall(JSON.parse(pasteJson.value))
    pasteJson.value = ''
  } catch (e) {
    error.value = 'JSON inválido: ' + e.message
  }
}

async function onPick(e) {
  const f = e.target.files[0]
  if (!f) return
  try {
    tryInstall(JSON.parse(await f.text()))
  } catch (e2) {
    error.value = 'JSON inválido: ' + e2.message
  }
}

async function loadStore() {
  error.value = ''
  try {
    const r = await fetch('/zabbix-plugins/store.json')
    store.value = await r.json()
  } catch {
    error.value = 'Não foi possível carregar a loja.'
  }
}
</script>
