# BNG Huawei — Concentrador PPPoE

BNG (Broadband Network Gateway) é o concentrador de sessões PPPoE/IPoE utilizado por provedores de internet. No Huawei, essa função é executada nos roteadores NE40E, ME60, entre outros.

## Arquitetura

```
ONT/Modem ──► OLT ──► SW-Agregação ──► BNG (NE40E) ──► Internet
                                           │
                                     RADIUS Server
                                     Pool IPv4/IPv6
```

## Componentes da Configuração

| Componente | Função |
|-----------|--------|
| AAA | Autenticação, Autorização e Contabilidade |
| RADIUS | Servidor de autenticação externo |
| IP Pool | Faixa de endereços para clientes |
| Domain | Agrupa políticas por sufixo do usuário |
| Virtual-Template | Interface modelo PPPoE |
| DBA/QoS | Controle de banda por plano |

## Tópicos

- [AAA](./aaa) — esquemas de autenticação e contabilidade
- [RADIUS](./radius) — servidores RADIUS, CoA, atributos
- [Pool IPv4](./pool-ipv4) — pools de endereçamento CGNAT/público
- [Pool IPv6](./pool-ipv6) — prefixos IPv6/PD
- [Domain](./domain) — domínios AAA e binding de pools
- [ACL](./acl) — controle de acesso por user-group
- [Virtual-Template](./virtual-template) — interface PPPoE
- [Padrão PPPoE](./padrao) — configurações globais e boas práticas

## Verificação Rápida

```bash
# Sessões PPPoE ativas
<BNG> display pppoe-server session summary
<BNG> display access-user domain ISP-CLIENTES

# Pool de endereços
<BNG> display ip pool name pool-cgnat-01
<BNG> display ip pool name pool-cgnat-01 used
```
