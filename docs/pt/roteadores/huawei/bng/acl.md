# ACL e User-Group — BNG Huawei

::: tip Versão testada
VRP **V800R021C10** (NE40E / NE8000). Compatível com V800R011+.
:::

## User-Group para Controle de Banda

```bash
# Criar grupos por plano de velocidade
[BNG] user-group PLAN-50M
[BNG-user-group-PLAN-50M] quit

[BNG] user-group PLAN-100M
[BNG-user-group-PLAN-100M] quit

[BNG] user-group PLAN-200M
[BNG-user-group-PLAN-200M] quit

[BNG] user-group PLAN-500M
[BNG-user-group-PLAN-500M] quit
[BNG] commit
```

## UCL — User-based Control List

```bash
# Criar UCL group para bloqueio/redirecionamento
[BNG] user-group BLOQUEADOS
[BNG-user-group-BLOQUEADOS] quit

# ACL aplicada ao grupo
[BNG] acl 6001
[BNG-acl-ucl-6001] rule 10 permit destination 10.0.0.200 0   # permitir RADIUS
[BNG-acl-ucl-6001] rule 20 permit destination 8.8.8.8 0     # permitir DNS
[BNG-acl-ucl-6001] rule 100 deny ip                          # bloquear o resto
[BNG-acl-ucl-6001] quit
[BNG] commit
```

## Aplicar ACL no Domain

```bash
[BNG] aaa
[BNG-aaa] domain ISP-CLIENTES
[BNG-aaa-domain-ISP-CLIENTES] user-group PLAN-100M
[BNG-aaa-domain-ISP-CLIENTES] quit
[BNG-aaa] quit
[BNG] commit
```

## ACL para Controle de Acesso ao BNG

```bash
# Restringir SSH ao BNG por IP de origem
[BNG] acl 2001
[BNG-acl-basic-2001] rule 5 permit source 10.0.0.0 0.0.0.255
[BNG-acl-basic-2001] rule 100 deny source any
[BNG-acl-basic-2001] quit

[BNG] user-interface vty 0 4
[BNG-ui-vty0-4] acl 2001 inbound
[BNG-ui-vty0-4] quit
[BNG] commit
```

## Verificar User-Groups e ACL

```bash
<BNG> display user-group all
<BNG> display acl 6001
<BNG> display access-user group PLAN-100M
```
