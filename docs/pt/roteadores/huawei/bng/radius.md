# RADIUS — BNG Huawei

::: tip Versão testada
VRP **V800R021C10** (NE40E / NE8000). Compatível com V800R011+.
:::

## Criar Servidor RADIUS

```bash
[BNG] radius-server template RADIUS-ISP
[BNG-radius-RADIUS-ISP] radius-server authentication 10.0.0.200 1812
[BNG-radius-RADIUS-ISP] radius-server authentication 10.0.0.201 1812 secondary
[BNG-radius-RADIUS-ISP] radius-server accounting 10.0.0.200 1813
[BNG-radius-RADIUS-ISP] radius-server accounting 10.0.0.201 1813 secondary
[BNG-radius-RADIUS-ISP] radius-server shared-key cipher RadiusSecret@2024
[BNG-radius-RADIUS-ISP] undo radius-server user-name domain-included
[BNG-radius-RADIUS-ISP] quit
[BNG] commit
```

## Atributos RADIUS Importantes

```bash
[BNG] radius-server template RADIUS-ISP
# Incluir atributo NAS-IP
[BNG-radius-RADIUS-ISP] radius-attribute nas-ip 10.255.1.1
# Timeout de resposta
[BNG-radius-RADIUS-ISP] timer response-timeout 5
# Número de tentativas
[BNG-radius-RADIUS-ISP] retransmit 3
[BNG-radius-RADIUS-ISP] quit
```

## CoA (Change of Authorization)

O CoA permite que o servidor RADIUS altere atributos de sessões ativas (velocidade, desconexão, etc.):

```bash
[BNG] radius-server template RADIUS-ISP
[BNG-radius-RADIUS-ISP] radius-server coa
[BNG-radius-RADIUS-ISP] quit

# Habilitar porta de escuta CoA
[BNG] radius-server authorization 10.0.0.200 shared-key cipher RadiusSecret@2024
[BNG] commit
```

## Grupo RADIUS

```bash
[BNG] aaa
[BNG-aaa] domain ISP-CLIENTES
[BNG-aaa-domain-ISP-CLIENTES] radius-server RADIUS-ISP
[BNG-aaa-domain-ISP-CLIENTES] quit
[BNG-aaa] quit
[BNG] commit
```

## Verificar RADIUS

```bash
<BNG> display radius-server template RADIUS-ISP
<BNG> display radius-server statistics RADIUS-ISP
<BNG> display access-user radius-server 10.0.0.200
```

## Teste de Autenticação RADIUS

```bash
<BNG> test-aaa user01@isp.com.br Password123 radius-template RADIUS-ISP
```
