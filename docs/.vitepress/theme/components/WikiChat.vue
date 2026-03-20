<template>
  <div class="chat-root">
    <!-- Botão flutuante -->
    <button
      class="chat-fab"
      :class="{ open: isOpen }"
      @click="toggle"
      :aria-label="isOpen ? 'Fechar assistente' : 'Abrir assistente'"
    >
      <span v-if="!isOpen" class="fab-icon">🤖</span>
      <span v-else class="fab-icon fab-close">✕</span>
      <span v-if="!isOpen && unread > 0" class="fab-badge">{{ unread }}</span>
    </button>

    <!-- Janela do chat -->
    <Transition name="chat-slide">
      <div v-if="isOpen" class="chat-window">
        <!-- Header -->
        <div class="chat-header">
          <div class="chat-header-info">
            <div class="chat-avatar">🤖</div>
            <div>
              <div class="chat-name">PacketBot</div>
              <div class="chat-status">
                <span class="status-dot" :class="{ thinking: isLoading }"></span>
                {{ isLoading ? 'Digitando...' : 'Online' }}
              </div>
            </div>
          </div>
          <button class="chat-close-btn" @click="toggle">✕</button>
        </div>

        <!-- Mensagens -->
        <div class="chat-messages" ref="messagesEl">
          <div
            v-for="(msg, i) in messages"
            :key="i"
            class="msg-row"
            :class="msg.role"
          >
            <div v-if="msg.role === 'assistant'" class="msg-avatar">🤖</div>
            <div class="msg-bubble" v-html="renderMarkdown(msg.content)"></div>
          </div>

          <!-- Typing indicator -->
          <div v-if="isLoading" class="msg-row assistant">
            <div class="msg-avatar">🤖</div>
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
          >➤</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import { useRouter } from 'vitepress'

const router = useRouter()
const isOpen = ref(false)
const isLoading = ref(false)
const input = ref('')
const messagesEl = ref(null)
const inputEl = ref(null)
const unread = ref(0)

const GEMINI_KEY = import.meta.env.VITE_GEMINI_KEY || ''

const suggestions = [
  'Como configurar BGP no Huawei?',
  'Como provisionar ONU na Datacom?',
  'Como instalar o Zabbix?',
  'Como configurar PPPoE no MikroTik?',
]

const SYSTEM_PROMPT = `Você é o PacketBot, assistente virtual do PacketWiki (wiki.ertechnol.com.br).
Fui criado por Emerson Silva Ricardo — dev e analista de redes brasileiro.

Seu papel:
- Responder dúvidas técnicas sobre redes, equipamentos e servidores Linux
- Guiar o usuário para a página correta do wiki
- Ser objetivo, técnico e simpático
- Responder sempre em português do Brasil

Páginas disponíveis no wiki (use os links nas respostas quando relevante):

ROTEADORES:
- Huawei (geral): /pt/roteadores/huawei/
- Huawei Configuração Inicial: /pt/roteadores/huawei/configuracao-inicial
- Huawei BGP: /pt/roteadores/huawei/bgp
- Huawei OSPF: /pt/roteadores/huawei/ospf
- Huawei Controle de Banda: /pt/roteadores/huawei/controle-de-banda
- Huawei SNMP: /pt/roteadores/huawei/snmp
- Huawei Backup: /pt/roteadores/huawei/backup
- Huawei Firmware Update: /pt/roteadores/huawei/update
- Huawei Limpar Contadores: /pt/roteadores/huawei/limpar-contadores
- Huawei Troubleshooting: /pt/roteadores/huawei/troubleshooting
- Huawei BNG/PPPoE (visão geral): /pt/roteadores/huawei/bng/
- Huawei BNG AAA: /pt/roteadores/huawei/bng/aaa
- Huawei BNG RADIUS: /pt/roteadores/huawei/bng/radius
- Huawei BNG Pool IPv4: /pt/roteadores/huawei/bng/pool-ipv4
- Huawei BNG Pool IPv6: /pt/roteadores/huawei/bng/pool-ipv6
- Huawei BNG Domain: /pt/roteadores/huawei/bng/domain
- Huawei BNG ACL/User-Group: /pt/roteadores/huawei/bng/acl
- Huawei BNG Virtual-Template: /pt/roteadores/huawei/bng/virtual-template
- Huawei BNG Padrão PPPoE: /pt/roteadores/huawei/bng/padrao
- MikroTik (geral): /pt/roteadores/mikrotik/
- MikroTik CCR: /pt/roteadores/mikrotik/ccr
- MikroTik BGP: /pt/roteadores/mikrotik/bgp
- MikroTik OSPF: /pt/roteadores/mikrotik/ospf
- Cisco roteadores: /pt/roteadores/cisco/
- Juniper roteadores: /pt/roteadores/juniper/
- Ubiquiti roteadores: /pt/roteadores/ubiquiti/

SWITCHES:
- Huawei switches (geral): /pt/switches/huawei/
- Huawei Config Inicial: /pt/switches/huawei/configuracao-inicial
- Huawei Gerência/SSH: /pt/switches/huawei/gerencia-ssh
- Huawei VLAN: /pt/switches/huawei/vlan
- Huawei Agregação de Links: /pt/switches/huawei/agregacao
- Huawei Controle de Banda: /pt/switches/huawei/controle-de-banda
- Huawei SNMP: /pt/switches/huawei/snmp
- Huawei Log/Syslog: /pt/switches/huawei/log-syslog
- Huawei Backup/Restore: /pt/switches/huawei/backup-restore
- Huawei Data/NTP: /pt/switches/huawei/time-date
- Huawei MPLS/LDP: /pt/switches/huawei/mpls
- Huawei MPLS L2VPN/VPLS: /pt/switches/huawei/mpls-l2vpn
- Huawei Troubleshooting: /pt/switches/huawei/troubleshooting
- Datacom switches: /pt/switches/datacom/
- Datacom Config Inicial: /pt/switches/datacom/configuracao-inicial
- Datacom VLANs: /pt/switches/datacom/vlan
- Datacom MPLS/L2VPN: /pt/switches/datacom/mpls
- Datacom QoS: /pt/switches/datacom/qos
- Datacom Segurança: /pt/switches/datacom/seguranca
- Cisco switches: /pt/switches/cisco/
- Cisco Catalyst 9200/9300: /pt/switches/cisco/catalyst-9200
- HP/Aruba switches: /pt/switches/aruba/
- MikroTik switches: /pt/switches/mikrotik/
- Juniper switches: /pt/switches/juniper/

OLT / GPON:
- Huawei OLT (geral): /pt/olt/huawei/
- Huawei Config Inicial: /pt/olt/huawei/configuracao-inicial
- Huawei Device/Gerência: /pt/olt/huawei/device
- Huawei Interfaces/VLANs: /pt/olt/huawei/interface-vlan
- Huawei GPON/ONUs: /pt/olt/huawei/gpon-ont
- Huawei Serviços/Perfis: /pt/olt/huawei/servicos-perfis
- Huawei MPLS: /pt/olt/huawei/mpls
- Huawei Troubleshooting: /pt/olt/huawei/troubleshooting
- Datacom OLT (geral): /pt/olt/datacom/
- Datacom Config Inicial: /pt/olt/datacom/configuracao-inicial
- Datacom Perfis GPON: /pt/olt/datacom/gpon-perfis
- Datacom Provisionamento ONUs: /pt/olt/datacom/gpon-provisionamento
- Datacom Serviços GPON: /pt/olt/datacom/gpon-servicos
- Datacom MPLS/VPLS: /pt/olt/datacom/mpls-vpls

LINUX:
- Firewall iptables: /pt/linux/firewall/iptables
- Firewall nftables: /pt/linux/firewall/nftables
- DHCP (Kea/isc): /pt/linux/servicos/dhcp
- VPN WireGuard: /pt/linux/servicos/wireguard
- Zabbix Agent: /pt/linux/monitoramento/zabbix
- Grafana + Prometheus: /pt/linux/monitoramento/grafana

SERVIÇOS:
- Zabbix: /pt/servicos/zabbix
- Zabbix via Docker: /pt/servicos/zabbix-docker
- Grafana + Prometheus: /pt/servicos/grafana
- Grafana via Docker: /pt/servicos/grafana-docker
- FreeRADIUS: /pt/servicos/freeradius

OUTROS:
- Glossário: /pt/glossario
- Como Contribuir: /pt/contribuir
- Sobre o criador: /pt/sobre

Quando citar uma página, use o formato markdown de link assim:
[Texto do link](/pt/caminho/da/pagina)

Seja direto e útil. Máximo 4 parágrafos por resposta.`

const messages = ref([
  {
    role: 'assistant',
    content: 'Olá! 👋 Sou o **PacketBot**, assistente do PacketWiki.\n\nPosso te ajudar a encontrar configurações, tirar dúvidas técnicas e te guiar para a página certa. O que precisa?',
  },
])

const history = ref([])

function renderMarkdown(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => {
      const full = href.startsWith('/') ? href : href
      return `<a href="${full}" class="chat-link" onclick="event.preventDefault(); window.__chatNav && window.__chatNav('${full}')">${label}</a>`
    })
    .replace(/\n/g, '<br>')
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
  history.value.push({ role: 'user', parts: [{ text }] })
  isLoading.value = true
  await scrollBottom()

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: history.value,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 600,
          },
        }),
      }
    )

    const data = await res.json()
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text
      || 'Desculpe, não consegui gerar uma resposta. Tente novamente.'

    messages.value.push({ role: 'assistant', content: reply })
    history.value.push({ role: 'model', parts: [{ text: reply }] })

    if (!isOpen.value) unread.value++
  } catch (e) {
    messages.value.push({
      role: 'assistant',
      content: '⚠️ Erro ao conectar com o assistente. Verifique sua conexão e tente novamente.',
    })
  } finally {
    isLoading.value = false
    await scrollBottom()
    inputEl.value?.focus()
  }
}

onMounted(() => {
  window.__chatNav = (path) => {
    router.go(path)
    isOpen.value = false
  }
})
</script>

<style scoped>
/* ── FAB ── */
.chat-fab {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0284c7, #10b981);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 18px rgba(2, 132, 199, 0.45);
  transition: transform 0.2s, box-shadow 0.2s;
  z-index: 200;
}
.chat-fab:hover { transform: scale(1.08); box-shadow: 0 6px 24px rgba(2, 132, 199, 0.55); }
.fab-icon { font-size: 1.4rem; line-height: 1; }
.fab-close { font-size: 1rem; font-weight: 700; color: white; }
.fab-badge {
  position: absolute;
  top: -4px; right: -4px;
  background: #ef4444;
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  width: 18px; height: 18px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
}

/* ── Window ── */
.chat-window {
  position: fixed;
  bottom: 86px;
  right: 24px;
  width: 360px;
  max-height: 520px;
  display: flex;
  flex-direction: column;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 16px;
  box-shadow: 0 16px 48px rgba(0,0,0,0.18);
  z-index: 199;
  overflow: hidden;
}

@media (max-width: 480px) {
  .chat-window {
    right: 8px; left: 8px; width: auto; bottom: 82px;
  }
}

/* ── Header ── */
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: linear-gradient(135deg, #0284c7, #0369a1);
  flex-shrink: 0;
}
.chat-header-info { display: flex; align-items: center; gap: 10px; }
.chat-avatar { font-size: 1.6rem; }
.chat-name { color: white; font-weight: 700; font-size: 0.95rem; }
.chat-status { color: rgba(255,255,255,0.8); font-size: 0.75rem; display: flex; align-items: center; gap: 5px; margin-top: 1px; }
.status-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: #4ade80;
  flex-shrink: 0;
}
.status-dot.thinking { background: #fbbf24; animation: pulse 1s infinite; }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
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
.msg-avatar { font-size: 1.3rem; flex-shrink: 0; }
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
  background: linear-gradient(135deg, #0284c7, #0369a1);
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
  background: linear-gradient(135deg, #0284c7, #10b981);
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

/* ── Transition ── */
.chat-slide-enter-active { animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.chat-slide-leave-active { animation: slideDown 0.22s ease-in forwards; }
@keyframes slideUp   { from { opacity:0; transform:translateY(20px) scale(0.95); } to { opacity:1; transform:translateY(0) scale(1); } }
@keyframes slideDown { from { opacity:1; transform:translateY(0) scale(1); } to { opacity:0; transform:translateY(16px) scale(0.95); } }
</style>
