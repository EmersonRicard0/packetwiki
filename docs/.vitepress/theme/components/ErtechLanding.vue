<template>
  <div class="er">
    <!-- glows de fundo -->
    <div class="er-bg" aria-hidden="true"></div>

    <!-- ══ HERO ══ -->
    <header class="er-hero">
      <div class="er-hero-text">
        <div class="er-wordmark"><span class="er-mark">ER</span><span class="er-tech">tech</span></div>
        <h1 class="er-tagline">
          Observabilidade de ponta a ponta para redes,
          servidores e infraestrutura crítica.
        </h1>
        <p class="er-hero-sub">
          Do backbone ao endpoint — monitoramento, alertas e performance,
          com automação onde antes havia esforço manual.
        </p>

        <div class="er-chips">
          <span class="er-chip"><i v-html="ic.noc"></i> NOC</span>
          <span class="er-chip"><i v-html="ic.soc"></i> SOC</span>
          <span class="er-chip"><i v-html="ic.automation"></i> Automação</span>
          <span class="er-chip"><i v-html="ic.layers"></i> Multivendor</span>
        </div>

        <div class="er-cta">
          <a class="er-btn primary" :href="mail"><i v-html="ic.mail"></i> Falar com a ERtech</a>
          <a class="er-btn ghost" href="/pt/"><i v-html="ic.book"></i> Acessar a Base de Conhecimento</a>
        </div>
      </div>
    </header>

    <!-- ══ IDENTIDADE ══ -->
    <section class="er-sec">
      <div class="er-identidade">
        <div class="er-portrait">
          <img src="/emerson-avatar.png" alt="Emerson Ricardo" />
        </div>
        <div class="er-identidade-text">
          <div class="er-kicker">01 — Identidade</div>
          <h2 class="er-h2">Do sinal disperso à decisão</h2>
          <p class="er-lead">
            Projeto e opero ecossistemas de monitoramento que transformam sinais dispersos em decisão.
            Do Zabbix ao Grafana, do alerta bruto ao insight acionável — cada camada da infraestrutura
            sob controle, com automação onde antes havia esforço manual.
          </p>
          <div class="er-chips">
            <span class="er-chip solid">Zabbix</span>
            <span class="er-chip solid">Grafana</span>
            <span class="er-chip solid">n8n</span>
            <span class="er-chip solid">Redes &amp; Infra</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ O QUE ENTREGO ══ -->
    <section class="er-sec">
      <div class="er-kicker">02 — O que entrego</div>
      <h2 class="er-h2">Três frentes, uma operação sob controle</h2>
      <p class="er-sub">Tudo no mesmo painel de verdade.</p>
      <div class="er-grid three">
        <article v-for="(c, i) in entrego" :key="c.t" class="er-card">
          <div class="er-card-top">
            <span class="er-ico" v-html="c.icon"></span>
            <span class="er-num">0{{ i + 1 }}</span>
          </div>
          <h3>{{ c.t }}</h3>
          <p>{{ c.d }}</p>
        </article>
      </div>
    </section>

    <!-- ══ DIFERENCIAIS ══ -->
    <section class="er-sec">
      <div class="er-kicker">03 — Diferenciais</div>
      <h2 class="er-h2">Por que ERtech</h2>
      <p class="er-sub">O que separa de um NOC genérico.</p>
      <div class="er-grid two">
        <article v-for="d in diferenciais" :key="d.t" class="er-card row">
          <span class="er-ico" v-html="d.icon"></span>
          <div>
            <h3>{{ d.t }}</h3>
            <p>{{ d.d }}</p>
          </div>
        </article>
      </div>
    </section>

    <!-- ══ STACK ══ -->
    <section class="er-sec">
      <div class="er-kicker">04 — Stack técnica</div>
      <h2 class="er-h2">Da coleta ao código</h2>
      <p class="er-sub">Ferramentas do dia a dia.</p>
      <div class="er-grid two">
        <article v-for="g in stack" :key="g.t" class="er-card">
          <div class="er-card-top">
            <span class="er-ico" v-html="g.icon"></span>
            <h3>{{ g.t }}</h3>
          </div>
          <div class="er-tags">
            <span v-for="tag in g.items" :key="tag" class="er-tag">{{ tag }}</span>
          </div>
        </article>
      </div>
    </section>

    <!-- ══ METODOLOGIA ══ -->
    <section class="er-sec">
      <div class="er-kicker">05 — Metodologia</div>
      <h2 class="er-h2">Todo projeto nasce de uma spec</h2>
      <p class="er-sub">GSD — spec-driven do primeiro ao último commit.</p>
      <div class="er-grid three">
        <article v-for="(s, i) in metodo" :key="s.k" class="er-card step">
          <span class="er-step-tag">{{ s.k }}</span>
          <span class="er-step-n">{{ i + 1 }}</span>
          <h3>{{ s.t }}</h3>
          <p>{{ s.d }}</p>
        </article>
      </div>
    </section>

    <!-- ══ ECOSSISTEMA ══ -->
    <section class="er-sec">
      <div class="er-kicker">06 — Ecossistema</div>
      <h2 class="er-h2">Um único painel de verdade</h2>
      <p class="er-sub">Coleta, correlação e visualização numa malha só.</p>
      <div class="er-grid three">
        <article v-for="e in ecossistema" :key="e.t" class="er-card">
          <div class="er-card-top">
            <span class="er-ico" v-html="e.icon"></span>
            <h3>{{ e.t }}</h3>
          </div>
          <div class="er-tags">
            <span v-for="tag in e.items" :key="tag" class="er-tag">{{ tag }}</span>
          </div>
        </article>
      </div>
    </section>

    <!-- ══ NÚMEROS ══ -->
    <section class="er-sec">
      <div class="er-kicker">07 — Em números</div>
      <h2 class="er-h2">Operação que fala por dados</h2>
      <div class="er-stats">
        <div v-for="n in numeros" :key="n.l" class="er-stat">
          <div class="er-stat-v">{{ n.v }}<span>{{ n.u }}</span></div>
          <div class="er-stat-l">{{ n.l }}</div>
        </div>
      </div>
      <p class="er-note">* valores ilustrativos — substituir pelos reais.</p>
    </section>

    <!-- ══ MÓDULO WIKI ══ -->
    <section class="er-sec">
      <div class="er-module">
        <div class="er-module-body">
          <div class="er-kicker">Módulo · Base de Conhecimento</div>
          <h2 class="er-h2">PacketWiki</h2>
          <p class="er-lead">
            A documentação técnica da ERtech: comandos testados e guias práticos de
            roteadores, switches, OLT/GPON, servidores Linux e monitoramento —
            Huawei, MikroTik, Datacom, Cisco, Zabbix, Grafana e mais.
          </p>
          <div class="er-cta">
            <a class="er-btn primary" href="/pt/"><i v-html="ic.book"></i> Abrir a Wiki</a>
            <a class="er-btn ghost" href="/pt/contribuir"><i v-html="ic.branch"></i> Como Contribuir</a>
          </div>
        </div>
        <div class="er-module-side">
          <a v-for="m in modulos" :key="m.t" :href="m.link" class="er-module-link">
            <span class="er-ico sm" v-html="m.icon"></span>
            <span>{{ m.t }}</span>
            <i class="er-arrow" v-html="ic.arrow"></i>
          </a>
        </div>
      </div>
    </section>

    <!-- ══ CONTATO ══ -->
    <section class="er-sec contato">
      <div class="er-kicker">08 — Contato</div>
      <h2 class="er-h2 big">Vamos colocar sua operação sob controle.</h2>

      <form v-if="contactState !== 'ok'" class="er-form" @submit.prevent="sendContact">
        <div class="er-form-row">
          <input v-model="form.name" class="er-field" placeholder="Seu nome" autocomplete="name" />
          <input v-model="form.email" type="email" class="er-field" placeholder="Seu e-mail" autocomplete="email" />
        </div>
        <input v-model="form.company" class="er-field" placeholder="Empresa (opcional)" autocomplete="organization" />
        <textarea v-model="form.message" class="er-field" rows="4" placeholder="Como posso ajudar? (rede, monitoramento, automação...)"></textarea>
        <input v-model="form._hp" class="er-hp" tabindex="-1" autocomplete="off" aria-hidden="true" />
        <p v-if="contactError" class="er-form-err">{{ contactError }}</p>
        <div class="er-cta center">
          <button type="submit" class="er-btn primary lg" :disabled="contactState === 'sending'">
            <i v-html="ic.mail"></i> {{ contactState === 'sending' ? 'Enviando...' : 'Enviar mensagem' }}
          </button>
          <a class="er-btn ghost" :href="mail">Ou mande um e-mail direto</a>
        </div>
      </form>

      <div v-else class="er-form-ok">
        <span class="er-ico" v-html="ic.shield"></span>
        <p>Mensagem enviada! Retorno em breve — obrigado pelo contato.</p>
      </div>
    </section>

    <!-- ══ FOOTER ══ -->
    <footer class="er-foot">
      <div class="er-wordmark sm"><span class="er-mark">ER</span><span class="er-tech">tech</span></div>
      <p>Emerson Ricardo · ERtech — Monitoramento · Alertas · Performance</p>
      <div class="er-foot-links">
        <a href="https://github.com/EmersonRicard0/packetwiki" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="/pt/">Wiki</a>
        <a :href="mail">Contato</a>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const mail = 'mailto:silvaemerson797@gmail.com?subject=Contato%20ERtech'

/* ── Formulário de contato ── */
const form = reactive({ name: '', email: '', company: '', message: '', _hp: '' })
const contactState = ref('idle') // idle | sending | ok
const contactError = ref('')

async function sendContact() {
  contactError.value = ''
  if (!form.name || !form.email || !form.message) {
    contactError.value = 'Preencha nome, e-mail e mensagem.'
    return
  }
  contactState.value = 'sending'
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json().catch(() => ({}))
    if (res.status === 404 || res.status === 405) throw new Error('O envio só funciona no site publicado.')
    if (!res.ok || data.error) throw new Error(data.error || 'Não foi possível enviar.')
    contactState.value = 'ok'
  } catch (e) {
    contactError.value = e.message
    contactState.value = 'idle'
  }
}

// ── Ícones (SVG stroke, herdam currentColor) ──
const s = (p, extra = '') =>
  `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${p}${extra}</svg>`

const ic = {
  monitor: s('<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/><path d="M6 12l3-3 2 2 4-4"/>'),
  bell: s('<path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>'),
  gauge: s('<path d="M12 14a2 2 0 1 0 0-.01"/><path d="M12 14l4-4"/><path d="M3 18a9 9 0 1 1 18 0"/>'),
  eye: s('<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/>'),
  layers: s('<path d="M12 2 2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>'),
  automation: s('<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>'),
  shield: s('<path d="M12 2 4 5v6c0 5 3.4 8.5 8 11 4.6-2.5 8-6 8-11V5l-8-3z"/><path d="m9 12 2 2 4-4"/>'),
  route: s('<circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="5" r="2.5"/><path d="M8.5 19H14a4 4 0 0 0 0-8H10a4 4 0 0 1 0-8h5.5"/>'),
  noc: s('<rect x="2" y="4" width="20" height="12" rx="2"/><path d="M7 20h10M12 16v4"/>'),
  soc: s('<path d="M12 2 4 5v6c0 5 3.4 8.5 8 11 4.6-2.5 8-6 8-11V5l-8-3z"/>'),
  target: s('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4"/>'),
  collect: s('<path d="M4 7V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2"/><rect x="3" y="7" width="18" height="5" rx="1.5"/><rect x="3" y="14" width="18" height="5" rx="1.5"/>'),
  link: s('<path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1"/>'),
  chart: s('<path d="M3 3v18h18"/><path d="M7 15l3-4 3 2 4-6"/>'),
  code: s('<path d="m16 18 4-6-4-6M8 6l-4 6 4 6"/>'),
  book: s('<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>'),
  branch: s('<circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="8" r="2.5"/><path d="M6 8.5v7M18 10.5a6 6 0 0 1-6 6H8"/>'),
  mail: s('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 6 10 7L22 6"/>'),
  arrow: s('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  switch: s('<rect x="2" y="9" width="20" height="6" rx="1.5"/><path d="M6 12h.01M10 12h.01M14 12h.01"/>'),
  fiber: s('<circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>'),
  linux: s('<path d="M12 3c-2 0-3 2-3 4 0 2 1 3 1 5s-3 3-3 6c0 2 3 3 5 3s5-1 5-3c0-3-3-4-3-6s1-3 1-5c0-2-1-4-3-4z"/>'),
  server: s('<rect x="3" y="4" width="18" height="7" rx="1.5"/><rect x="3" y="13" width="18" height="7" rx="1.5"/><path d="M7 7.5h.01M7 16.5h.01"/>'),
}

const entrego = [
  { t: 'Monitoramento', d: 'Visibilidade total de redes multivendor, servidores e aplicações em tempo real — do backbone ao endpoint.', icon: ic.monitor },
  { t: 'Alertas', d: 'Correlação inteligente e triagem automatizada. O ruído vira ação, e a ação chega antes do impacto.', icon: ic.bell },
  { t: 'Performance', d: 'SLAs, capacidade e tendências transformados em decisão — com relatórios que a diretoria realmente lê.', icon: ic.gauge },
]

const diferenciais = [
  { t: 'Visão ponta a ponta', d: 'Rede, servidores, cloud e aplicações numa só fonte de verdade — nada fica cego.', icon: ic.eye },
  { t: 'Multivendor sem lock-in', d: 'Huawei, Mikrotik, Datacom, ZTE, Proxmox e K8s — integro qualquer stack, sem depender de fabricante.', icon: ic.layers },
  { t: 'Automação que reduz esforço', d: 'Triagem, alertas e relatórios automatizados com n8n — o time foca no que importa.', icon: ic.automation },
  { t: 'Resposta antes do impacto', d: 'Correlação inteligente que dispara ação antes de o cliente perceber a falha.', icon: ic.shield },
]

const stack = [
  { t: 'Monitoramento & Observabilidade', items: ['Zabbix', 'Grafana', 'Prometheus', 'QRadar', 'SNMP'], icon: ic.chart },
  { t: 'Automação & Integração', items: ['n8n', 'Redis', 'Deluge', 'REST APIs', 'Webhooks', 'Sidekiq'], icon: ic.automation },
  { t: 'Desenvolvimento', items: ['Rails 7.2', 'FastAPI', 'Python', 'Angular', 'PostgreSQL', 'Docker'], icon: ic.code },
  { t: 'Redes & Infra', items: ['Huawei NE8000', 'Mikrotik', 'OLT Datacom/ZTE', 'BGP', 'Proxmox', 'K8s / Rancher'], icon: ic.route },
]

const metodo = [
  { k: 'SPEC', t: 'Definir o problema', d: 'Escopo, requisitos e critérios de sucesso antes de escrever qualquer linha.' },
  { k: 'PLAN', t: 'Desenhar a solução', d: 'Arquitetura, decisões técnicas e sequência de execução documentadas.' },
  { k: 'STATE', t: 'Executar e rastrear', d: 'Progresso e estado vivos — nada se perde entre iterações.' },
]

const ecossistema = [
  { t: 'Coleta', items: ['Zabbix', 'SNMP', 'Prometheus'], icon: ic.collect },
  { t: 'Correlação', items: ['n8n', 'Redis', 'QRadar'], icon: ic.link },
  { t: 'Visualização & Ação', items: ['Grafana', 'Relatórios', 'Alertas'], icon: ic.chart },
]

const numeros = [
  { v: '99.98', u: '%', l: 'Disponibilidade monitorada' },
  { v: '1.2k', u: '+', l: 'Hosts observados' },
  { v: '<4', u: 'min', l: 'MTTA médio' },
  { v: '24/7', u: '', l: 'Cobertura NOC' },
]

const modulos = [
  { t: 'Roteadores', link: '/pt/roteadores/', icon: ic.route },
  { t: 'Switches', link: '/pt/switches/', icon: ic.switch },
  { t: 'OLT / GPON', link: '/pt/olt/', icon: ic.fiber },
  { t: 'Servidores Linux', link: '/pt/linux/', icon: ic.server },
  { t: 'Serviços & Monitoramento', link: '/pt/servicos/', icon: ic.chart },
  { t: 'Ferramentas de Rede', link: '/pt/ferramentas/', icon: ic.automation },
  { t: 'Glossário', link: '/pt/glossario', icon: ic.book },
]
</script>

<style scoped>
.er {
  --bg: #1B1B1D;
  --surface: #252628;
  --line: rgba(229, 57, 53, 0.16);
  --red: #E53935;
  --coral: #FF5A52;
  --tx: #D6D6D6;
  --tx2: #8C8C8C;
  --disp: 'Space Grotesk', 'IBM Plex Sans', sans-serif;
  --mono: 'IBM Plex Mono', monospace;

  position: relative;
  background: var(--bg);
  color: var(--tx);
  font-family: 'IBM Plex Sans', sans-serif;
  min-height: 100vh;
  overflow: hidden;
}
.er-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.er > * { position: relative; z-index: 1; }

.er-wordmark {
  font-family: var(--disp);
  font-weight: 700;
  font-size: clamp(3rem, 9vw, 6rem);
  letter-spacing: -0.04em;
  line-height: 1;
}
.er-wordmark .er-mark { color: var(--red); }
.er-wordmark .er-tech { color: #fff; }
.er-wordmark.sm { font-size: 1.7rem; }

/* HERO */
.er-hero {
  max-width: 800px;
  margin: 0 auto;
  padding: clamp(72px, 13vh, 150px) 24px 72px;
  text-align: center;
}
.er-hero-text { text-align: center; }
.er-hero .er-wordmark { margin-bottom: 26px; }
.er-hero .er-tagline, .er-hero .er-hero-sub { margin-left: auto; margin-right: auto; }
.er-hero .er-chips, .er-hero .er-cta { justify-content: center; }

/* IDENTIDADE (retrato + texto) */
.er-identidade {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  gap: 40px;
  align-items: center;
}
.er-portrait {
  display: flex;
  justify-content: center;
}
.er-portrait img {
  width: 100%;
  max-width: 330px;
  height: auto;
  filter: drop-shadow(0 16px 32px rgba(0, 0, 0, 0.45));
}
.er-identidade-text .er-lead { margin-top: 16px; }
.er-identidade-text .er-chips { margin-top: 22px; }
.er-eyebrow {
  font-family: var(--mono);
  font-size: 0.78rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--coral);
  margin-bottom: 22px;
}
.er-tagline {
  font-family: var(--disp);
  font-weight: 600;
  font-size: clamp(1.7rem, 4vw, 2.7rem);
  line-height: 1.2;
  letter-spacing: -0.025em;
  color: #fff;
  margin: 0;
  max-width: 620px;
}
.er-hero-sub {
  font-size: 1.02rem;
  line-height: 1.65;
  color: var(--tx2);
  margin: 18px 0 0;
  max-width: 520px;
}
.er-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-start;
  margin-top: 30px;
}
.er-chips.center { justify-content: center; margin-top: 22px; }
.er-chip {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 14px;
  border: 1px solid var(--line);
  border-radius: 100px;
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--tx);
  background: rgba(255, 255, 255, 0.03);
}
.er-chip.solid { background: #2a2b2e; }
.er-chip :deep(svg) { width: 15px; height: 15px; color: var(--coral); }

.er-cta {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  justify-content: flex-start;
  margin-top: 38px;
}
.er-cta.center { justify-content: center; margin-top: 30px; }
.er-btn {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 13px 22px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s, background 0.2s, border-color 0.2s;
}
.er-btn :deep(svg) { width: 18px; height: 18px; }
.er-btn.primary {
  background: var(--red);
  color: #fff;
  box-shadow: 0 6px 20px rgba(229, 57, 53, 0.3);
}
.er-btn.primary:hover { background: #C62828; transform: translateY(-2px); box-shadow: 0 10px 28px rgba(229, 57, 53, 0.45); }
.er-btn.ghost { border: 1.5px solid var(--line); color: var(--tx); }
.er-btn.ghost:hover { border-color: var(--coral); color: #fff; transform: translateY(-2px); }
.er-btn.lg { padding: 16px 30px; font-size: 1.05rem; }

.er-byline {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  margin-top: 48px;
  text-align: left;
}
.er-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-family: var(--disp);
  font-weight: 700;
  font-size: 0.9rem;
  color: #fff;
  background: linear-gradient(135deg, var(--red), var(--coral));
}
.er-byline strong { display: block; color: #fff; font-size: 0.92rem; }
.er-byline span { font-size: 0.8rem; color: var(--tx2); }

/* SECTIONS */
.er-sec {
  max-width: 1040px;
  margin: 0 auto;
  padding: 60px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}
.er-kicker {
  font-family: var(--mono);
  font-size: 0.74rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--coral);
  margin-bottom: 14px;
}
.er-h2 {
  font-family: var(--disp);
  font-weight: 600;
  font-size: clamp(1.5rem, 3.6vw, 2.3rem);
  letter-spacing: -0.02em;
  color: #fff;
  margin: 0;
  border: 0;
  padding: 0;
}
.er-h2.big { max-width: 640px; line-height: 1.2; }
.er-lead { font-size: 1.02rem; line-height: 1.7; color: var(--tx); max-width: 680px; margin: 16px 0 0; }
.er-sub { color: var(--tx2); margin: 10px 0 0; font-size: 0.98rem; }

.er-grid { display: grid; gap: 16px; margin-top: 30px; }
.er-grid.three { grid-template-columns: repeat(3, 1fr); }
.er-grid.two { grid-template-columns: repeat(2, 1fr); }

.er-card {
  background: #232426;
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 22px;
  transition: transform 0.22s, border-color 0.22s, box-shadow 0.22s;
}
.er-card:hover { transform: translateY(-4px); border-color: var(--coral); box-shadow: 0 14px 34px rgba(229, 57, 53, 0.18); }
.er-card.row { display: flex; gap: 16px; align-items: flex-start; }
.er-card h3 { font-family: var(--disp); font-weight: 600; font-size: 1.05rem; color: #fff; margin: 12px 0 6px; }
.er-card.row h3 { margin-top: 0; }
.er-card p { font-size: 0.9rem; line-height: 1.6; color: var(--tx2); margin: 0; }
.er-card-top { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.er-card.row .er-ico { flex-shrink: 0; }

.er-ico {
  display: inline-grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 11px;
  color: var(--coral);
  background: rgba(229, 57, 53, 0.12);
}
.er-ico.sm { width: 34px; height: 34px; border-radius: 9px; }
.er-ico :deep(svg) { width: 22px; height: 22px; }
.er-ico.sm :deep(svg) { width: 17px; height: 17px; }
.er-num { font-family: var(--mono); font-size: 1.1rem; color: rgba(255, 255, 255, 0.18); font-weight: 600; }

.er-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
.er-tag {
  font-family: var(--mono);
  font-size: 0.78rem;
  padding: 5px 11px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: var(--tx);
}

/* STEP */
.er-card.step { position: relative; }
.er-step-tag { font-family: var(--mono); font-size: 0.72rem; letter-spacing: 0.14em; color: var(--coral); }
.er-step-n {
  position: absolute; top: 18px; right: 22px;
  font-family: var(--disp); font-weight: 700; font-size: 1.6rem;
  color: rgba(229, 57, 53, 0.25);
}

/* STATS */
.er-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 30px; }
.er-stat {
  text-align: center;
  padding: 26px 14px;
  border-radius: 16px;
  background: #232426;
  border: 1px solid var(--line);
}
.er-stat-v { font-family: var(--disp); font-weight: 700; font-size: clamp(1.8rem, 4vw, 2.6rem); color: #fff; letter-spacing: -0.03em; }
.er-stat-v span { color: var(--red); font-size: 0.55em; margin-left: 3px; }
.er-stat-l { font-size: 0.82rem; color: var(--tx2); margin-top: 8px; }
.er-note { font-family: var(--mono); font-size: 0.74rem; color: var(--tx2); margin-top: 16px; text-align: center; }

/* MÓDULO WIKI */
.er-module {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 30px;
  padding: 34px;
  border-radius: 22px;
  background: #232426;
  border: 1px solid var(--line);
}
.er-module .er-kicker { margin-bottom: 10px; }
.er-module-side { display: flex; flex-direction: column; gap: 8px; justify-content: center; }
.er-module-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: var(--tx);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.92rem;
  transition: background 0.2s, border-color 0.2s, transform 0.2s;
}
.er-module-link:hover { background: rgba(229, 57, 53, 0.1); border-color: var(--coral); transform: translateX(3px); color: #fff; }
.er-module-link span:nth-child(2) { flex: 1; }
.er-arrow { color: var(--coral); display: inline-flex; }
.er-arrow :deep(svg) { width: 16px; height: 16px; }

/* CONTATO */
.er-sec.contato { text-align: center; }
.er-sec.contato .er-h2 { margin: 0 auto; }

.er-form {
  max-width: 560px;
  margin: 28px auto 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-align: left;
}
.er-form-row { display: flex; gap: 12px; }
.er-form-row .er-field { flex: 1; }
.er-field {
  width: 100%;
  padding: 13px 16px;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.03);
  color: var(--tx);
  font-family: inherit;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
}
.er-field::placeholder { color: var(--tx2); }
.er-field:focus { border-color: var(--coral); }
textarea.er-field { resize: vertical; min-height: 96px; }
.er-hp { position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0; }
.er-form-err { color: #ff6b6b; font-size: 0.88rem; margin: 2px 0 0; }
.er-form .er-cta { margin-top: 8px; }
.er-form-ok {
  max-width: 520px;
  margin: 28px auto 0;
  display: flex;
  align-items: center;
  gap: 14px;
  justify-content: center;
  padding: 20px 24px;
  border-radius: 16px;
  background: #232426;
  border: 1px solid var(--line);
}
.er-form-ok p { margin: 0; color: #fff; font-weight: 500; }

@media (max-width: 560px) {
  .er-form-row { flex-direction: column; }
}

/* FOOTER */
.er-foot {
  text-align: center;
  padding: 46px 24px 60px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}
.er-foot .er-wordmark { margin-bottom: 14px; }
.er-foot p { color: var(--tx2); font-size: 0.85rem; margin: 0; }
.er-foot-links { display: flex; gap: 20px; justify-content: center; margin-top: 16px; }
.er-foot-links a { color: var(--tx); text-decoration: none; font-size: 0.85rem; font-weight: 500; }
.er-foot-links a:hover { color: var(--coral); }

/* RESPONSIVO */
.hide-sm { display: none; }
@media (min-width: 700px) { .hide-sm { display: inline; } }
@media (max-width: 860px) {
  .er-grid.three, .er-grid.two { grid-template-columns: 1fr 1fr; }
  .er-stats { grid-template-columns: 1fr 1fr; }
  .er-module { grid-template-columns: 1fr; padding: 26px; }

  .er-hero { grid-template-columns: 1fr; text-align: center; padding-top: clamp(48px, 8vh, 80px); }
  .er-hero-text { text-align: center; }
  .er-hero-text .er-tagline, .er-hero-text .er-hero-sub { margin-left: auto; margin-right: auto; }
  .er-hero .er-chips, .er-hero .er-cta { justify-content: center; }
  .er-byline { justify-content: center; }
  .er-hero-visual { order: -1; }
  .er-hero-visual img { max-width: 300px; }

  .er-identidade { grid-template-columns: 1fr; text-align: center; }
  .er-identidade .er-chips { justify-content: center; }
  .er-portrait { order: -1; }
  .er-portrait img { max-width: 240px; }
}
@media (max-width: 560px) {
  .er-grid.three, .er-grid.two { grid-template-columns: 1fr; }
  .er-card.row { flex-direction: row; }
}
</style>
