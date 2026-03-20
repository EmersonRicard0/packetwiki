export const ptSidebar = {
  '/pt/roteadores/': [
    {
      text: 'Roteadores',
      items: [
        { text: 'Visão Geral', link: '/pt/roteadores/' },
      ],
    },
    {
      text: 'Cisco',
      collapsed: true,
      items: [
        { text: 'Visão Geral', link: '/pt/roteadores/cisco/' },
        { text: 'ISR 4000', link: '/pt/roteadores/cisco/isr-4000' },
        { text: 'ASR 1000', link: '/pt/roteadores/cisco/asr-1000' },
        { text: 'Catalyst 8000', link: '/pt/roteadores/cisco/catalyst-8000' },
      ],
    },
    {
      text: 'MikroTik',
      collapsed: false,
      items: [
        { text: 'Visão Geral', link: '/pt/roteadores/mikrotik/' },
        { text: 'hEX Series', link: '/pt/roteadores/mikrotik/hex-series' },
        { text: 'CCR (Cloud Core Router)', link: '/pt/roteadores/mikrotik/ccr' },
        { text: 'RB4011', link: '/pt/roteadores/mikrotik/rb4011' },
        { text: 'BGP no RouterOS', link: '/pt/roteadores/mikrotik/bgp' },
        { text: 'OSPF no RouterOS', link: '/pt/roteadores/mikrotik/ospf' },
      ],
    },
    {
      text: 'Juniper',
      collapsed: true,
      items: [
        { text: 'Visão Geral', link: '/pt/roteadores/juniper/' },
        { text: 'SRX Series', link: '/pt/roteadores/juniper/srx' },
        { text: 'MX Series', link: '/pt/roteadores/juniper/mx' },
      ],
    },
    {
      text: 'Ubiquiti',
      collapsed: true,
      items: [
        { text: 'Visão Geral', link: '/pt/roteadores/ubiquiti/' },
        { text: 'UniFi Dream Machine', link: '/pt/roteadores/ubiquiti/udm' },
        { text: 'EdgeRouter', link: '/pt/roteadores/ubiquiti/edgerouter' },
      ],
    },
    {
      text: 'Huawei',
      collapsed: false,
      items: [
        { text: 'Visão Geral', link: '/pt/roteadores/huawei/' },
        { text: 'Configuração Inicial', link: '/pt/roteadores/huawei/configuracao-inicial' },
        { text: 'BGP', link: '/pt/roteadores/huawei/bgp' },
        { text: 'OSPF', link: '/pt/roteadores/huawei/ospf' },
        { text: 'Controle de Banda', link: '/pt/roteadores/huawei/controle-de-banda' },
        { text: 'SNMP', link: '/pt/roteadores/huawei/snmp' },
        { text: 'Backup', link: '/pt/roteadores/huawei/backup' },
        { text: 'Atualização de Firmware', link: '/pt/roteadores/huawei/update' },
        { text: 'Troubleshooting', link: '/pt/roteadores/huawei/troubleshooting' },
        { text: 'Limpar Contadores', link: '/pt/roteadores/huawei/limpar-contadores' },
        {
          text: 'BNG / PPPoE',
          collapsed: false,
          items: [
            { text: 'Visão Geral', link: '/pt/roteadores/huawei/bng/' },
            { text: 'AAA', link: '/pt/roteadores/huawei/bng/aaa' },
            { text: 'RADIUS', link: '/pt/roteadores/huawei/bng/radius' },
            { text: 'Pool IPv4', link: '/pt/roteadores/huawei/bng/pool-ipv4' },
            { text: 'Pool IPv6', link: '/pt/roteadores/huawei/bng/pool-ipv6' },
            { text: 'Domain AAA', link: '/pt/roteadores/huawei/bng/domain' },
            { text: 'ACL / User-Group', link: '/pt/roteadores/huawei/bng/acl' },
            { text: 'Virtual-Template', link: '/pt/roteadores/huawei/bng/virtual-template' },
            { text: 'Padrão PPPoE', link: '/pt/roteadores/huawei/bng/padrao' },
          ],
        },
      ],
    },
  ],

  '/pt/switches/': [
    {
      text: 'Switches',
      items: [
        { text: 'Visão Geral', link: '/pt/switches/' },
      ],
    },
    {
      text: 'Cisco',
      collapsed: true,
      items: [
        { text: 'Visão Geral', link: '/pt/switches/cisco/' },
        { text: 'Catalyst 2960', link: '/pt/switches/cisco/catalyst-2960' },
        { text: 'Catalyst 3650/3850', link: '/pt/switches/cisco/catalyst-3650' },
        { text: 'Catalyst 9200/9300', link: '/pt/switches/cisco/catalyst-9200' },
        { text: 'Nexus 9000', link: '/pt/switches/cisco/nexus-9000' },
      ],
    },
    {
      text: 'HP / Aruba',
      collapsed: true,
      items: [
        { text: 'Visão Geral', link: '/pt/switches/aruba/' },
        { text: 'Aruba 2530', link: '/pt/switches/aruba/2530' },
        { text: 'Aruba 2930', link: '/pt/switches/aruba/2930' },
        { text: 'Aruba CX 6200', link: '/pt/switches/aruba/cx-6200' },
      ],
    },
    {
      text: 'MikroTik',
      collapsed: true,
      items: [
        { text: 'Visão Geral', link: '/pt/switches/mikrotik/' },
        { text: 'CRS Series', link: '/pt/switches/mikrotik/crs' },
        { text: 'CSS Series', link: '/pt/switches/mikrotik/css' },
      ],
    },
    {
      text: 'Huawei',
      collapsed: false,
      items: [
        { text: 'Visão Geral', link: '/pt/switches/huawei/' },
        { text: 'Configuração Inicial', link: '/pt/switches/huawei/configuracao-inicial' },
        { text: 'Gerência e SSH', link: '/pt/switches/huawei/gerencia-ssh' },
        { text: 'VLAN e Interfaces', link: '/pt/switches/huawei/vlan' },
        { text: 'Agregação de Links', link: '/pt/switches/huawei/agregacao' },
        { text: 'Controle de Banda', link: '/pt/switches/huawei/controle-de-banda' },
        { text: 'SNMP', link: '/pt/switches/huawei/snmp' },
        { text: 'Log / Syslog', link: '/pt/switches/huawei/log-syslog' },
        { text: 'Backup e Restore', link: '/pt/switches/huawei/backup-restore' },
        { text: 'Data e Hora / NTP', link: '/pt/switches/huawei/time-date' },
        { text: 'MPLS / LDP', link: '/pt/switches/huawei/mpls' },
        { text: 'MPLS L2VPN / VPLS', link: '/pt/switches/huawei/mpls-l2vpn' },
        { text: 'Troubleshooting', link: '/pt/switches/huawei/troubleshooting' },
      ],
    },
    {
      text: 'Juniper',
      collapsed: true,
      items: [
        { text: 'Visão Geral', link: '/pt/switches/juniper/' },
        { text: 'EX Series', link: '/pt/switches/juniper/ex' },
        { text: 'QFX Series', link: '/pt/switches/juniper/qfx' },
      ],
    },
    {
      text: 'Datacom',
      collapsed: false,
      items: [
        { text: 'Visão Geral', link: '/pt/switches/datacom/' },
        { text: 'Configuração Inicial', link: '/pt/switches/datacom/configuracao-inicial' },
        { text: 'VLANs e Interfaces', link: '/pt/switches/datacom/vlan' },
        { text: 'MPLS e L2VPN', link: '/pt/switches/datacom/mpls' },
        { text: 'QoS', link: '/pt/switches/datacom/qos' },
        { text: 'Segurança', link: '/pt/switches/datacom/seguranca' },
      ],
    },
  ],

  '/pt/olt/': [
    {
      text: 'OLT',
      items: [
        { text: 'Visão Geral', link: '/pt/olt/' },
      ],
    },
    {
      text: 'Huawei',
      collapsed: false,
      items: [
        { text: 'Visão Geral', link: '/pt/olt/huawei/' },
        { text: 'Configuração Inicial', link: '/pt/olt/huawei/configuracao-inicial' },
        { text: 'Device / Gerência', link: '/pt/olt/huawei/device' },
        { text: 'Interfaces e VLANs', link: '/pt/olt/huawei/interface-vlan' },
        { text: 'GPON — ONUs', link: '/pt/olt/huawei/gpon-ont' },
        { text: 'Serviços (DBA/Profiles)', link: '/pt/olt/huawei/servicos-perfis' },
        { text: 'MPLS', link: '/pt/olt/huawei/mpls' },
        { text: 'Troubleshooting / Sinal', link: '/pt/olt/huawei/troubleshooting' },
      ],
    },
    {
      text: 'Datacom',
      collapsed: false,
      items: [
        { text: 'Visão Geral', link: '/pt/olt/datacom/' },
        { text: 'Configuração Inicial', link: '/pt/olt/datacom/configuracao-inicial' },
        { text: 'Perfis GPON', link: '/pt/olt/datacom/gpon-perfis' },
        { text: 'Provisionamento de ONUs', link: '/pt/olt/datacom/gpon-provisionamento' },
        { text: 'Serviços GPON', link: '/pt/olt/datacom/gpon-servicos' },
        { text: 'MPLS / VPLS', link: '/pt/olt/datacom/mpls-vpls' },
      ],
    },
  ],

  '/pt/servicos/': [
    {
      text: 'Serviços',
      items: [
        { text: 'Visão Geral', link: '/pt/servicos/' },
      ],
    },
    {
      text: 'Monitoramento',
      collapsed: false,
      items: [
        { text: 'Zabbix', link: '/pt/servicos/zabbix' },
        { text: 'Zabbix via Docker', link: '/pt/servicos/zabbix-docker' },
        { text: 'Grafana + Prometheus', link: '/pt/servicos/grafana' },
        { text: 'Grafana via Docker', link: '/pt/servicos/grafana-docker' },
      ],
    },
    {
      text: 'Autenticação',
      collapsed: false,
      items: [
        { text: 'FreeRADIUS', link: '/pt/servicos/freeradius' },
      ],
    },
  ],

  '/pt/linux/': [
    {
      text: 'Servidores Linux',
      items: [
        { text: 'Visão Geral', link: '/pt/linux/' },
      ],
    },
    {
      text: 'Distribuições',
      collapsed: false,
      items: [
        { text: 'Ubuntu Server', link: '/pt/linux/ubuntu/' },
        { text: 'Debian', link: '/pt/linux/debian/' },
        { text: 'Rocky Linux', link: '/pt/linux/rocky/' },
        { text: 'AlmaLinux', link: '/pt/linux/alma/' },
        { text: 'CentOS Stream', link: '/pt/linux/centos/' },
      ],
    },
    {
      text: 'Serviços de Rede',
      collapsed: false,
      items: [
        { text: 'DHCP (isc-dhcp / Kea)', link: '/pt/linux/servicos/dhcp' },
        { text: 'DNS (BIND9 / Unbound)', link: '/pt/linux/servicos/dns' },
        { text: 'NTP (chrony / ntpd)', link: '/pt/linux/servicos/ntp' },
        { text: 'VPN (WireGuard)', link: '/pt/linux/servicos/wireguard' },
        { text: 'VPN (OpenVPN)', link: '/pt/linux/servicos/openvpn' },
        { text: 'Proxy (Squid)', link: '/pt/linux/servicos/squid' },
      ],
    },
    {
      text: 'Firewall',
      collapsed: true,
      items: [
        { text: 'iptables', link: '/pt/linux/firewall/iptables' },
        { text: 'nftables', link: '/pt/linux/firewall/nftables' },
        { text: 'UFW', link: '/pt/linux/firewall/ufw' },
        { text: 'firewalld', link: '/pt/linux/firewall/firewalld' },
      ],
    },
    {
      text: 'Monitoramento',
      collapsed: true,
      items: [
        { text: 'Zabbix', link: '/pt/linux/monitoramento/zabbix' },
        { text: 'Grafana + Prometheus', link: '/pt/linux/monitoramento/grafana' },
        { text: 'Netdata', link: '/pt/linux/monitoramento/netdata' },
        { text: 'SNMP', link: '/pt/linux/monitoramento/snmp' },
      ],
    },
  ],
}
