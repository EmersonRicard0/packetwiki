<template>
  <div class="nt">
    <div class="nt-tabs">
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

    <p class="nt-note">
      DNS e ASN consultam serviços públicos (Cloudflare DoH e RIPEstat) via função serverless.
      Não funcionam no preview local — apenas no site publicado.
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const tabs = [
  { id: 'subnet', label: 'Sub-rede IPv4' },
  { id: 'dns', label: 'DNS / nslookup' },
  { id: 'asn', label: 'ASN / IP' },
]
const tab = ref('subnet')

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
    const res = await fetch(`/api/asn?q=${encodeURIComponent(q)}`)
    const data = await res.json()
    if (res.status === 404 || res.status === 405) throw new Error('Disponível apenas no site publicado.')
    if (!res.ok || data.error) throw new Error(data.error || 'Falha na consulta.')
    asnResult.value = data
  } catch (e) { asnError.value = e.message } finally { asnLoading.value = false }
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
  background: linear-gradient(135deg, #E53935, #FF5A52);
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

.nt-note { margin-top: 20px; font-size: 0.78rem; color: var(--vp-c-text-3); line-height: 1.5; }
</style>
