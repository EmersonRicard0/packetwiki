---
description: Troubleshooting completo de OLT Huawei — diagnóstico de sinal óptico, ONUs offline, falha de autenticação, serviços e porta PON.
---

# Troubleshooting — OLT Huawei

::: tip Versão testada
VRP **V300R019** / **V800R021** (MA5800-X2 · MA5800-X7 · MA5600T). Compatível com V300R019+.
:::

Guia completo de diagnóstico para as situações mais comuns em campo: ONU sem luz, sinal fraco, falha de autenticação, sem tráfego e problemas de porta PON.

---

## Diagnóstico Rápido de ONU

### Ver estado de todas as ONUs de uma porta

```bash
# Estado operacional de todas as ONUs da porta GPON 0/1
<MA5800> display ont info 0/1 all

# Filtrar só as que estão offline
<MA5800> display ont info 0/1 all | include offline

# Ver detalhes de uma ONU específica (porta 0/1, ont-id 5)
<MA5800> display ont info 0/1 5
```

Tabela de estados possíveis:

| Estado | Significado |
|--------|-------------|
| `online` | ONU operando normalmente |
| `offline` | ONU sem comunicação com a OLT |
| `dying-gasp` | ONU perdeu energia e enviou aviso antes de cair |
| `power-off` | ONU desligada intencionalmente |
| `mis-config` | Incompatibilidade de configuração OMCI |

### ONU aparece mas não autentica

```bash
# Ver ONUs detectadas mas não cadastradas na porta 0/1
<MA5800> display ont autofind 0/1

# Ver ONUs não autorizadas em todas as portas
<MA5800> display ont autofind all

# Verificar se o serial number já está cadastrado em outra porta
<MA5800> display ont info by-sn HWTC1A2B3C4D
```

::: warning Autenticação por SN vs LOID
A OLT Huawei suporta autenticação por Serial Number (sn-auth), LOID (loid-auth) ou ambos. Se a ONU aparecer no autofind mas não autenticar, verifique se o método configurado no `ont add` corresponde ao que a ONU está apresentando.
:::

---

## Diagnóstico de Sinal Óptico

### Verificar potência óptica da ONU (RX/TX)

```bash
# Potência óptica de uma ONU específica (porta 0/1, ont-id 5)
<MA5800> display ont optical-info 0/1 5

# Sinal de todas as ONUs de uma porta de uma vez
<MA5800> display ont optical-info 0/1 all

# Ver potência de TX da porta PON da OLT
<MA5800> display interface gpon 0/1
```

Saída típica do `display ont optical-info`:

```
  -----------------------------------------------------------------------
  F/S/P         : 0/1/0
  ONT ID        : 5
  Rx optical power(dBm)   : -22.50   <- sinal recebido pela OLT (upstream)
  Tx optical power(dBm)   :   2.10   <- sinal enviado pela OLT (downstream)
  ONU Rx power(dBm)       : -21.80   <- sinal recebido pela ONU (downstream)
  ONU Tx power(dBm)       :   2.30   <- sinal enviado pela ONU (upstream)
  -----------------------------------------------------------------------
```

### Faixas de sinal aceitáveis (GPON)

| Parâmetro | Ótimo | Normal | Atenção | Crítico |
|-----------|-------|--------|---------|---------|
| ONU RX (downstream) | -8 a -20 dBm | -20 a -27 dBm | -27 a -28 dBm | < -28 dBm |
| OLT RX (upstream) | -8 a -20 dBm | -20 a -27 dBm | -27 a -28 dBm | < -28 dBm |
| TX da OLT (porta PON) | +1 a +5 dBm | — | < 0 dBm | < -3 dBm |

::: info Orçamento óptico GPON Classe B+
O orçamento máximo é **28 dB** entre a OLT e a ONU (soma de todas as perdas: fibra, splitters, conectores, emendas). Se a diferença entre o TX da OLT e o RX da ONU superar esse valor, a ONU ficará offline.
:::

---

## Causas e Diagnóstico de Sinal Fraco

### Passo a passo de diagnóstico de sinal

**1. Confirmar o sinal atual**

```bash
<MA5800> display ont optical-info 0/1 5
```

Anote os valores de `Rx optical power` (OLT) e `ONU Rx power`.

**2. Verificar histórico de quedas**

```bash
# Ver registro de eventos (deregister) da ONU
<MA5800> display ont register-info 0/1 5
```

**3. Comparar com outras ONUs da mesma porta**

```bash
# Se várias ONUs da mesma porta estão com sinal fraco, o problema é na fibra backbone
<MA5800> display ont optical-info 0/1 all | include dBm
```

**4. Verificar erros na porta PON**

```bash
# Erros acumulados da porta (BER, FEC corrections, lost-of-signal)
<MA5800> display interface gpon 0/1 statistics

# Resetar contadores e monitorar por 5 minutos
<MA5800> reset counters interface gpon 0/1
```

**5. Testar com OTDR ou medidor de potência óptica**

Para isolar o trecho com problema, use um power meter no lado da OLT e meça o sinal em cada ponto:
- Saída da porta PON da OLT
- Após o splitter de 1º nível
- Após o splitter de 2º nível (se houver)
- Na entrada da ONU

### Causas mais comuns de sinal fraco ou perda total

| Causa | Sintoma | Verificação |
|-------|---------|-------------|
| Conector sujo ou oxidado | Sinal entre -27 e -30 dBm | Limpar com álcool isopropílico 99% + cotonete |
| Emenda óptica de baixa qualidade | Sinal consistentemente baixo | Reflectometria OTDR |
| Raio de curvatura excessivo | Sinal degradado em local específico | Inspecionar trajeto da fibra |
| Splitter com perda alta | Múltiplas ONUs com sinal fraco | Medir com OTDR antes e depois do splitter |
| Fibra rompida ou dobrada | Sinal ausente ou < -30 dBm | OTDR para localizar o ponto |
| Conector físico inadequado | Sinal intermitente | Substituir conector (re-polir ou trocar) |
| Extensão além do orçamento | Sinal negativo progressivo | Calcular orçamento óptico total |

---

## ONU Offline — Diagnóstico

### Verificar causa da queda

```bash
# Ver log de eventos da ONU (registros e desconexões)
<MA5800> display ont register-info 0/1 5
```

Causas de `deregister` mais comuns:

| Causa | Significado | Ação |
|-------|-------------|------|
| `dying-gasp` | ONU perdeu alimentação elétrica | Verificar fonte/energia no cliente |
| `loss-of-signal` | Perda de sinal óptico | Diagnóstico de fibra |
| `losi` | Loss of Signal Indication | Idem ao loss-of-signal |
| `deactivate` | ONU desativada pelo operador | Verificar se foi intencional |
| `ranging-abort` | Falha no processo de ranging | Verificar fibra e splitter |
| `lofi` | Loss of Frame Indication | Verificar qualidade da fibra |
| `mis-config` | Incompatibilidade OMCI | Verificar perfis configurados |

### Resetar ONU remotamente

```bash
# Resetar uma ONU específica (força reboot remoto)
<MA5800> ont reset 0/1 5

# Aguardar ~60 segundos e verificar se voltou online
<MA5800> display ont info 0/1 5
```

### Desautorizar e reautorizar ONU

```bash
# Remover e recadastrar (útil quando a ONU troca ou há inconsistência)
[MA5800] interface gpon 0/1
[MA5800-gpon0/1] ont delete 5
[MA5800-gpon0/1] ont add 5 sn-auth HWTC1A2B3C4D omci ont-lineprofile-id 10 ont-srvprofile-id 10 desc "CLIENTE-REATIVADO"
[MA5800-gpon0/1] quit

# Verificar se a ONU voltou a registrar
<MA5800> display ont info 0/1 5
```

### Verificar se a ONU existe no banco de dados

```bash
# Buscar ONU pelo serial number em toda a OLT
<MA5800> display ont info by-sn HWTC1A2B3C4D

# Listar todas as ONUs cadastradas em uma porta
<MA5800> display ont info 0/1 all
```

---

## Diagnóstico de Serviço (ONU online, sem internet)

### ONU online mas sem tráfego

```bash
# Verificar se o service-port está ativo para a ONU
<MA5800> display service-port port 0/1 ont 5

# Ver configuração detalhada de um service-port específico
<MA5800> display service-port 100

# Listar todos os service-ports da porta PON 0/1
<MA5800> display service-port all | include gpon0/1
```

### Verificar GEM ports

```bash
# Ver GEM ports configuradas para a ONU
<MA5800> display ont gemport 0/1 5

# Ver estatísticas de tráfego por GEM port (deve mostrar contadores subindo)
<MA5800> display ont gemport statistics 0/1 5
```

::: tip GEM ports zeradas
Se os contadores de GEM port estiverem zerados mesmo com a ONU online, verifique o line profile e se o GEM port está corretamente mapeado no serviço.
:::

### Verificar perfis aplicados

```bash
# Ver line profile e service profile da ONU
<MA5800> display ont info 0/1 5 | include profile

# Ver detalhes completos do line profile
<MA5800> display ont-lineprofile gpon profile-id 10

# Ver detalhes completos do service profile
<MA5800> display ont-srvprofile gpon profile-id 10
```

### Verificar VLAN no serviço

```bash
# Ver VLAN do service-port
<MA5800> display service-port 100

# Ver VLANs configuradas na interface de uplink
<MA5800> display interface vlanif 100

# Verificar se a VLAN existe e está ativa
<MA5800> display vlan 100
```

---

## Diagnóstico de Porta PON

### Porta PON com muitas ONUs offline

```bash
# Ver status geral da porta PON
<MA5800> display interface gpon 0/1

# Ver estatísticas de erros da porta (BER, FEC, alarm counts)
<MA5800> display interface gpon 0/1 statistics

# Listar quantidade de ONUs online/offline na porta
<MA5800> display ont info 0/1 all | include online
<MA5800> display ont info 0/1 all | include offline

# Resetar contadores para monitoramento limpo
<MA5800> reset counters interface gpon 0/1
```

Se muitas ONUs de uma mesma porta estiverem offline simultaneamente, o problema geralmente está no trecho compartilhado: fibra backbone até o splitter, o próprio splitter, ou a porta PON da OLT.

### Porta PON inativa ou com alarme

```bash
# Ver se há alarmes ativos no equipamento
<MA5800> display alarm active all

# Ver configuração atual da porta PON
[MA5800] interface gpon 0/1
[MA5800-gpon0/1] display this

# Habilitar porta PON caso esteja desabilitada
[MA5800-gpon0/1] undo shutdown
[MA5800-gpon0/1] quit
```

### Verificar saúde geral de todas as portas PON da placa

```bash
# Ver status de todas as portas de uma placa (slot 0)
<MA5800> display port state 0/0
<MA5800> display port state 0/1

# Ver potência de TX de todas as portas PON de uma placa
<MA5800> display port state 0 optical
```

---

## Diagnóstico de Autenticação (OMCI / RADIUS)

### Falha de OMCI

```bash
# Ver estado OMCI da ONU
<MA5800> display ont info 0/1 5 | include omci

# Ver alarmes OMCI da ONU
<MA5800> display ont alarm 0/1 5

# Ver versão de software da ONU (via OMCI)
<MA5800> display ont version 0/1 5

# Ver capacidades da ONU (interfaces, portas, etc.)
<MA5800> display ont capability 0/1 5
```

### Verificar compatibilidade de perfis

```bash
# Checar se o service profile é compatível com o hardware da ONU
<MA5800> display ont-srvprofile gpon profile-id 10

# Ver ONUs com erro de OMCI
<MA5800> display ont info 0/1 all | include config-failed
```

---

## Comandos de Diagnóstico — Referência Rápida

| Objetivo | Comando |
|----------|---------|
| ONUs offline em uma porta | `display ont info 0/1 all \| include offline` |
| Sinal óptico de uma ONU | `display ont optical-info 0/1 <id>` |
| Sinal de todas as ONUs da porta | `display ont optical-info 0/1 all` |
| Causa de desconexão | `display ont register-info 0/1 <id>` |
| Resetar ONU remotamente | `ont reset 0/1 <id>` |
| ONUs não autorizadas (autofind) | `display ont autofind all` |
| Buscar ONU por serial number | `display ont info by-sn <SN>` |
| Ver service-port de uma ONU | `display service-port port 0/1 ont <id>` |
| Ver GEM ports da ONU | `display ont gemport 0/1 <id>` |
| Erros da porta PON | `display interface gpon 0/1 statistics` |
| Alarmes ativos | `display alarm active all` |
| Versão de software da ONU | `display ont version 0/1 <id>` |
| Status da placa/slot | `display port state 0/1` |

---

## Checklist de Campo — ONU Offline

Siga esta sequência ao atender um chamado de cliente sem sinal:

1. **[ ]** Verificar sinal óptico: `display ont optical-info 0/1 <id>`
2. **[ ]** Checar causa do deregister: `display ont register-info 0/1 <id>`
3. **[ ]** Verificar se outras ONUs da mesma porta estão offline
4. **[ ]** Se sinal fraco: inspecionar conectores, emendas e splitters
5. **[ ]** Se dying-gasp: verificar energia elétrica no local do cliente
6. **[ ]** Se ranging-abort: verificar fibra com OTDR ou medidor óptico
7. **[ ]** Tentar reset remoto: `ont reset 0/1 <id>`
8. **[ ]** Se necessário, desautorizar e reautorizar: `ont delete` + `ont add`
9. **[ ]** Verificar se service-port está configurado corretamente após volta
10. **[ ]** Confirmar tráfego nos GEM ports: `display ont gemport statistics 0/1 <id>`

---

## Veja Também

- [Provisionamento de ONUs](/pt/olt/huawei/gpon-ont)
- [Serviços e Perfis DBA](/pt/olt/huawei/servicos-perfis)
- [Interfaces e VLANs](/pt/olt/huawei/interface-vlan)
- [Configuração Inicial OLT Huawei](/pt/olt/huawei/configuracao-inicial)
- [Scripts — Verificar sinal SNMP](/pt/scripts)
