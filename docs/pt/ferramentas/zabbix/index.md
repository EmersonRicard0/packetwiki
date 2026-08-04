---
title: Ferramentas Zabbix
description: Suíte de utilitários para administradores Zabbix — conversor de templates, testador de regex, calculadora de macros e migrador entre ambientes.
---

# Ferramentas Zabbix

Suíte de utilitários para quem administra Zabbix — tudo roda no seu navegador, sem enviar nada para servidor.

<div class="ztool-cards">
  <a class="ztool-card" href="/pt/ferramentas/zabbix/conversor">
    <span class="ico"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 17V7a2 2 0 0 1 2-2h8"/><path d="m14 3 4 4-4 4"/><path d="M20 7v10a2 2 0 0 1-2 2h-8"/><path d="m10 21-4-4 4-4"/></svg></span>
    <h3>Conversor de Templates</h3>
    <p>Migra templates entre versões (5.4 → 6.0 → 7.0): sintaxe de trigger, UUIDs e versão do export. XML/JSON/YAML.</p>
  </a>
  <a class="ztool-card" href="/pt/ferramentas/zabbix/validador-regex">
    <span class="ico"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg></span>
    <h3>Validador de Regex</h3>
    <p>Testa expressões regulares de triggers e itens, com destaque visual dos matches e grupos capturados.</p>
  </a>
  <a class="ztool-card" href="/pt/ferramentas/zabbix/calculadora-macros">
    <span class="ico"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 7h8M8 12h8M8 17h5"/></svg></span>
    <h3>Calculadora de Macros</h3>
    <p>Simula a resolução de macros e funções numa expressão de trigger e mostra se ela dispararia.</p>
  </a>
  <a class="ztool-card" href="/pt/ferramentas/zabbix/migrador">
    <span class="ico"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 9V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-4"/><path d="M2 12h13"/><path d="m9 8 4 4-4 4"/></svg></span>
    <h3>Migrador entre Ambientes</h3>
    <p>Adapta um template de um ambiente para outro (PROD → HML) trocando hosts, grupos, macros e IPs.</p>
  </a>
  <a class="ztool-card" href="/pt/ferramentas/zabbix/assistente-ia">
    <span class="ico"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a3 3 0 0 0-3 3v1a3 3 0 0 0-3 3 3 3 0 0 0 0 6 3 3 0 0 0 3 3v1a3 3 0 0 0 6 0v-1a3 3 0 0 0 3-3 3 3 0 0 0 0-6 3 3 0 0 0-3-3V6a3 3 0 0 0-3-3z"/></svg></span>
    <h3>Assistente com IA</h3>
    <p>Descreva o que quer monitorar em linguagem natural e receba um template Zabbix pronto.</p>
  </a>
  <a class="ztool-card" href="/pt/ferramentas/zabbix/explicador">
    <span class="ico"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg></span>
    <h3>Explicador com IA</h3>
    <p>Envie um template e receba a explicação de cada item, trigger e macro — com perguntas adicionais.</p>
  </a>
  <a class="ztool-card" href="/pt/ferramentas/zabbix/plugins">
    <span class="ico"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3v6M6 21v-6"/><rect x="3" y="9" width="6" height="6" rx="1"/><path d="M18 3v4a4 4 0 0 1-4 4h-2"/><rect x="15" y="15" width="6" height="6" rx="1"/></svg></span>
    <h3>Plugins do Conversor</h3>
    <p>Instale regras de conversão da comunidade (JSON) que estendem o conversor de templates.</p>
  </a>
  <a class="ztool-card" href="/pt/ferramentas/zabbix/exportador-iac">
    <span class="ico"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg></span>
    <h3>Exportador Terraform/Ansible</h3>
    <p>Gera código Terraform (provider zabbix) ou Ansible (community.zabbix) a partir do template.</p>
  </a>
</div>

::: tip Client-side
Todas as ferramentas processam os arquivos localmente no navegador. Nenhum template é enviado a servidores.
:::
