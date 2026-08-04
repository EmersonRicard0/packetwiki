<template>
  <div class="nt">
    <div v-if="tabs.length > 1" class="nt-tabs">
      <button
        v-for="t in tabs"
        :key="t.id"
        class="nt-tab"
        :class="{ active: tab === t.id }"
        @click="tab = t.id"
      >{{ t.label }}</button>
    </div>

    <!-- ══ SUB-REDE ══ -->
    <div v-show="tab === 'subnet'" class="nt-panel">
      <label class="nt-label">Endereço IPv4 com prefixo (CIDR)</label>
      <div class="nt-row">
        <input
          v-model="subnetInput"
          class="nt-input"
          placeholder="192.168.10.20/24"
          @keydown.enter="calcSubnet"
          spellcheck="false"
        />
        <button class="nt-btn" @click="calcSubnet">Calcular</button>
      </div>
      <p v-if="subnetError" class="nt-error">{{ subnetError }}</p>

      <div v-if="subnet" class="nt-result">
        <div class="nt-grid">
          <div v-for="row in subnetRows" :key="row.k" class="nt-cell">
            <span class="nt-k">{{ row.k }}</span>
            <span class="nt-v">{{ row.v }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ══ DNS ══ -->
    <div v-show="tab === 'dns'" class="nt-panel">
      <label class="nt-label">Domínio (ou IP, para PTR)</label>
      <div class="nt-row">
        <input
          v-model="dnsName"
          class="nt-input"
          placeholder="ertechnol.com.br"
          @keydown.enter="doDns"
          spellcheck="false"
        />
        <select v-model="dnsType" class="nt-select">
          <option v-for="t in dnsTypes" :key="t" :value="t">{{ t }}</option>
        </select>
        <button class="nt-btn" @click="doDns" :disabled="dnsLoading">
          {{ dnsLoading ? '...' : 'Consultar' }}
        </button>
      </div>
      <p v-if="dnsError" class="nt-error">{{ dnsError }}</p>

      <div v-if="dnsResult" class="nt-result">
        <p v-if="!dnsResult.answers.length" class="nt-empty">
          Nenhum registro {{ dnsResult.type }} encontrado.
        </p>
        <table v-else class="nt-table">
          <thead><tr><th>Nome</th><th>Tipo</th><th>TTL</th><th>Valor</th></tr></thead>
          <tbody>
            <tr v-for="(a, i) in dnsResult.answers" :key="i">
              <td>{{ a.name }}</td>
              <td><span class="nt-badge">{{ a.type }}</span></td>
              <td>{{ a.ttl }}s</td>
              <td class="nt-mono">{{ a.data }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ══ ASN / IP ══ -->
    <div v-show="tab === 'asn'" class="nt-panel">
      <label class="nt-label">ASN (ex.: AS13335) ou IP</label>
      <div class="nt-row">
        <input
          v-model="asnQuery"
          class="nt-input"
          placeholder="AS13335  ou  1.1.1.1"
          @keydown.enter="doAsn"
          spellcheck="false"
        />
        <button class="nt-btn" @click="doAsn" :disabled="asnLoading">
          {{ asnLoading ? '...' : 'Consultar' }}
        </button>
      </div>
      <p v-if="asnError" class="nt-error">{{ asnError }}</p>

      <div v-if="asnResult" class="nt-result">
        <div class="nt-grid">
          <div v-if="asnResult.asn" class="nt-cell"><span class="nt-k">ASN</span><span class="nt-v">{{ asnResult.asn }}</span></div>
          <div v-if="asnResult.ip" class="nt-cell"><span class="nt-k">IP</span><span class="nt-v">{{ asnResult.ip }}</span></div>
          <div v-if="asnResult.holder" class="nt-cell"><span class="nt-k">Organização</span><span class="nt-v">{{ asnResult.holder }}</span></div>
          <div v-if="asnResult.asns" class="nt-cell"><span class="nt-k">ASN de origem</span><span class="nt-v">{{ asnResult.asns.join(', ') || '—' }}</span></div>
          <div v-if="asnResult.prefix" class="nt-cell"><span class="nt-k">Prefixo</span><span class="nt-v">{{ asnResult.prefix }}</span></div>
          <div v-if="asnResult.prefixCount != null" class="nt-cell"><span class="nt-k">Prefixos anunciados</span><span class="nt-v">{{ asnResult.prefixCount }}</span></div>
        </div>

        <div v-if="asnResult.prefixes && asnResult.prefixes.length" class="nt-prefixes">
          <div class="nt-label" style="margin-top:14px">Prefixos anunciados</div>
          <div class="nt-tags">
            <span v-for="p in asnResult.prefixes" :key="p" class="nt-tag">{{ p }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ══ MEU IP ══ -->
    <div v-show="tab === 'whoami'" class="nt-panel">
      <div class="nt-row">
        <button class="nt-btn" @click="doWhoami" :disabled="whoamiLoading">
          {{ whoamiLoading ? '...' : 'Mostrar meu IP' }}
        </button>
      </div>
      <p v-if="whoamiError" class="nt-error">{{ whoamiError }}</p>
      <div v-if="whoami" class="nt-result">
        <div class="nt-grid">
          <div v-for="row in whoamiRows" :key="row.k" class="nt-cell">
            <span class="nt-k">{{ row.k }}</span>
            <span class="nt-v">{{ row.v }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ══ HTTP / TLS ══ -->
    <div v-show="tab === 'http'" class="nt-panel">
      <label class="nt-label">URL ou domínio</label>
      <div class="nt-row">
        <input v-model="httpUrl" class="nt-input" placeholder="ertechnol.com.br" @keydown.enter="doHttp" spellcheck="false" />
        <button class="nt-btn" @click="doHttp" :disabled="httpLoading">{{ httpLoading ? '...' : 'Checar' }}</button>
      </div>
      <p v-if="httpError" class="nt-error">{{ httpError }}</p>

      <div v-if="httpResult" class="nt-result">
        <div class="nt-grid">
          <div class="nt-cell"><span class="nt-k">Status</span><span class="nt-v">{{ httpResult.status }} {{ httpResult.statusText }}</span></div>
          <div class="nt-cell"><span class="nt-k">Tempo de resposta</span><span class="nt-v">{{ httpResult.responseTimeMs }} ms</span></div>
          <div class="nt-cell"><span class="nt-k">HTTPS</span><span class="nt-v">{{ httpResult.https ? 'Sim' : 'Não' }}</span></div>
          <div class="nt-cell"><span class="nt-k">Segurança</span><span class="nt-v">{{ httpResult.securityScore }}</span></div>
          <div v-if="httpResult.server" class="nt-cell"><span class="nt-k">Servidor</span><span class="nt-v">{{ httpResult.server }}</span></div>
          <div v-if="httpResult.redirected" class="nt-cell"><span class="nt-k">Redirecionou para</span><span class="nt-v" style="font-size:.8rem">{{ httpResult.finalUrl }}</span></div>
        </div>

        <div v-if="httpResult.cert" class="nt-grid" style="margin-top:10px">
          <div class="nt-cell"><span class="nt-k">Certificado — emissor</span><span class="nt-v" style="font-size:.85rem">{{ httpResult.cert.issuer }}</span></div>
          <div class="nt-cell"><span class="nt-k">Expira em</span><span class="nt-v">{{ httpResult.cert.notAfter }} ({{ httpResult.cert.daysLeft }} dias)</span></div>
        </div>

        <div class="nt-label" style="margin-top:14px">Cabeçalhos de segurança</div>
        <div class="nt-tags">
          <span v-for="s in httpResult.security" :key="s.label" class="nt-tag" :class="{ ok: s.present }">
            {{ s.present ? '✓' : '✕' }} {{ s.label }}
          </span>
        </div>
      </div>
    </div>

    <!-- ══ E-MAIL SPF/DKIM/DMARC ══ -->
    <div v-show="tab === 'email'" class="nt-panel">
      <label class="nt-label">Domínio (seletor DKIM é opcional)</label>
      <div class="nt-row">
        <input v-model="emailDomain" class="nt-input" placeholder="ertechnol.com.br" @keydown.enter="doEmail" spellcheck="false" />
        <input v-model="emailSelector" class="nt-input" style="max-width:150px;min-width:120px" placeholder="seletor DKIM" spellcheck="false" />
        <button class="nt-btn" @click="doEmail" :disabled="emailLoading">{{ emailLoading ? '...' : 'Verificar' }}</button>
      </div>
      <p v-if="emailError" class="nt-error">{{ emailError }}</p>

      <div v-if="emailResult" class="nt-result">
        <div class="nt-grid">
          <div class="nt-cell"><span class="nt-k">SPF</span><span class="nt-v">{{ emailResult.resumo.spf }}</span></div>
          <div class="nt-cell"><span class="nt-k">DMARC</span><span class="nt-v">{{ emailResult.resumo.dmarc }}</span></div>
          <div v-if="emailResult.dkim" class="nt-cell"><span class="nt-k">DKIM ({{ emailResult.dkim.selector }})</span><span class="nt-v">{{ emailResult.dkim.found ? 'encontrado' : 'ausente' }}</span></div>
        </div>
        <div v-if="emailResult.spf.record" class="nt-reg"><span class="nt-k">SPF</span><code>{{ emailResult.spf.record }}</code></div>
        <div v-if="emailResult.dmarc.record" class="nt-reg"><span class="nt-k">DMARC</span><code>{{ emailResult.dmarc.record }}</code></div>
        <div v-if="emailResult.dkim && emailResult.dkim.record" class="nt-reg"><span class="nt-k">DKIM</span><code>{{ emailResult.dkim.record }}</code></div>
      </div>
    </div>

    <!-- ══ VLSM ══ -->
    <div v-show="tab === 'vlsm'" class="nt-panel">
      <label class="nt-label">Bloco base (CIDR) e tamanhos de host</label>
      <div class="nt-row">
        <input v-model="vlsmBase" class="nt-input" style="max-width:200px" placeholder="10.0.0.0/24" spellcheck="false" />
        <input v-model="vlsmHosts" class="nt-input" placeholder="50, 20, 10, 2" spellcheck="false" @keydown.enter="calcVlsm" />
        <button class="nt-btn" @click="calcVlsm">Dividir</button>
      </div>
      <p v-if="vlsmError" class="nt-error">{{ vlsmError }}</p>
      <div v-if="vlsmResult" class="nt-result">
        <table class="nt-table">
          <thead><tr><th>Precisa</th><th>Sub-rede</th><th>Máscara</th><th>Faixa útil</th><th>Broadcast</th><th>Hosts</th></tr></thead>
          <tbody>
            <tr v-for="(r, i) in vlsmResult" :key="i">
              <td>{{ r.need }}</td><td class="nt-mono">{{ r.cidr }}</td><td class="nt-mono">{{ r.mask }}</td>
              <td class="nt-mono">{{ r.range }}</td><td class="nt-mono">{{ r.broadcast }}</td><td>{{ r.hosts }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ══ SUMARIZAÇÃO ══ -->
    <div v-show="tab === 'summ'" class="nt-panel">
      <label class="nt-label">CIDRs a agregar (um por linha)</label>
      <textarea v-model="summInput" class="nt-input" rows="4" style="min-width:100%;font-family:var(--vp-font-family-mono)" spellcheck="false"></textarea>
      <div class="nt-row" style="margin-top:8px"><button class="nt-btn" @click="calcSumm">Sumarizar</button></div>
      <p v-if="summError" class="nt-error">{{ summError }}</p>
      <div v-if="summResult" class="nt-result">
        <div class="nt-grid">
          <div class="nt-cell"><span class="nt-k">Supernet</span><span class="nt-v">{{ summResult.cidr }}</span></div>
          <div class="nt-cell"><span class="nt-k">Máscara</span><span class="nt-v">{{ summResult.mask }}</span></div>
          <div class="nt-cell"><span class="nt-k">Broadcast</span><span class="nt-v">{{ summResult.broadcast }}</span></div>
          <div class="nt-cell"><span class="nt-k">Cobertura</span><span class="nt-v">{{ summResult.exact ? 'Exata' : 'Aproximada (inclui extras)' }}</span></div>
        </div>
      </div>
    </div>

    <!-- ══ IPv6 / EUI-64 ══ -->
    <div v-show="tab === 'eui'" class="nt-panel">
      <label class="nt-label">Endereço MAC</label>
      <div class="nt-row">
        <input v-model="euiMac" class="nt-input" placeholder="00:1A:2B:3C:4D:5E" spellcheck="false" @keydown.enter="calcEui" />
        <button class="nt-btn" @click="calcEui">Gerar</button>
      </div>
      <p v-if="euiError" class="nt-error">{{ euiError }}</p>
      <div v-if="euiResult" class="nt-result">
        <div class="nt-grid">
          <div class="nt-cell"><span class="nt-k">Interface ID (EUI-64)</span><span class="nt-v">{{ euiResult.eui64 }}</span></div>
          <div class="nt-cell"><span class="nt-k">Link-local</span><span class="nt-v">{{ euiResult.linkLocal }}</span></div>
        </div>
      </div>
    </div>

    <!-- ══ ÓPTICO GPON ══ -->
    <div v-show="tab === 'gpon'" class="nt-panel">
      <div class="nt-grid" style="margin-bottom:12px">
        <label class="nt-cell"><span class="nt-k">Potência OLT Tx (dBm)</span><input v-model="gTx" class="nt-input" /></label>
        <label class="nt-cell"><span class="nt-k">Distância (km)</span><input v-model="gLen" class="nt-input" /></label>
        <label class="nt-cell"><span class="nt-k">Atenuação (dB/km)</span><input v-model="gAtt" class="nt-input" /></label>
        <label class="nt-cell"><span class="nt-k">Perdas conectores/emendas (dB)</span><input v-model="gConn" class="nt-input" /></label>
        <label class="nt-cell"><span class="nt-k">Splitter</span>
          <select v-model="gSplit" class="nt-select"><option v-for="s in splitRatios" :key="s" :value="s">{{ s }}</option></select>
        </label>
      </div>
      <div class="nt-row"><button class="nt-btn" @click="calcGpon">Calcular orçamento</button></div>
      <div v-if="gponResult" class="nt-result">
        <p v-if="gponResult.error" class="nt-error">{{ gponResult.error }}</p>
        <div v-else class="nt-grid">
          <div class="nt-cell"><span class="nt-k">Perda fibra</span><span class="nt-v">{{ gponResult.fiber }} dB</span></div>
          <div class="nt-cell"><span class="nt-k">Perda splitter</span><span class="nt-v">{{ gponResult.split }} dB</span></div>
          <div class="nt-cell"><span class="nt-k">Perda total</span><span class="nt-v">{{ gponResult.total }} dB</span></div>
          <div class="nt-cell"><span class="nt-k">Potência na ONU (Rx)</span><span class="nt-v">{{ gponResult.rx }} dBm</span></div>
          <div class="nt-cell" style="grid-column:1/-1"><span class="nt-k">Status</span><span class="nt-v">{{ gponResult.status }}</span></div>
        </div>
      </div>
    </div>

    <p class="nt-note">
      DNS e ASN consultam serviços públicos (Cloudflare DoH e RIPEstat) via função serverless.
      Não funcionam no preview local — apenas no site publicado.
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// `only` limita quais ferramentas aparecem (usado nas subpáginas).
// Aceita uma string ('dns') ou lista (['subnet','vlsm','summ']).
const props = defineProps({ only: { type: [String, Array], default: null } })

const allTabs = [
  { id: 'subnet', label: 'Sub-rede IPv4' },
  { id: 'dns', label: 'DNS / nslookup' },
  { id: 'asn', label: 'ASN / IP' },
  { id: 'whoami', label: 'Meu IP' },
  { id: 'http', label: 'HTTP / TLS' },
  { id: 'email', label: 'E-mail (SPF/DMARC)' },
  { id: 'vlsm', label: 'VLSM' },
  { id: 'summ', label: 'Sumarização' },
  { id: 'eui', label: 'IPv6 / EUI-64' },
  { id: 'gpon', label: 'Óptico GPON' },
]
const onlyIds = computed(() => (props.only ? (Array.isArray(props.only) ? props.only : [props.only]) : null))
const tabs = computed(() => (onlyIds.value ? allTabs.filter((t) => onlyIds.value.includes(t.id)) : allTabs))
const tab = ref(tabs.value[0]?.id || 'subnet')

async function callApi(path) {
  const res = await fetch(path)
  const data = await res.json().catch(() => ({}))
  if (res.status === 404 || res.status === 405) throw new Error('Disponível apenas no site publicado.')
  if (!res.ok || data.error) throw new Error(data.error || 'Falha na consulta.')
  return data
}

/* ── Sub-rede IPv4 ── */
const subnetInput = ref('')
const subnet = ref(null)
const subnetError = ref('')

const ipToInt = (ip) => ip.split('.').reduce((a, o) => ((a << 8) + (parseInt(o, 10) & 255)) >>> 0, 0) >>> 0
const intToIp = (n) => [24, 16, 8, 0].map((s) => (n >>> s) & 255).join('.')

function isPrivate(n) {
  const ip = intToIp(n)
  return /^10\./.test(ip) || /^192\.168\./.test(ip) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(ip) || /^127\./.test(ip) || /^169\.254\./.test(ip)
}

function calcSubnet() {
  subnetError.value = ''
  subnet.value = null
  const m = subnetInput.value.trim().match(/^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\s*\/\s*(\d{1,2})$/)
  if (!m) { subnetError.value = 'Formato: 192.168.10.20/24'; return }
  const octets = m[1].split('.').map(Number)
  const prefix = +m[2]
  if (octets.some((o) => o > 255) || prefix > 32) { subnetError.value = 'IP ou prefixo inválido.'; return }

  const ip = ipToInt(m[1])
  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0
  const wildcard = (~mask) >>> 0
  const network = (ip & mask) >>> 0
  const broadcast = (network | wildcard) >>> 0
  const total = prefix >= 31 ? (prefix === 31 ? 2 : 1) : broadcast - network + 1
  const usable = prefix >= 31 ? total : Math.max(0, total - 2)
  const first = prefix >= 31 ? network : network + 1
  const last = prefix >= 31 ? broadcast : broadcast - 1

  subnet.value = {
    network: intToIp(network), mask: intToIp(mask), wildcard: intToIp(wildcard),
    broadcast: intToIp(broadcast), first: intToIp(first), last: intToIp(last),
    usable, total, prefix, tipo: isPrivate(network) ? 'Privado (RFC 1918)' : 'Público',
  }
}

const subnetRows = computed(() => {
  const s = subnet.value
  if (!s) return []
  return [
    { k: 'Rede', v: `${s.network}/${s.prefix}` },
    { k: 'Máscara', v: s.mask },
    { k: 'Wildcard', v: s.wildcard },
    { k: 'Broadcast', v: s.broadcast },
    { k: 'Primeiro host', v: s.first },
    { k: 'Último host', v: s.last },
    { k: 'Hosts utilizáveis', v: s.usable.toLocaleString('pt-BR') },
    { k: 'Total de endereços', v: s.total.toLocaleString('pt-BR') },
    { k: 'Tipo', v: s.tipo },
  ]
})

/* ── DNS ── */
const dnsTypes = ['A', 'AAAA', 'MX', 'TXT', 'NS', 'CNAME', 'SOA', 'CAA', 'SRV', 'PTR']
const dnsName = ref('')
const dnsType = ref('A')
const dnsResult = ref(null)
const dnsError = ref('')
const dnsLoading = ref(false)

async function doDns() {
  const name = dnsName.value.trim()
  if (!name) { dnsError.value = 'Informe um domínio.'; return }
  dnsError.value = ''; dnsResult.value = null; dnsLoading.value = true
  try {
    const res = await fetch(`/api/dns?name=${encodeURIComponent(name)}&type=${dnsType.value}`)
    const data = await res.json()
    if (res.status === 404 || res.status === 405) throw new Error('Disponível apenas no site publicado.')
    if (!res.ok || data.error) throw new Error(data.error || 'Falha na consulta.')
    dnsResult.value = data
  } catch (e) { dnsError.value = e.message } finally { dnsLoading.value = false }
}

/* ── ASN / IP ── */
const asnQuery = ref('')
const asnResult = ref(null)
const asnError = ref('')
const asnLoading = ref(false)

async function doAsn() {
  const q = asnQuery.value.trim()
  if (!q) { asnError.value = 'Informe um ASN ou IP.'; return }
  asnError.value = ''; asnResult.value = null; asnLoading.value = true
  try {
    asnResult.value = await callApi(`/api/asn?q=${encodeURIComponent(q)}`)
  } catch (e) { asnError.value = e.message } finally { asnLoading.value = false }
}

/* ── Meu IP ── */
const whoami = ref(null)
const whoamiError = ref('')
const whoamiLoading = ref(false)
async function doWhoami() {
  whoamiError.value = ''; whoami.value = null; whoamiLoading.value = true
  try {
    whoami.value = await callApi('/api/whoami')
  } catch (e) { whoamiError.value = e.message } finally { whoamiLoading.value = false }
}
const whoamiRows = computed(() => {
  const w = whoami.value
  if (!w) return []
  return [
    { k: 'Endereço IP', v: w.ip || '—' },
    { k: 'ASN', v: w.asn || '—' },
    { k: 'Organização', v: w.org || '—' },
    { k: 'País', v: w.country || '—' },
    { k: 'Cidade', v: [w.city, w.region].filter(Boolean).join(', ') || '—' },
    { k: 'Data center (colo)', v: w.colo || '—' },
    { k: 'TLS', v: w.tlsVersion || '—' },
    { k: 'HTTP', v: w.httpProtocol || '—' },
  ]
})

/* ── HTTP / TLS ── */
const httpUrl = ref('')
const httpResult = ref(null)
const httpError = ref('')
const httpLoading = ref(false)
async function doHttp() {
  const u = httpUrl.value.trim()
  if (!u) { httpError.value = 'Informe uma URL ou domínio.'; return }
  httpError.value = ''; httpResult.value = null; httpLoading.value = true
  try {
    httpResult.value = await callApi(`/api/httpcheck?url=${encodeURIComponent(u)}`)
  } catch (e) { httpError.value = e.message } finally { httpLoading.value = false }
}

/* ── E-mail SPF/DKIM/DMARC ── */
const emailDomain = ref('')
const emailSelector = ref('')
const emailResult = ref(null)
const emailError = ref('')
const emailLoading = ref(false)
async function doEmail() {
  const d = emailDomain.value.trim()
  if (!d) { emailError.value = 'Informe um domínio.'; return }
  emailError.value = ''; emailResult.value = null; emailLoading.value = true
  try {
    const sel = emailSelector.value.trim()
    emailResult.value = await callApi(`/api/email?domain=${encodeURIComponent(d)}${sel ? `&selector=${encodeURIComponent(sel)}` : ''}`)
  } catch (e) { emailError.value = e.message } finally { emailLoading.value = false }
}

/* ── VLSM ── */
const vlsmBase = ref('10.0.0.0/24')
const vlsmHosts = ref('50, 20, 10, 2')
const vlsmResult = ref(null)
const vlsmError = ref('')
function calcVlsm() {
  vlsmError.value = ''; vlsmResult.value = null
  const m = vlsmBase.value.trim().match(/^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\s*\/\s*(\d{1,2})$/)
  if (!m || +m[2] > 32) { vlsmError.value = 'Base no formato 10.0.0.0/24'; return }
  const basePrefix = +m[2]
  const reqs = vlsmHosts.value.split(/[,\s]+/).map((x) => parseInt(x, 10)).filter((x) => x > 0)
  if (!reqs.length) { vlsmError.value = 'Informe os tamanhos (ex.: 50, 20, 10)'; return }
  reqs.sort((a, b) => b - a)
  const baseMask = basePrefix === 0 ? 0 : (0xffffffff << (32 - basePrefix)) >>> 0
  let cursor = (ipToInt(m[1]) & baseMask) >>> 0
  const baseEnd = (cursor | (~baseMask >>> 0)) >>> 0
  const rows = []
  for (const need of reqs) {
    let h = 1; while ((2 ** h - 2) < need) h++
    const pfx = 32 - h
    const size = 2 ** h
    const net = cursor
    const bc = (net + size - 1) >>> 0
    if (bc > baseEnd) { vlsmError.value = `Não cabe no bloco: /${pfx} para ${need} hosts excede a base.`; return }
    rows.push({
      need, cidr: `${intToIp(net)}/${pfx}`, mask: intToIp(pfx === 0 ? 0 : (0xffffffff << (32 - pfx)) >>> 0),
      range: `${intToIp(net + 1)} – ${intToIp(bc - 1)}`, broadcast: intToIp(bc), hosts: size - 2,
    })
    cursor = (bc + 1) >>> 0
  }
  vlsmResult.value = rows
}

/* ── Sumarização de rotas ── */
const summInput = ref('192.168.0.0/24\n192.168.1.0/24\n192.168.2.0/24\n192.168.3.0/24')
const summResult = ref(null)
const summError = ref('')
function calcSumm() {
  summError.value = ''; summResult.value = null
  const lines = summInput.value.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean)
  if (!lines.length) { summError.value = 'Informe CIDRs (um por linha).'; return }
  let lo = 0xffffffff, hi = 0
  for (const l of lines) {
    const m = l.match(/^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?:\/(\d{1,2}))?$/)
    if (!m || (m[2] && +m[2] > 32)) { summError.value = 'Entrada inválida: ' + l; return }
    const p = m[2] !== undefined ? +m[2] : 32
    const mask = p === 0 ? 0 : (0xffffffff << (32 - p)) >>> 0
    const net = (ipToInt(m[1]) & mask) >>> 0
    const bc = (net | (~mask >>> 0)) >>> 0
    if (net < lo) lo = net; if (bc > hi) hi = bc
  }
  let p = 32
  while (p > 0) {
    const mask = (0xffffffff << (32 - p)) >>> 0
    if (((lo & mask) >>> 0) === ((hi & mask) >>> 0)) break
    p--
  }
  const mask = p === 0 ? 0 : (0xffffffff << (32 - p)) >>> 0
  const net = (lo & mask) >>> 0
  const bc = (net | (~mask >>> 0)) >>> 0
  summResult.value = {
    cidr: `${intToIp(net)}/${p}`, mask: intToIp(mask), broadcast: intToIp(bc),
    exact: net === lo && bc === hi,
  }
}

/* ── IPv6 / EUI-64 ── */
const euiMac = ref('')
const euiResult = ref(null)
const euiError = ref('')
function calcEui() {
  euiError.value = ''; euiResult.value = null
  const mac = euiMac.value.trim().replace(/[.:-]/g, '')
  if (!/^[0-9a-fA-F]{12}$/.test(mac)) { euiError.value = 'MAC inválido (ex.: 00:1A:2B:3C:4D:5E)'; return }
  const b = mac.toLowerCase().match(/.{2}/g)
  const first = (parseInt(b[0], 16) ^ 0x02).toString(16).padStart(2, '0')
  const iid = [first, b[1], b[2], 'ff', 'fe', b[3], b[4], b[5]].join('')
  const hextets = iid.match(/.{4}/g)
  euiResult.value = {
    eui64: hextets.join(':'),
    linkLocal: 'fe80::' + hextets.map((h) => h.replace(/^0+/, '') || '0').join(':'),
  }
}

/* ── Orçamento óptico GPON ── */
const gTx = ref('3'); const gLen = ref('10'); const gAtt = ref('0.35'); const gSplit = ref('1:64'); const gConn = ref('1.5')
const gponResult = ref(null)
const splitRatios = ['1:2', '1:4', '1:8', '1:16', '1:32', '1:64', '1:128']
const splitLoss = { '1:2': 3.5, '1:4': 7.0, '1:8': 10.5, '1:16': 14.0, '1:32': 17.5, '1:64': 21.0, '1:128': 24.5 }
function calcGpon() {
  const tx = parseFloat(gTx.value), len = parseFloat(gLen.value), att = parseFloat(gAtt.value), conn = parseFloat(gConn.value)
  if ([tx, len, att, conn].some((n) => isNaN(n))) { gponResult.value = { error: 'Preencha os campos numéricos.' }; return }
  const sl = splitLoss[gSplit.value] ?? 0
  const fiber = len * att
  const total = fiber + sl + conn
  const rx = tx - total
  const sens = -28, sat = -8
  let status = 'OK — dentro da faixa'
  if (rx < sens) status = 'FALHA — abaixo da sensibilidade (-28 dBm)'
  else if (rx > sat) status = 'ALERTA — saturação (acima de -8 dBm)'
  else if (rx < sens + 3) status = 'MARGEM BAIXA — menos de 3 dB de folga'
  gponResult.value = { fiber: fiber.toFixed(2), split: sl.toFixed(1), conn: conn.toFixed(1), total: total.toFixed(2), rx: rx.toFixed(2), status }
}
</script>

<style scoped>
.nt { margin: 24px 0; }
.nt-tabs { display: flex; gap: 6px; flex-wrap: wrap; border-bottom: 1px solid var(--vp-c-divider); margin-bottom: 20px; }
.nt-tab {
  padding: 9px 16px;
  border: none;
  background: none;
  color: var(--vp-c-text-2);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  transition: color 0.2s, border-color 0.2s;
}
.nt-tab:hover { color: var(--vp-c-text-1); }
.nt-tab.active { color: var(--vp-c-brand-1); border-bottom-color: var(--vp-c-brand-1); }

.nt-label { display: block; font-size: 0.82rem; color: var(--vp-c-text-2); margin-bottom: 8px; font-weight: 500; }
.nt-row { display: flex; gap: 8px; flex-wrap: wrap; }
.nt-input {
  flex: 1; min-width: 180px;
  padding: 10px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-family: var(--vp-font-family-mono);
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;
}
.nt-input:focus { border-color: var(--vp-c-brand-1); }
.nt-select {
  padding: 10px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 0.9rem;
  cursor: pointer;
}
.nt-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  background: #E53935;
  color: #fff;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.2s;
}
.nt-btn:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); }
.nt-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.nt-error { color: #ef4444; font-size: 0.85rem; margin: 12px 0 0; }
.nt-empty { color: var(--vp-c-text-2); font-size: 0.9rem; }
.nt-result { margin-top: 20px; }

.nt-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 10px; }
.nt-cell {
  display: flex; flex-direction: column; gap: 3px;
  padding: 12px 14px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
}
.nt-k { font-size: 0.74rem; color: var(--vp-c-text-2); text-transform: uppercase; letter-spacing: 0.04em; }
.nt-v { font-family: var(--vp-font-family-mono); font-size: 0.95rem; color: var(--vp-c-text-1); font-weight: 600; }

.nt-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
.nt-table th { text-align: left; padding: 8px 10px; color: var(--vp-c-brand-1); border-bottom: 1px solid var(--vp-c-divider); font-weight: 600; }
.nt-table td { padding: 8px 10px; border-bottom: 1px solid var(--vp-c-divider); vertical-align: top; }
.nt-mono { font-family: var(--vp-font-family-mono); word-break: break-all; }
.nt-badge {
  display: inline-block; padding: 1px 8px; border-radius: 6px;
  background: var(--vp-c-brand-soft); color: var(--vp-c-brand-1);
  font-size: 0.78rem; font-weight: 600;
}

.nt-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; max-height: 240px; overflow-y: auto; }
.nt-tag {
  font-family: var(--vp-font-family-mono); font-size: 0.78rem;
  padding: 3px 9px; border-radius: 7px;
  background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
}
.nt-tag.ok { border-color: rgba(34, 197, 94, 0.5); color: #16a34a; }
.dark .nt-tag.ok { color: #4ade80; }

.nt-reg { margin-top: 10px; display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; }
.nt-reg code {
  font-family: var(--vp-font-family-mono); font-size: 0.78rem; word-break: break-all;
  background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider);
  padding: 2px 8px; border-radius: 6px; color: var(--vp-c-text-1);
}

.nt-note { margin-top: 20px; font-size: 0.78rem; color: var(--vp-c-text-3); line-height: 1.5; }
</style>
