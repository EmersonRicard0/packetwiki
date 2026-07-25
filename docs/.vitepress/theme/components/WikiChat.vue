<template>
  <div class="chat-root">
    <!-- Balão de fala -->
    <Transition name="bubble">
      <div
        v-if="showBubble && !isOpen"
        class="chat-bubble"
        @click="toggle"
      >
        {{ bubbleText }}
      </div>
    </Transition>

    <!-- Botão flutuante -->
    <button
      class="chat-fab"
      :class="{ open: isOpen }"
      @click="toggle"
      :aria-label="isOpen ? 'Fechar assistente' : 'Abrir assistente'"
    >
      <span v-if="!isOpen" class="fab-icon">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="white" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.9-.9L3 21l1.9-5.6A8.5 8.5 0 1 1 21 11.5z"/>
          <circle cx="8.5" cy="11.5" r="1.1" fill="white" stroke="none"/>
          <circle cx="12" cy="11.5" r="1.1" fill="white" stroke="none"/>
          <circle cx="15.5" cy="11.5" r="1.1" fill="white" stroke="none"/>
        </svg>
      </span>
      <span v-if="!isOpen" class="fab-label">Assistente</span>
      <span v-else class="fab-icon fab-close">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </span>
      <span v-if="!isOpen && unread > 0" class="fab-badge">{{ unread }}</span>
    </button>

    <!-- Janela do chat -->
    <Transition name="chat-slide">
      <div v-if="isOpen" class="chat-window">
        <!-- Header -->
        <div class="chat-header">
          <div class="chat-header-info">
            <div class="chat-avatar">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
                <path d="M12 2L14.4 9.6H22.4L16 14.2L18.4 21.8L12 17.2L5.6 21.8L8 14.2L1.6 9.6H9.6L12 2Z" fill="white" opacity="0.9"/>
              </svg>
            </div>
            <div>
              <div class="chat-name">PacketBot</div>
              <div class="chat-status">
                <span class="status-dot" :class="{ thinking: isLoading }"></span>
                {{ isLoading ? 'Digitando...' : 'Online' }}
              </div>
            </div>
          </div>
          <div class="chat-header-actions">
            <button class="chat-clear-btn" @click="clearHistory" title="Limpar conversa" aria-label="Limpar conversa">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6"/><path d="M10 11v6M14 11v6"/></svg>
              Limpar
            </button>
            <button class="chat-close-btn" @click="toggle" aria-label="Fechar">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>
        </div>

        <!-- Mensagens -->
        <div class="chat-messages" ref="messagesEl">
          <div
            v-for="(msg, i) in messages"
            :key="i"
            class="msg-row"
            :class="msg.role"
          >
            <div v-if="msg.role === 'assistant'" class="msg-avatar">
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
    <path d="M12 2L14.4 9.6H22.4L16 14.2L18.4 21.8L12 17.2L5.6 21.8L8 14.2L1.6 9.6H9.6L12 2Z" fill="#E53935"/>
  </svg>
</div>
            <div class="msg-bubble" v-html="renderMarkdown(msg.content)"></div>
          </div>

          <!-- Typing indicator -->
          <div v-if="isLoading" class="msg-row assistant">
            <div class="msg-avatar">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
              <path d="M12 2L14.4 9.6H22.4L16 14.2L18.4 21.8L12 17.2L5.6 21.8L8 14.2L1.6 9.6H9.6L12 2Z" fill="#E53935"/>
            </svg>
          </div>
            <div class="msg-bubble typing">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>

        <!-- Sugestões rápidas -->
        <div v-if="messages.length === 1" class="chat-suggestions">
          <button
            v-for="s in suggestions"
            :key="s"
            class="suggestion-chip"
            @click="sendSuggestion(s)"
          >{{ s }}</button>
        </div>

        <!-- Input -->
        <div class="chat-input-row">
          <input
            v-model="input"
            class="chat-input"
            placeholder="Pergunte sobre redes, equipamentos..."
            @keydown.enter.prevent="send"
            :disabled="isLoading"
            maxlength="500"
            ref="inputEl"
          />
          <button
            class="chat-send"
            @click="send"
            :disabled="isLoading || !input.trim()"
            aria-label="Enviar"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z"/></svg>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vitepress'

const router = useRouter()
const isOpen = ref(false)
const isLoading = ref(false)
const input = ref('')
const messagesEl = ref(null)
const inputEl = ref(null)
const unread = ref(0)

// Endpoint do proxy seguro (Cloudflare Pages Function). A chave da IA
// fica no servidor — o navegador nunca a vê.
const CHAT_ENDPOINT = '/api/chat'

const suggestions = [
  'Como configurar BGP no Huawei?',
  'Como provisionar ONU na Datacom?',
  'Como instalar o Zabbix?',
  'Como configurar PPPoE no MikroTik?',
]

// O prompt de sistema e as regras de segurança ficam no servidor (functions/api/chat.js).

const STORAGE_KEY = 'packetwiki-chat-history'
const WELCOME_MESSAGE = {
  role: 'assistant',
  content: 'Olá! Sou o **PacketBot**, o assistente técnico da ERtech.\n\nPosso ajudar a encontrar configurações, tirar dúvidas técnicas e te guiar para a página certa da wiki. O que você precisa?',
}

function loadHistory() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch (_) {}
  return [WELCOME_MESSAGE]
}

function saveHistory(msgs) {
  try {
    const toSave = msgs.slice(-20)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
  } catch (_) {}
}

const messages = ref(loadHistory())

const history = ref([])

const showBubble = ref(false)
const bubbleTexts = [
  'Em que posso ajudar hoje?',
  'Tem alguma dúvida sobre redes?',
  'Procurando alguma configuração?',
  'Posso te guiar pelas páginas do wiki!',
  'BGP, OSPF, GPON... é só perguntar!',
]
const bubbleText = ref(bubbleTexts[0])
let bubbleIndex = 0
let bubbleTimer = null

function clearHistory() {
  messages.value = [WELCOME_MESSAGE]
  history.value = []
  try { localStorage.removeItem(STORAGE_KEY) } catch (_) {}
}

const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Formatação inline: negrito, itálico, código e links.
function inline(s) {
  return s
    .replace(/`([^`]+)`/g, (_, c) => `<code>${c}</code>`)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => {
      const safe = href.replace(/["'<>]/g, '')
      if (safe.startsWith('/')) {
        const cls = safe.startsWith('/pt/') ? 'chat-link-btn' : 'chat-link'
        const arrow = safe.startsWith('/pt/') ? '&rarr; ' : ''
        return `<a href="${safe}" class="${cls}" onclick="event.preventDefault(); window.__chatNav && window.__chatNav('${safe}')">${arrow}${label}</a>`
      }
      return `<a href="${safe}" class="chat-link" target="_blank" rel="noopener noreferrer">${label}</a>`
    })
}

// Renderiza um subconjunto seguro de markdown: títulos, listas,
// blocos de código, negrito/itálico e links. Tudo é escapado antes.
function renderMarkdown(text) {
  const blocks = []
  // 1. Protege blocos de código ```...```
  let src = text.replace(/```(\w+)?\n?([\s\S]*?)```/g, (_, lang, code) => {
    const i = blocks.length
    blocks.push(`<pre class="chat-code"><code>${esc(code.replace(/\n$/, ''))}</code></pre>`)
    return ` BLOCK${i} `
  })

  const lines = src.split('\n')
  let html = ''
  let list = null // 'ul' | 'ol' | null

  const closeList = () => { if (list) { html += `</${list}>`; list = null } }

  for (let raw of lines) {
    const line = raw.trimEnd()
    const ph = line.match(/^ BLOCK(\d+) $/)
    if (ph) { closeList(); html += blocks[+ph[1]]; continue }
    if (!line.trim()) { closeList(); continue }

    let m
    if ((m = line.match(/^#{1,3}\s+(.*)$/))) {
      closeList(); html += `<div class="chat-h">${inline(esc(m[1]))}</div>`
    } else if ((m = line.match(/^\s*[-*]\s+(.*)$/))) {
      if (list !== 'ul') { closeList(); html += '<ul>'; list = 'ul' }
      html += `<li>${inline(esc(m[1]))}</li>`
    } else if ((m = line.match(/^\s*\d+\.\s+(.*)$/))) {
      if (list !== 'ol') { closeList(); html += '<ol>'; list = 'ol' }
      html += `<li>${inline(esc(m[1]))}</li>`
    } else {
      closeList(); html += `<p>${inline(esc(line))}</p>`
    }
  }
  closeList()
  return html
}

async function scrollBottom() {
  await nextTick()
  if (messagesEl.value) {
    messagesEl.value.scrollTop = messagesEl.value.scrollHeight
  }
}

function toggle() {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    unread.value = 0
    nextTick(() => inputEl.value?.focus())
    scrollBottom()
  }
}

function sendSuggestion(text) {
  input.value = text
  send()
}

async function send() {
  const text = input.value.trim()
  if (!text || isLoading.value) return

  input.value = ''
  messages.value.push({ role: 'user', content: text })
  saveHistory(messages.value)
  history.value.push({ role: 'user', text })
  isLoading.value = true
  await scrollBottom()

  try {
    const res = await fetch(CHAT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history: history.value.slice(-12) }),
    })

    let data = {}
    try { data = await res.json() } catch (_) {}

    if (res.status === 404 || res.status === 405) {
      throw new Error('O assistente só funciona no site publicado (Cloudflare). No preview local ele fica indisponível.')
    }
    if (!res.ok || data.error) {
      throw new Error(data.error || 'Não consegui responder agora. Tente novamente em instantes.')
    }

    let reply = data.reply
    if (!reply) throw new Error('Resposta vazia. Reformule a pergunta, por favor.')

    // Se a resposta foi cortada por limite de tamanho, avisa o usuário.
    if (data.finishReason === 'MAX_TOKENS') {
      reply += '\n\n*(A resposta ficou longa. Peça "continuar" para o restante ou abra a página completa da wiki.)*'
    }

    messages.value.push({ role: 'assistant', content: reply })
    saveHistory(messages.value)
    history.value.push({ role: 'model', text: reply })

    if (!isOpen.value) unread.value++
  } catch (e) {
    messages.value.push({
      role: 'assistant',
      content: e.message || 'Erro ao conectar. Tente novamente.',
    })
    saveHistory(messages.value)
  } finally {
    isLoading.value = false
    await scrollBottom()
    inputEl.value?.focus()
  }
}

function scheduleBubble() {
  bubbleTimer = setTimeout(() => {
    if (!isOpen.value) {
      bubbleIndex = (bubbleIndex + 1) % bubbleTexts.length
      bubbleText.value = bubbleTexts[bubbleIndex]
      showBubble.value = true
      setTimeout(() => {
        showBubble.value = false
        scheduleBubble()
      }, 9000)
    } else {
      scheduleBubble()
    }
  }, 15000 + Math.random() * 10000)
}

onMounted(() => {
  window.__chatNav = (path) => {
    router.go(path)
    isOpen.value = false
  }

  // Mostra balão após 4s da primeira vez, fica 10s visível
  setTimeout(() => {
    showBubble.value = true
    setTimeout(() => {
      showBubble.value = false
      scheduleBubble()
    }, 10000)
  }, 4000)
})

onUnmounted(() => {
  clearTimeout(bubbleTimer)
})
</script>

<style scoped>
/* ── FAB (pill "Assistente" → círculo com X) ── */
.chat-fab {
  position: fixed;
  bottom: 24px;
  right: 24px;
  height: 54px;
  padding: 0 20px 0 15px;
  border-radius: 30px;
  background: linear-gradient(135deg, #E53935, #FF5A52);
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  box-shadow: 0 8px 24px rgba(229, 57, 53, 0.4);
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s, padding 0.25s, border-radius 0.25s;
  z-index: 200;
}
.chat-fab::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: 0 0 0 0 rgba(229, 57, 53, 0.45);
  animation: fabPulse 2.6s ease-out infinite;
  pointer-events: none;
}
@keyframes fabPulse {
  0%   { box-shadow: 0 0 0 0 rgba(229, 57, 53, 0.5); }
  70%  { box-shadow: 0 0 0 14px rgba(229, 57, 53, 0); }
  100% { box-shadow: 0 0 0 0 rgba(229, 57, 53, 0); }
}
.chat-fab:hover { transform: translateY(-2px) scale(1.04); box-shadow: 0 12px 30px rgba(229, 57, 53, 0.55); }

/* Estado aberto: vira círculo só com o X */
.chat-fab.open {
  width: 52px;
  height: 52px;
  padding: 0;
  border-radius: 50%;
  justify-content: center;
}
.chat-fab.open::before { animation: none; }

.fab-icon { display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
.fab-close { color: white; }
.fab-label {
  color: #fff;
  font-weight: 600;
  font-size: 0.9rem;
  letter-spacing: 0.01em;
  white-space: nowrap;
}
.fab-badge {
  position: absolute;
  top: -5px; right: -5px;
  background: #fff;
  color: #E53935;
  font-size: 0.7rem;
  font-weight: 700;
  min-width: 19px; height: 19px;
  padding: 0 5px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
}

/* Em telas pequenas, só o círculo com ícone (sem o rótulo) */
@media (max-width: 560px) {
  .chat-fab { padding: 0; width: 54px; justify-content: center; border-radius: 50%; }
  .fab-label { display: none; }
}

/* ── Window ── */
.chat-window {
  position: fixed;
  bottom: 90px;
  right: 24px;
  width: 374px;
  max-height: min(72vh, 660px);
  display: flex;
  flex-direction: column;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 18px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.28), 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 199;
  overflow: hidden;
}

@media (max-width: 480px) {
  .chat-window {
    right: 8px; left: 8px; width: auto; bottom: 84px;
    max-height: 76vh;
  }
}

/* ── Header ── */
.chat-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background:
    radial-gradient(120% 140% at 0% 0%, rgba(255, 255, 255, 0.18), transparent 55%),
    linear-gradient(135deg, #E53935, #C62828);
  flex-shrink: 0;
}
.chat-header-info { display: flex; align-items: center; gap: 10px; }
.chat-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(255,255,255,0.18);
  border: 1.5px solid rgba(255,255,255,0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.chat-name { color: white; font-weight: 700; font-size: 0.95rem; }
.chat-status { color: rgba(255,255,255,0.8); font-size: 0.75rem; display: flex; align-items: center; gap: 5px; margin-top: 1px; }
.status-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: #4ade80;
  flex-shrink: 0;
}
.status-dot.thinking { background: #fbbf24; animation: pulse 1s infinite; }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
.chat-header-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}
.chat-clear-btn {
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.25);
  color: rgba(255,255,255,0.85);
  font-size: 0.72rem;
  padding: 4px 8px;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;
}
.chat-clear-btn:hover { background: rgba(255,255,255,0.25); color: white; }
.chat-close-btn {
  background: rgba(255,255,255,0.18);
  border: none; color: white;
  width: 28px; height: 28px;
  border-radius: 50%;
  cursor: pointer; font-size: 0.85rem;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.2s;
}
.chat-close-btn:hover { background: rgba(255,255,255,0.3); }
.chat-link-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  margin: 3px 2px;
  border-radius: 6px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-size: 0.82rem;
  font-weight: 500;
  text-decoration: none;
  border: 1px solid var(--vp-c-brand-1);
  cursor: pointer;
  transition: background 0.2s;
}
.chat-link-btn:hover {
  background: var(--vp-c-brand-1);
  color: white;
}

/* ── Messages ── */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  scroll-behavior: smooth;
}
.msg-row {
  display: flex;
  align-items: flex-end;
  gap: 7px;
}
.msg-row.user { flex-direction: row-reverse; }
.msg-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--vp-c-brand-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.msg-bubble {
  max-width: 82%;
  padding: 9px 13px;
  border-radius: 14px;
  font-size: 0.875rem;
  line-height: 1.55;
  word-break: break-word;
}
.assistant .msg-bubble {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-bottom-left-radius: 4px;
  color: var(--vp-c-text-1);
}
.user .msg-bubble {
  background: linear-gradient(135deg, #E53935, #C62828);
  color: white;
  border-bottom-right-radius: 4px;
}

/* Typing dots */
.typing {
  display: flex !important;
  align-items: center;
  gap: 4px;
  padding: 12px 16px;
}
.typing span {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  animation: dot 1.2s ease-in-out infinite;
}
.typing span:nth-child(2) { animation-delay: 0.2s; }
.typing span:nth-child(3) { animation-delay: 0.4s; }
@keyframes dot { 0%,80%,100%{transform:scale(0.7);opacity:0.5} 40%{transform:scale(1);opacity:1} }

/* ── Suggestions ── */
.chat-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 0 12px 10px;
  flex-shrink: 0;
}
.suggestion-chip {
  font-size: 0.78rem;
  padding: 5px 10px;
  border-radius: 20px;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-brand-1);
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}
.suggestion-chip:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

/* ── Input ── */
.chat-input-row {
  display: flex;
  gap: 8px;
  padding: 10px 12px;
  border-top: 1px solid var(--vp-c-border);
  flex-shrink: 0;
  background: var(--vp-c-bg);
}
.chat-input {
  flex: 1;
  padding: 8px 12px;
  border-radius: 20px;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.2s;
}
.chat-input:focus { border-color: var(--vp-c-brand-1); }
.chat-input:disabled { opacity: 0.6; }
.chat-send {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #E53935, #FF5A52);
  border: none;
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: opacity 0.2s, transform 0.2s;
}
.chat-send:hover:not(:disabled) { opacity: 0.88; transform: scale(1.05); }
.chat-send:disabled { opacity: 0.4; cursor: not-allowed; }

/* ── Markdown dentro das mensagens ── */
.msg-bubble p { margin: 0 0 6px; }
.msg-bubble p:last-child { margin-bottom: 0; }
.msg-bubble .chat-h {
  font-weight: 700;
  font-size: 0.9rem;
  margin: 8px 0 4px;
  color: var(--vp-c-brand-1);
}
.msg-bubble ul, .msg-bubble ol { margin: 4px 0 6px; padding-left: 18px; }
.msg-bubble li { margin: 2px 0; }
.msg-bubble code {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  padding: 1px 5px;
  border-radius: 4px;
  font-size: 0.82em;
  font-family: var(--vp-font-family-mono);
}
.msg-bubble pre.chat-code {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 10px 12px;
  margin: 6px 0;
  overflow-x: auto;
}
.msg-bubble pre.chat-code code {
  background: none;
  color: var(--vp-c-text-1);
  padding: 0;
  font-size: 0.8rem;
  line-height: 1.5;
  white-space: pre;
}

/* ── Speech Bubble ── */
.chat-bubble {
  position: fixed;
  bottom: 86px;
  right: 84px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 20px;
  padding: 10px 16px;
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
  cursor: pointer;
  z-index: 199;
  max-width: 200px;
  line-height: 1.4;
}
.bubble-enter-active { animation: bubbleIn 0.3s cubic-bezier(0.34,1.56,0.64,1); }
.bubble-leave-active { animation: bubbleOut 0.2s ease-in forwards; }
@keyframes bubbleIn  { from { opacity:0; transform:scale(0.8) translateY(6px); } to { opacity:1; transform:scale(1) translateY(0); } }
@keyframes bubbleOut { from { opacity:1; transform:scale(1); } to { opacity:0; transform:scale(0.85) translateY(4px); } }

/* ── Transition ── */
.chat-slide-enter-active { animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.chat-slide-leave-active { animation: slideDown 0.22s ease-in forwards; }
@keyframes slideUp   { from { opacity:0; transform:translateY(20px) scale(0.95); } to { opacity:1; transform:translateY(0) scale(1); } }
@keyframes slideDown { from { opacity:1; transform:translateY(0) scale(1); } to { opacity:0; transform:translateY(16px) scale(0.95); } }
</style>
