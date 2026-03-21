---
description: Histórico de atualizações do conteúdo do PacketWiki — novas páginas, melhorias e correções organizadas por mês.
---

# Changelog do Wiki

Registro de todas as adições e melhorias de conteúdo do PacketWiki, organizado cronologicamente.

::: info Sobre este changelog
Este changelog registra mudanças de **conteúdo** (páginas, seções, exemplos). Para alterações no código e infraestrutura do wiki, consulte o repositório no GitHub.
:::

---

## Março 2025

### ✨ Adicionado

- **Switches Huawei** — Cobertura completa com 9 páginas:
  - Configuração inicial, gerência SSH, VLANs e trunks
  - MPLS e L2VPN (VPLS/pseudowire)
  - Agregação de links (Eth-Trunk / LACP)
  - QoS e controle de banda
  - SNMP, Syslog, NTP e backup/restore
  - Troubleshooting de switching

- **OLT Datacom DM4610** — Série completa de provisionamento GPON:
  - Configuração inicial e interfaces uplink
  - Perfis de linha e serviço
  - Provisionamento de ONUs
  - Serviços: internet, VoIP, IPTV
  - MPLS/VPLS na OLT Datacom

- **MikroTik RouterOS** — Páginas de roteamento:
  - BGP com exemplos para ISP (eBGP, iBGP, route reflector)
  - OSPF multi-área com redistribuição
  - CCR — configuração e tuning de hardware offload

- **Linux — Firewall**:
  - iptables completo (NAT, FORWARD, mangle para QoS)
  - nftables — migração do iptables e exemplos para BNG

- **Monitoramento** (Linux e Serviços):
  - Zabbix 6.4 — instalação, templates e triggers para redes
  - Grafana — dashboards de tráfego SNMP e BGP
  - Zabbix em Docker Compose (stack completa)
  - Grafana em Docker Compose com Prometheus

- **FreeRADIUS** — Autenticação PPPoE para ISP:
  - Configuração de clients, users e SQL backend
  - Integração com BNG Huawei

- **Infraestrutura do wiki**:
  - 💬 Comentários com Giscus (GitHub Discussions integrado)
  - 🤖 Assistente de IA PacketBot (chat contextual sobre redes)
  - Busca local otimizada com VitePress Search

### 🔧 Melhorado

- Página inicial (`/pt/`) redesenhada com cards de navegação e destaque de conteúdo novo
- Sidebar reorganizada com agrupamento por fabricante e função
- Todos os snippets de código revisados para compatibilidade com VRP V800R021 e RouterOS 7.x

---

## Fevereiro 2025

### ✨ Adicionado

- **Estrutura inicial do PacketWiki**:
  - Configuração do VitePress com tema customizado PacketWiki
  - Suporte a idioma português (Brasil) como padrão
  - Sidebar dinâmica e navegação por fabricante

- **Roteadores Huawei** — primeiras páginas de conteúdo:
  - Configuração inicial (hostname, usuários, interfaces)
  - BGP para ISP (eBGP com trânsito e peering, iBGP com route reflector)
  - OSPF como IGP de backbone
  - SNMP v2c e v3
  - Backup e restauração via FTP/SFTP
  - Troubleshooting de roteamento

- **OLT Huawei MA5800**:
  - Configuração inicial (board, uplink, gerência)
  - Provisionamento de ONUs (autofind, OMCI)
  - Perfis DBA, line profile e service profile
  - Interfaces e VLANs na OLT
  - Troubleshooting de sinal óptico e ONUs offline

- **Glossário** — primeiros termos (protocolos de roteamento, GPON, ISP)

- **Página de contribuição** — guia para enviar correções e novas páginas via pull request

### 🔧 Melhorado

- Definição do `themeConfig` com logo, social links (GitHub) e footer
- Configuração de canonical URL e Open Graph para SEO
