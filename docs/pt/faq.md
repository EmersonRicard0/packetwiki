---
title: Perguntas Frequentes
description: Dúvidas comuns sobre os serviços da ERtech — monitoramento, automação, redes e ISP.
---

# Perguntas Frequentes

Dúvidas comuns sobre como trabalho e o que a ERtech entrega. Não achou o que procurava? [Fale comigo](mailto:silvaemerson797@gmail.com?subject=D%C3%BAvida%20ERtech).

## Sobre os serviços

::: details Com quais fabricantes e tecnologias você trabalha?
Multivendor, sem lock-in: Huawei (NE/S-Series, OLT MA5800), MikroTik (RouterOS/CCR), Datacom (DmOS, OLT), Cisco, Juniper e ZTE. No stack de monitoramento e automação: Zabbix, Grafana, Prometheus, QRadar, n8n, Redis. Infra: Proxmox, Docker e Kubernetes.
:::

::: details Vocês atendem provedores de internet (ISP)?
Sim. Boa parte do trabalho é voltada a ISPs: provisionamento GPON, BNG/PPPoE, BGP/OSPF, MPLS/VPLS, RADIUS e monitoramento ponta a ponta da rede.
:::

::: details Como é feito o monitoramento?
Coleta (Zabbix, SNMP, Prometheus), correlação (n8n, Redis, QRadar) e visualização/ação (Grafana, relatórios, alertas) — tudo numa malha só, com dashboards sob medida e alertas que chegam antes do impacto.
:::

## Contratação e processo

::: details Quais são os modelos de contratação?
Três formatos: **projeto pontual** (escopo fechado), **sustentação mensal** (operação e evolução contínua) e **consultoria por hora** (revisão de arquitetura e mentoria). Veja detalhes em [Serviços & Planos](/pt/solucoes).
:::

::: details Como começa um projeto?
Todo projeto nasce de uma spec (metodologia GSD): diagnóstico → spec e plano → execução rastreável → operação. Nada de escrever configuração antes de definir o problema e os critérios de sucesso.
:::

::: details Vocês trabalham de forma remota?
Sim, a operação é majoritariamente remota, com acesso seguro à infraestrutura. Atividades que exigem presença são combinadas caso a caso.
:::

## Sobre a wiki e as ferramentas

::: details A PacketWiki é gratuita?
Sim. A [PacketWiki](/pt/) é uma base de conhecimento aberta, com comandos testados e guias práticos. É colaborativa — você pode [contribuir](/pt/contribuir).
:::

::: details As ferramentas de rede são gratuitas?
Sim. As [Ferramentas de Rede](/pt/ferramentas/) (calculadora de sub-rede, VLSM, DNS, ASN, GPON e outras) são livres e rodam direto no navegador ou via função serverless.
:::

::: details O assistente PacketBot usa meus dados?
O PacketBot responde dúvidas técnicas sobre a wiki. A conversa fica no seu navegador (histórico local) e a chamada à IA passa por um proxy no servidor — a chave da API nunca é exposta ao cliente.
:::
