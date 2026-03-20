# OLT Huawei — MA5800 / MA5600

A OLT (Optical Line Terminal) Huawei MA5800 é um equipamento GPON/XGS-PON de alta densidade utilizado por provedores de internet para distribuição de fibra óptica.

## Modelos Principais

| Modelo | Slots GPON | Capacidade |
|--------|-----------|------------|
| MA5800-X2 | 2 slots | Pequeno porte |
| MA5800-X7 | 7 slots | Médio porte |
| MA5800-X15 | 15 slots | Grande porte |
| MA5800-X17 | 17 slots | Grande porte |

## Acesso Inicial

```bash
# IP padrão de gerência
# IP: 10.11.104.2/24
# Usuário/Senha MA5600: root / admin
# Usuário/Senha MA5800: root / admin123

# Via console
> enable
# config
```

## Modos de Operação

```
> (modo usuário)
# (modo enable)
(config)# (modo configuração global)
(config-if-gpon-0/1)# (modo interface GPON)
```

## Tópicos

- [Configuração Inicial](./configuracao-inicial) — acesso, slots, hostname, perfis
- [Device / Sistema](./device) — auto-save, backup, restore, update, SNMP, syslog
- [Interfaces e VLANs](./interface-vlan) — portas MPU, VLANs de serviço
- [GPON — Pesquisar e Autorizar ONUs](./gpon-ont) — auto-find, confirm, service-port
- [Serviços (DBA/Profiles)](./servicos-perfis) — DBA, line-profile, srv-profile
- [MPLS](./mpls) — MPLS backbone na OLT

## Verificação Rápida

```bash
# Ver slots/boards
(config)# display board 0

# Ver versão
(config)# display version

# Ver ONUs não autorizadas
(config)# display ont autofind all
```
