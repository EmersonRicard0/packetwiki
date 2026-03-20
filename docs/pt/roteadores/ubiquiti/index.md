# Roteadores Ubiquiti

A Ubiquiti é muito popular em redes de pequenos e médios provedores (WISPs), com equipamentos custo-benefício acessível e interface gráfica intuitiva.

## Modelos Abrangidos

| Série | Uso | Destaques |
|-------|-----|-----------|
| UniFi Dream Machine (UDM) | Gateway + Controller | UniFi OS integrado, IPS/IDS |
| EdgeRouter | SOHO / Pequenos ISPs | EdgeOS (VyOS-based), CLI poderosa |

## CLI — EdgeRouter

```bash
# EdgeOS — baseado em VyOS
configure
set system host-name ER01
commit
save
```

## Tópicos

- [UniFi Dream Machine](./udm) — Gateway UniFi, VLANs, firewall
- [EdgeRouter](./edgerouter) — PPPoE, OSPF, policy routing

::: info Em construção
Os guias detalhados desta seção estão sendo desenvolvidos. Quer contribuir? Veja o [guia de contribuição](/pt/contribuir).
:::
