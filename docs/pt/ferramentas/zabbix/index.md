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
</div>

::: tip Client-side
Todas as ferramentas processam os arquivos localmente no navegador. Nenhum template é enviado a servidores.
:::
