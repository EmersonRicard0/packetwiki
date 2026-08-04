---
title: Calculadora de Macros — Zabbix
description: Simula a resolução de macros e funções em expressões de trigger do Zabbix e mostra se a trigger dispararia.
---

# Calculadora de Macros

Monte uma expressão de trigger com macros (ex.: `last(/Host/key) > {$THRESHOLD}`), defina os valores das macros e o valor simulado do item, e veja a **expressão resolvida** e se ela **dispararia**.

<ClientOnly>
  <ZabbixMacroCalc />
</ClientOnly>
