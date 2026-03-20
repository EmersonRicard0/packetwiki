---
description: Configuração de MPLS L2VPN (VPLS/VSI) em switches Huawei — VSI, pseudowire LDP, AC, split-horizon e remote peer.
---

# MPLS L2VPN / VPLS — Switch Huawei

::: tip Versão testada
VRP **V200R019C10** (CloudEngine 6800 / S5700 / S6700). Compatível com V200R005+.
:::

Guia de configuração de MPLS L2VPN com VPLS em switches Huawei. Permite criar redes L2 sobre backbone MPLS usando VSIs (Virtual Switch Instances) com sinalização LDP. Ideal para serviços de L2VPN entre POPs de ISP.

::: warning Pré-requisitos
- MPLS e LDP configurados e com sessões `Operational` — veja [MPLS / LDP](./mpls)
- OSPF com os loopbacks de todos os PEs distribuídos
- LSR-ID definido
:::

---

## Habilitar L2VPN

```bash
[SW] l2vpn enable
```

---

## Criar VSI (Virtual Switch Instance)

O VSI é o domínio de switching L2 que será transportado pelo backbone MPLS. Cada cliente deve ter um VSI único com um `vsi-id` diferente.

```bash
[SW] vsi VPLS-CLIENTE-01
[SW-vsi-VPLS-CLIENTE-01] pwsignal ldp
[SW-vsi-VPLS-CLIENTE-01-ldp] vsi-id 100
# Definir os peers remotos (loopbacks dos outros PEs)
[SW-vsi-VPLS-CLIENTE-01-ldp] peer 10.255.2.2
[SW-vsi-VPLS-CLIENTE-01-ldp] peer 10.255.3.3
[SW-vsi-VPLS-CLIENTE-01-ldp] quit
[SW-vsi-VPLS-CLIENTE-01] quit
```

---

## Associar Interface ao VSI (AC — Attachment Circuit)

### Porta física direta

```bash
[SW] interface GigabitEthernet 0/0/10
[SW-GE0/0/10] l2 binding vsi VPLS-CLIENTE-01
[SW-GE0/0/10] quit
```

### Sub-interface com encapsulamento VLAN (dot1q)

```bash
[SW] interface GigabitEthernet 0/0/10.100
[SW-GE0/0/10.100] vlan-type dot1q 100
[SW-GE0/0/10.100] l2 binding vsi VPLS-CLIENTE-01
[SW-GE0/0/10.100] quit
```

---

## Exemplo de VLANIF com OSPF e MPLS (Backbone)

Interface de backbone típica em ambiente de produção ISP:

```bash
interface Vlanif2542
 description "OSPF.PE01.POP.CIDADE[EMPRESA]"
 ip address 10.200.202.50 255.255.255.252
 ospf cost 300
 ospf network-type p2p
 ospf bfd enable
 ospf enable 1 area 0.0.0.0
 mpls
 mpls ldp
```

---

## LDP Split-Horizon

Evita loops de encaminhamento em topologias VPLS full-mesh:

```bash
[SW] mpls ldp
[SW-mpls-ldp] outbound peer all split-horizon
[SW-mpls-ldp] quit
```

---

## LDP Remote Peer

Necessário quando os PEs não são vizinhos IGP diretos (túnel LDP sobre MPLS):

```bash
[SW] mpls ldp remote-peer PE-CIDADE-01
[SW-mpls-ldp-remote-PE-CIDADE-01] remote-ip 10.255.2.2
[SW-mpls-ldp-remote-PE-CIDADE-01] quit
```

---

## Verificar L2VPN / VPLS

```bash
# Estado de todos os VSIs
<SW> display vsi verbose

# Estado de um VSI específico
<SW> display vsi name VPLS-CLIENTE-01

# Estado dos pseudowires
<SW> display l2vpn pw verbose

# Peers LDP remotos
<SW> display mpls ldp remote-peer

# L2VCs ativos
<SW> display mpls l2vc
```

---

## Troubleshooting L2VPN

```bash
# Ver instâncias de serviço vinculadas ao VSI
<SW> display vsi service-instance

# Tabela de encaminhamento L2 do VSI
<SW> display l2vpn forwarding-table vsi VPLS-CLIENTE-01

# Testar LSP para o PE remoto
<SW> ping mpls ldp ip 10.255.2.2 32
```

---

## Problemas Comuns

### Pseudowire não estabelece (estado "down")

```bash
# 1. Verificar sessão LDP com o peer
<SW> display mpls ldp session
# "Operational" para os peers remotos envolvidos

# 2. Verificar se o vsi-id é igual nos dois lados
<SW> display vsi name VPLS-CLIENTE-01
# O vsi-id deve ser idêntico em todos os PEs do mesmo VSI

# 3. Verificar conectividade MPLS
<SW> ping mpls ldp ip 10.255.2.2 32
```

### Tráfego L2 não passa pelo VPLS

```bash
# Verificar se o AC está corretamente vinculado ao VSI
<SW> display vsi service-instance

# Verificar tabela MAC do VSI
<SW> display l2vpn forwarding-table vsi VPLS-CLIENTE-01

# Confirmar que a VLAN está chegando à interface AC
<SW> display port vlan GigabitEthernet 0/0/10
```

---

## Veja Também

- [MPLS / LDP — Switch Huawei](./mpls)
- [VLAN e Interfaces — Switch Huawei](./vlan)
- [Troubleshooting — Switch Huawei](./troubleshooting)
- [MPLS / VPLS — OLT Datacom](/pt/olt/datacom/mpls-vpls)
