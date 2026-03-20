---
description: Configuração inicial do switch Huawei — hostname, usuário, SSH, interface de gerência e salvamento.
---

# Configuração Inicial — Switch Huawei

::: tip Versão testada
VRP **V200R019C10** (CloudEngine 6800 / S5700 / S6700). Compatível com V200R005+.
:::

Guia para a primeira configuração de um switch Huawei: acesso via console, criação de usuário seguro, interface de gerência e habilitação de SSH. Siga esta sequência antes de qualquer outra configuração.

---

## Acesso via Console

Parâmetros da porta serial:

| Parâmetro | Valor |
|-----------|-------|
| Velocidade | 9600 bps |
| Bits de dados | 8 |
| Paridade | Nenhuma |
| Bits de parada | 1 |
| Controle de fluxo | Nenhum |

```bash
# Entrar no modo de configuração
<Huawei> system-view
[Huawei]
```

---

## Hostname

```bash
[Huawei] sysname SW-CORE-01
[SW-CORE-01]
```

---

## Credenciais de Fábrica / Reset

| Parâmetro | Padrão de fábrica |
|-----------|------------------|
| Usuário | `admin` |
| Senha | `Admin@huawei` |

Para resetar para configuração de fábrica (requer acesso físico via console):

```bash
<Huawei> reset saved-configuration
<Huawei> reboot
```

::: warning
O reset apaga toda a configuração. Certifique-se de ter acesso físico ao console antes de executar.
:::

---

## Criar Usuário Local

```bash
[SW] aaa
[SW-aaa] local-user admin password irreversible-cipher MinhaSenh@2024
[SW-aaa] local-user admin privilege level 15
[SW-aaa] local-user admin service-type terminal ssh
[SW-aaa] quit
```

---

## Senha de Enable

```bash
[SW] super password level 15 irreversible-cipher MinhaSenh@2024
```

---

## Interface de Gerência (VLANIF)

```bash
# Criar VLAN de gerência
[SW] vlan 10
[SW-vlan10] description Gerencia
[SW-vlan10] quit

# Criar interface L3 para gerência
[SW] interface Vlanif 10
[SW-Vlanif10] ip address 192.168.1.1 255.255.255.0
[SW-Vlanif10] description Interface-Gerencia
[SW-Vlanif10] quit

# Rota padrão
[SW] ip route-static 0.0.0.0 0.0.0.0 192.168.1.254
```

---

## Habilitar SSH

```bash
# Habilitar servidor SSH
[SW] stelnet server enable

# Configurar VTYs para aceitar SSH
[SW] user-interface vty 0 4
[SW-ui-vty0-4] authentication-mode aaa
[SW-ui-vty0-4] protocol inbound ssh
[SW-ui-vty0-4] quit

# Gerar chave RSA (se não existir)
[SW] rsa local-key-pair create
# Aceitar com Enter (tamanho 2048)
```

---

## Salvar Configuração

```bash
<SW> save
# Confirmar com "y"
```

---

## Verificar Configuração

```bash
<SW> display current-configuration
<SW> display saved-configuration
<SW> display version
<SW> display device
<SW> display ip routing-table
```

---

## Problemas Comuns

### SSH não conecta após configuração

```bash
# Verificar se o servidor SSH está ativo
<SW> display ssh server status

# Verificar usuário e tipo de serviço
<SW> display local-user
# Confirmar que service-type inclui "ssh"

# Verificar VTY
<SW> display user-interface vty 0 4
```

### Interface de gerência sem conectividade

```bash
# Verificar se a VLAN está criada
<SW> display vlan 10

# Verificar se a porta está na VLAN de gerência
<SW> display port vlan

# Verificar rota padrão
<SW> display ip routing-table 0.0.0.0
```

---

## Veja Também

- [Gerência e SSH — Switch Huawei](./gerencia-ssh)
- [VLAN e Interfaces — Switch Huawei](./vlan)
- [Backup e Restore — Switch Huawei](./backup-restore)
- [Configuração Inicial — Roteador Huawei](/pt/roteadores/huawei/configuracao-inicial)
