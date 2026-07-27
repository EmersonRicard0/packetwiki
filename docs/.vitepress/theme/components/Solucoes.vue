<template>
  <div class="sol">
    <!-- Frentes de atuação -->
    <div class="sol-grid three">
      <article v-for="f in frentes" :key="f.t" class="sol-card">
        <span class="sol-ico" v-html="f.icon"></span>
        <h3>{{ f.t }}</h3>
        <p>{{ f.d }}</p>
        <ul>
          <li v-for="i in f.items" :key="i">{{ i }}</li>
        </ul>
      </article>
    </div>

    <!-- Modelos de contratação -->
    <h2 class="sol-h2">Modelos de contratação</h2>
    <p class="sol-sub">Escolha o formato que faz sentido para a sua operação.</p>
    <div class="sol-grid three">
      <article v-for="p in planos" :key="p.t" class="sol-plan" :class="{ featured: p.featured }">
        <div v-if="p.featured" class="sol-badge">Mais procurado</div>
        <h3>{{ p.t }}</h3>
        <div class="sol-price">{{ p.price }}<span>{{ p.unit }}</span></div>
        <p class="sol-plan-desc">{{ p.d }}</p>
        <ul>
          <li v-for="i in p.items" :key="i"><span class="sol-check" v-html="checkIcon"></span>{{ i }}</li>
        </ul>
        <a class="sol-btn" :href="mail">{{ p.cta }}</a>
      </article>
    </div>

    <!-- Como funciona -->
    <h2 class="sol-h2">Como funciona</h2>
    <div class="sol-steps">
      <div v-for="(s, i) in passos" :key="s.t" class="sol-step">
        <span class="sol-step-n">{{ i + 1 }}</span>
        <div>
          <strong>{{ s.t }}</strong>
          <p>{{ s.d }}</p>
        </div>
      </div>
    </div>

    <div class="sol-cta">
      <h2 class="sol-h2" style="margin:0">Vamos colocar sua operação sob controle.</h2>
      <a class="sol-btn primary" :href="mail">Solicitar orçamento</a>
    </div>
  </div>
</template>

<script setup>
const mail = 'mailto:silvaemerson797@gmail.com?subject=Or%C3%A7amento%20ERtech'
const svg = (p) => `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`
const checkIcon = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`

const frentes = [
  { t: 'Monitoramento & Observabilidade', d: 'Visibilidade total da sua infraestrutura, do backbone ao endpoint.', items: ['Zabbix, Grafana e Prometheus', 'Templates e dashboards sob medida', 'SNMP, fluxo e logs correlacionados'], icon: svg('<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/><path d="M6 12l3-3 2 2 4-4"/>') },
  { t: 'Automação & Integração', d: 'Menos esforço manual, mais resposta antes do impacto.', items: ['Fluxos com n8n e webhooks', 'Triagem e alertas inteligentes', 'Relatórios automáticos para gestão'], icon: svg('<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>') },
  { t: 'Redes, ISP & Projetos', d: 'Arquitetura e operação multivendor, sem lock-in.', items: ['Huawei, MikroTik, Datacom, ZTE', 'BGP, OSPF, MPLS, GPON, BNG', 'Proxmox, Docker e Kubernetes'], icon: svg('<circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="5" r="2.5"/><path d="M8.5 19H14a4 4 0 0 0 0-8H10a4 4 0 0 1 0-8h5.5"/>') },
]

const planos = [
  { t: 'Projeto pontual', price: 'Sob consulta', unit: '', d: 'Escopo fechado: implantação, migração ou automação específica.', items: ['Levantamento e spec', 'Implementação e testes', 'Documentação e handover'], cta: 'Solicitar orçamento' },
  { t: 'Sustentação mensal', price: 'Mensal', unit: '', d: 'Operação e evolução contínua do seu ambiente de monitoramento.', items: ['NOC e acompanhamento', 'Ajustes e novos dashboards', 'Relatórios e melhorias contínuas'], cta: 'Falar sobre sustentação', featured: true },
  { t: 'Consultoria', price: 'Por hora', unit: '', d: 'Apoio técnico avulso, revisão de arquitetura e mentoria.', items: ['Revisão de topologia', 'Boas práticas e tuning', 'Mentoria do time'], cta: 'Agendar consultoria' },
]

const passos = [
  { t: 'Diagnóstico', d: 'Entendo a operação, os pontos cegos e os objetivos.' },
  { t: 'Spec & Plano', d: 'Escopo, arquitetura e critérios de sucesso documentados (GSD).' },
  { t: 'Execução', d: 'Implementação rastreável, com estado vivo a cada iteração.' },
  { t: 'Operação', d: 'Monitoramento sob controle, com evolução contínua.' },
]
</script>

<style scoped>
.sol { margin: 8px 0; }
.sol-grid { display: grid; gap: 16px; margin: 20px 0 8px; }
.sol-grid.three { grid-template-columns: repeat(3, 1fr); }

.sol-card, .sol-plan {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  padding: 22px;
}
.sol-ico {
  display: inline-grid; place-items: center;
  width: 46px; height: 46px; border-radius: 11px;
  color: var(--vp-c-brand-1); background: var(--vp-c-brand-soft);
  margin-bottom: 12px;
}
.sol-card h3, .sol-plan h3 { font-size: 1.1rem; margin: 0 0 8px; font-weight: 700; }
.sol-card p { color: var(--vp-c-text-2); font-size: 0.92rem; margin: 0 0 12px; line-height: 1.55; }
.sol-card ul, .sol-plan ul { list-style: none; padding: 0; margin: 0; }
.sol-card li { font-size: 0.88rem; padding: 4px 0 4px 18px; position: relative; color: var(--vp-c-text-1); }
.sol-card li::before { content: '—'; position: absolute; left: 0; color: var(--vp-c-brand-1); }

.sol-h2 { font-size: 1.6rem; margin: 44px 0 4px; border: 0; padding: 0; }
.sol-sub { color: var(--vp-c-text-2); margin: 0 0 8px; }

/* Planos */
.sol-plan { position: relative; display: flex; flex-direction: column; }
.sol-plan.featured { border-color: var(--vp-c-brand-1); box-shadow: 0 8px 30px rgba(229, 57, 53, 0.12); }
.sol-badge {
  position: absolute; top: -11px; left: 22px;
  background: var(--vp-c-brand-1); color: #fff;
  font-size: 0.72rem; font-weight: 700; padding: 3px 10px; border-radius: 8px;
}
.sol-price { font-size: 1.5rem; font-weight: 800; color: var(--vp-c-brand-1); margin: 4px 0 8px; }
.sol-price span { font-size: 0.8rem; color: var(--vp-c-text-2); font-weight: 500; margin-left: 4px; }
.sol-plan-desc { color: var(--vp-c-text-2); font-size: 0.9rem; margin: 0 0 14px; line-height: 1.55; }
.sol-plan ul { flex: 1; margin-bottom: 16px; }
.sol-plan li { display: flex; align-items: flex-start; gap: 8px; font-size: 0.88rem; padding: 5px 0; }
.sol-check { color: var(--vp-c-brand-1); flex-shrink: 0; margin-top: 1px; }

.sol-btn {
  display: block; text-align: center;
  padding: 10px 16px; border-radius: 10px;
  border: 1.5px solid var(--vp-c-brand-1); color: var(--vp-c-brand-1) !important;
  font-weight: 600; font-size: 0.9rem; text-decoration: none;
  transition: background 0.2s, color 0.2s;
}
.sol-btn:hover { background: var(--vp-c-brand-1); color: #fff !important; }
.sol-plan.featured .sol-btn, .sol-btn.primary { background: var(--vp-c-brand-1); color: #fff !important; border-color: var(--vp-c-brand-1); }
.sol-plan.featured .sol-btn:hover, .sol-btn.primary:hover { opacity: 0.9; }

/* Passos */
.sol-steps { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin: 20px 0; }
.sol-step { display: flex; gap: 14px; align-items: flex-start; }
.sol-step-n {
  flex-shrink: 0; width: 34px; height: 34px; border-radius: 50%;
  background: var(--vp-c-brand-soft); color: var(--vp-c-brand-1);
  display: grid; place-items: center; font-weight: 700;
}
.sol-step strong { display: block; margin-bottom: 2px; }
.sol-step p { margin: 0; color: var(--vp-c-text-2); font-size: 0.9rem; line-height: 1.5; }

.sol-cta {
  margin-top: 44px; padding: 32px; border-radius: 16px; text-align: center;
  background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider);
}
.sol-cta .sol-btn.primary { display: inline-block; margin-top: 16px; padding: 13px 28px; font-size: 1rem; }

@media (max-width: 780px) {
  .sol-grid.three { grid-template-columns: 1fr; }
  .sol-steps { grid-template-columns: 1fr; }
}
</style>
