export const enSidebar = {
  '/routers/': [
    {
      text: 'Routers',
      items: [
        { text: 'Overview', link: '/routers/' },
      ],
    },
    {
      text: 'Cisco',
      collapsed: false,
      items: [
        { text: 'Overview', link: '/routers/cisco/' },
        { text: 'ISR 4000', link: '/routers/cisco/isr-4000' },
        { text: 'ASR 1000', link: '/routers/cisco/asr-1000' },
        { text: 'Catalyst 8000', link: '/routers/cisco/catalyst-8000' },
      ],
    },
    {
      text: 'MikroTik',
      collapsed: false,
      items: [
        { text: 'Overview', link: '/routers/mikrotik/' },
        { text: 'hEX Series', link: '/routers/mikrotik/hex-series' },
        { text: 'CCR (Cloud Core Router)', link: '/routers/mikrotik/ccr' },
        { text: 'RB4011', link: '/routers/mikrotik/rb4011' },
      ],
    },
    {
      text: 'Juniper',
      collapsed: true,
      items: [
        { text: 'Overview', link: '/routers/juniper/' },
        { text: 'SRX Series', link: '/routers/juniper/srx' },
        { text: 'MX Series', link: '/routers/juniper/mx' },
      ],
    },
    {
      text: 'Ubiquiti',
      collapsed: true,
      items: [
        { text: 'Overview', link: '/routers/ubiquiti/' },
        { text: 'UniFi Dream Machine', link: '/routers/ubiquiti/udm' },
        { text: 'EdgeRouter', link: '/routers/ubiquiti/edgerouter' },
      ],
    },
    {
      text: 'Huawei',
      collapsed: true,
      items: [
        { text: 'Overview', link: '/routers/huawei/' },
        { text: 'AR Series', link: '/routers/huawei/ar-series' },
        { text: 'NE Series', link: '/routers/huawei/ne-series' },
      ],
    },
  ],

  '/switches/': [
    {
      text: 'Switches',
      items: [
        { text: 'Overview', link: '/switches/' },
      ],
    },
    {
      text: 'Cisco',
      collapsed: false,
      items: [
        { text: 'Overview', link: '/switches/cisco/' },
        { text: 'Catalyst 2960', link: '/switches/cisco/catalyst-2960' },
        { text: 'Catalyst 3650/3850', link: '/switches/cisco/catalyst-3650' },
        { text: 'Catalyst 9200/9300', link: '/switches/cisco/catalyst-9200' },
        { text: 'Nexus 9000', link: '/switches/cisco/nexus-9000' },
      ],
    },
    {
      text: 'HP / Aruba',
      collapsed: false,
      items: [
        { text: 'Overview', link: '/switches/aruba/' },
        { text: 'Aruba 2530', link: '/switches/aruba/2530' },
        { text: 'Aruba 2930', link: '/switches/aruba/2930' },
        { text: 'Aruba CX 6200', link: '/switches/aruba/cx-6200' },
      ],
    },
    {
      text: 'MikroTik',
      collapsed: true,
      items: [
        { text: 'Overview', link: '/switches/mikrotik/' },
        { text: 'CRS Series', link: '/switches/mikrotik/crs' },
        { text: 'CSS Series', link: '/switches/mikrotik/css' },
      ],
    },
    {
      text: 'Huawei',
      collapsed: true,
      items: [
        { text: 'Overview', link: '/switches/huawei/' },
        { text: 'S5700 Series', link: '/switches/huawei/s5700' },
        { text: 'CloudEngine', link: '/switches/huawei/cloudengine' },
      ],
    },
    {
      text: 'Juniper',
      collapsed: true,
      items: [
        { text: 'Overview', link: '/switches/juniper/' },
        { text: 'EX Series', link: '/switches/juniper/ex' },
        { text: 'QFX Series', link: '/switches/juniper/qfx' },
      ],
    },
  ],

  '/linux/': [
    {
      text: 'Linux Servers',
      items: [
        { text: 'Overview', link: '/linux/' },
      ],
    },
    {
      text: 'Distributions',
      collapsed: false,
      items: [
        { text: 'Ubuntu Server', link: '/linux/ubuntu/' },
        { text: 'Debian', link: '/linux/debian/' },
        { text: 'Rocky Linux', link: '/linux/rocky/' },
        { text: 'AlmaLinux', link: '/linux/alma/' },
        { text: 'CentOS Stream', link: '/linux/centos/' },
      ],
    },
    {
      text: 'Network Services',
      collapsed: false,
      items: [
        { text: 'DHCP (isc-dhcp / Kea)', link: '/linux/services/dhcp' },
        { text: 'DNS (BIND9 / Unbound)', link: '/linux/services/dns' },
        { text: 'NTP (chrony / ntpd)', link: '/linux/services/ntp' },
        { text: 'VPN (WireGuard)', link: '/linux/services/wireguard' },
        { text: 'VPN (OpenVPN)', link: '/linux/services/openvpn' },
        { text: 'Proxy (Squid)', link: '/linux/services/squid' },
      ],
    },
    {
      text: 'Firewall',
      collapsed: true,
      items: [
        { text: 'iptables', link: '/linux/firewall/iptables' },
        { text: 'nftables', link: '/linux/firewall/nftables' },
        { text: 'UFW', link: '/linux/firewall/ufw' },
        { text: 'firewalld', link: '/linux/firewall/firewalld' },
      ],
    },
    {
      text: 'Monitoring',
      collapsed: true,
      items: [
        { text: 'Zabbix', link: '/linux/monitoring/zabbix' },
        { text: 'Grafana + Prometheus', link: '/linux/monitoring/grafana' },
        { text: 'Netdata', link: '/linux/monitoring/netdata' },
        { text: 'SNMP', link: '/linux/monitoring/snmp' },
      ],
    },
  ],
}
