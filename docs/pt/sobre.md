---
description: Sobre Emerson Silva Ricardo — dev e analista de redes, criador do PacketWiki.
layout: page
---

<style>
.sobre-wrapper {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}
.perfil {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  border: 1px solid var(--vp-c-border);
  margin-bottom: 2rem;
}
.perfil-avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  border: 3px solid var(--vp-c-brand-1);
}
.perfil-info h1 {
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0 0 0.25rem;
  border: none;
  padding: 0;
}
.perfil-cargo {
  color: var(--vp-c-brand-1);
  font-weight: 500;
  font-size: 1rem;
  margin-bottom: 0.75rem;
}
.perfil-bio {
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0 0 1rem;
}
.perfil-links {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}
.perfil-links a {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.9rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  border: 1px solid var(--vp-c-border);
  color: var(--vp-c-text-1);
  transition: border-color 0.2s, color 0.2s;
}
.perfil-links a:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 2rem 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--vp-c-divider);
}
.certs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0.75rem;
}
.cert-card {
  padding: 1rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  transition: border-color 0.2s;
}
.cert-card:hover {
  border-color: var(--vp-c-brand-1);
}
.cert-nome {
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.2rem;
}
.cert-emissor {
  color: var(--vp-c-brand-1);
  font-size: 0.8rem;
  font-weight: 500;
}
.cert-data {
  color: var(--vp-c-text-3);
  font-size: 0.78rem;
  margin-top: 0.2rem;
}
.skills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}
.skill-tag {
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-size: 0.82rem;
  font-weight: 500;
}
@media (max-width: 600px) {
  .perfil { flex-direction: column; text-align: center; }
  .perfil-links { justify-content: center; }
}
</style>

<div class="sobre-wrapper">

<div class="perfil">
  <img class="perfil-avatar" src="/emerson.jpg" alt="Emerson Silva Ricardo" />
  <div class="perfil-info">
    <h1>Emerson Silva Ricardo</h1>
    <div class="perfil-cargo">Dev · Analista de Redes</div>
    <p class="perfil-bio">
      Profissional com experiência em infraestrutura de redes, especializado em ISPs, GPON e automação de sistemas. Apaixonado por tecnologia e compartilhamento de conhecimento — criador do PacketWiki, uma iniciativa open source para documentar configurações reais de equipamentos de rede para a comunidade brasileira.
    </p>
    <div class="perfil-links">
      <a href="https://www.linkedin.com/in/emerson-silva-ricardo-543308119/" target="_blank" rel="noopener">
        🔗 LinkedIn
      </a>
      <a href="https://github.com/EmersonRicard0/packetwiki" target="_blank" rel="noopener">
        🐙 GitHub
      </a>
      <a href="/pt/contribuir">
        🤝 Contribuir com o Wiki
      </a>
    </div>
  </div>
</div>

<div class="section-title">🎓 Certificações</div>

<div class="certs-grid">
  <div class="cert-card">
    <div class="cert-nome">CCIE™ Roteamento e Comutação</div>
    <div class="cert-emissor">Estácio</div>
    <div class="cert-data">jan 2024</div>
  </div>
  <div class="cert-card">
    <div class="cert-nome">Ethical Hacker</div>
    <div class="cert-emissor">Cisco</div>
    <div class="cert-data">jul 2024</div>
  </div>
  <div class="cert-card">
    <div class="cert-nome">Linux Unhatched</div>
    <div class="cert-emissor">Cisco</div>
    <div class="cert-data">mar 2025</div>
  </div>
  <div class="cert-card">
    <div class="cert-nome">Segurança em Linux</div>
    <div class="cert-emissor">IBSEC</div>
    <div class="cert-data">mar 2025</div>
  </div>
  <div class="cert-card">
    <div class="cert-nome">Redes GPON</div>
    <div class="cert-emissor">Datacom</div>
    <div class="cert-data">fev 2022</div>
  </div>
  <div class="cert-card">
    <div class="cert-nome">Switches DmOS — Layer 2</div>
    <div class="cert-emissor">Datacom</div>
    <div class="cert-data"></div>
  </div>
  <div class="cert-card">
    <div class="cert-nome">Switches DmOS — Layer 3</div>
    <div class="cert-emissor">Datacom</div>
    <div class="cert-data"></div>
  </div>
  <div class="cert-card">
    <div class="cert-nome">Jornada MikroTik</div>
    <div class="cert-emissor">Redes Brasil</div>
    <div class="cert-data"></div>
  </div>
  <div class="cert-card">
    <div class="cert-nome">Wifi Premium</div>
    <div class="cert-emissor">Fiberschool</div>
    <div class="cert-data">jul 2020</div>
  </div>
  <div class="cert-card">
    <div class="cert-nome">Inglês para TI</div>
    <div class="cert-emissor">Qualifica</div>
    <div class="cert-data">mar 2022</div>
  </div>
</div>

<div class="section-title">🛠️ Competências</div>

<div class="skills-grid">
  <span class="skill-tag">Roteadores Huawei</span>
  <span class="skill-tag">MikroTik RouterOS</span>
  <span class="skill-tag">OLT / GPON</span>
  <span class="skill-tag">Switches Datacom</span>
  <span class="skill-tag">BGP / OSPF</span>
  <span class="skill-tag">MPLS / L2VPN</span>
  <span class="skill-tag">PPPoE / BNG</span>
  <span class="skill-tag">Linux</span>
  <span class="skill-tag">Firewall iptables</span>
  <span class="skill-tag">WireGuard VPN</span>
  <span class="skill-tag">Zabbix / Grafana</span>
  <span class="skill-tag">Docker</span>
  <span class="skill-tag">Python</span>
  <span class="skill-tag">Segurança Ofensiva</span>
</div>

</div>
