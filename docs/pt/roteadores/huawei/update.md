---
description: Procedimento de atualização de firmware (VRP) e patch no roteador Huawei NE — transferência, verificação MD5, aplicação e rollback.
---

# Atualização de Firmware/Patch — Roteador Huawei

::: tip Versão testada
VRP **V800R021C10** (NE40E / NE8000). Compatível com V800R011+.
:::

## Verificar Versão Atual

```bash
<PE01> display version
```

Saída de exemplo:
```
Huawei Versatile Routing Platform Software
VRP (R) software, Version 8.220 (NE40E V800R022C00SPC500)
Copyright (C) 2000-2022 Huawei Technologies Co., Ltd.
...
```

## Processo de Atualização (Patch/SPH)

### 1. Transferir o Patch para o Roteador

```bash
# Via FTP
<PE01> ftp 10.0.0.100
[ftp] get NE40E-V800R022C00SPC500-patch.pat
[ftp] quit

# Via TFTP
<PE01> tftp 10.0.0.100 get NE40E-patch.pat
```

### 2. Verificar Integridade do Arquivo

```bash
<PE01> dir
<PE01> verify /md5 NE40E-patch.pat
```

### 3. Aplicar o Patch (sem reinicialização)

```bash
<PE01> patch load NE40E-patch.pat all run
<PE01> display patch-information
```

### 4. Upgrade Completo de VRP (com reinicialização)

```bash
# Definir novo sistema como startup
<PE01> startup system-software NE40E-new-version.cc

# Definir novo patch
<PE01> startup patch NE40E-patch.pat

# Verificar o que vai ser carregado no próximo boot
<PE01> display startup

# Reiniciar (agendar manutenção!)
<PE01> reboot
```

## Rollback de Patch

```bash
<PE01> patch delete NE40E-patch.pat
<PE01> display patch-information
```

## Verificar após Atualização

```bash
<PE01> display version
<PE01> display patch-information
<PE01> display device
```

::: warning Atenção
Sempre realize o backup da configuração antes de qualquer atualização. Agende a janela de manutenção com antecedência — o reboot causa interrupção de tráfego.
:::

---

## Veja Também

- [Backup — Roteador Huawei](./backup)
- [Configuração Inicial — Roteador Huawei](./configuracao-inicial)
- [Troubleshooting — Roteador Huawei](./troubleshooting)
