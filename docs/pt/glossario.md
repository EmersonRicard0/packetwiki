---
description: Glossário de termos técnicos de redes, ISP, óptica e Linux usados no PacketWiki.
---

# Glossário

Termos técnicos usados no PacketWiki organizados por categoria.

---

## Protocolos de Roteamento

**BGP** (Border Gateway Protocol)
: Protocolo de roteamento entre sistemas autônomos (AS). Usado para troca de rotas entre ISPs, IXPs e provedores de trânsito. Roda sobre TCP porta 179.

**OSPF** (Open Shortest Path First)
: Protocolo IGP (interior) baseado em link-state. Usa o algoritmo de Dijkstra para calcular o menor caminho. Muito usado como IGP de backbone em ISPs.

**IS-IS** (Intermediate System to Intermediate System)
: Protocolo IGP alternativo ao OSPF. Preferido por operadoras tier-1 por ser mais escalável e não depender de IP para trocar LSPs.

**LDP** (Label Distribution Protocol)
: Protocolo que distribui labels MPLS entre roteadores. Usa o IGP (OSPF/IS-IS) para calcular os caminhos e depois associa labels a eles.

**MPLS** (Multiprotocol Label Switching)
: Tecnologia de encaminhamento baseada em labels ao invés de endereços IP. Base para VPNs L2 (VPLS) e L3 (VRF/BGP VPN) em ISPs.

**RSVP-TE** (Resource Reservation Protocol - Traffic Engineering)
: Protocolo para reservar recursos (banda) em LSPs MPLS explícitos. Usado em MPLS Traffic Engineering.

---

## Redes e Switching

**VLAN** (Virtual Local Area Network)
: Segmentação lógica de uma rede física em redes separadas. Identificada por uma tag de 12 bits (802.1Q), suportando até 4094 VLANs.

**Trunk**
: Porta de switch configurada para transportar múltiplas VLANs. As frames recebem a tag 802.1Q ao sair pela porta trunk.

**STP** (Spanning Tree Protocol)
: Protocolo que evita loops em redes com links redundantes bloqueando portas de forma automática. Versões modernas: RSTP (802.1w) e MSTP (802.1s).

**LAG / LACP** (Link Aggregation / Link Aggregation Control Protocol)
: Agregação de múltiplos links físicos em um canal lógico para aumentar banda e redundância. Huawei chama de Eth-Trunk; Cisco de Port-Channel.

**VRF** (Virtual Routing and Forwarding)
: Instância de tabela de roteamento isolada dentro do mesmo roteador. Permite múltiplos clientes com IPs sobrepostos no mesmo equipamento.

**VPLS** (Virtual Private LAN Service)
: Serviço L2 baseado em MPLS que emula uma LAN sobre uma rede IP/MPLS. Conecta sites remotos como se estivessem no mesmo switch.

**VXLAN** (Virtual Extensible LAN)
: Encapsulamento L2 sobre L3 (UDP) para redes de data center. Suporta até 16 milhões de segmentos (vs 4094 do 802.1Q).

**EVPN** (Ethernet VPN)
: Plano de controle BGP para distribuição de informações MAC/IP em redes VXLAN ou MPLS. Padrão moderno para fabric de data center.

---

## ISP / Banda Larga

**AS** (Autonomous System)
: Conjunto de redes sob uma única política de roteamento, identificado por um número ASN. Ex: ASN 18881 = Oi, ASN 28573 = Claro.

**BNG** (Broadband Network Gateway)
: Equipamento responsável por terminar sessões PPPoE dos clientes, autenticar via RADIUS, aplicar políticas de banda e rotear o tráfego. Também chamado de BRAS.

**BRAS** (Broadband Remote Access Server)
: Sinônimo de BNG. Nome mais antigo para o concentrador de sessões PPPoE/L2TP.

**PPPoE** (Point-to-Point Protocol over Ethernet)
: Protocolo de autenticação de clientes de banda larga sobre Ethernet. O cliente negocia uma sessão com o BNG, autentica via RADIUS e recebe um IP.

**NAS** (Network Access Server)
: No contexto RADIUS, é o equipamento que recebe as requisições de acesso (BNG, switch com 802.1X, VPN concentrador) e repassa ao servidor RADIUS.

**RADIUS** (Remote Authentication Dial-In User Service)
: Protocolo de autenticação, autorização e accounting (AAA). O BNG consulta o servidor RADIUS (ex: FreeRADIUS) para validar usuário/senha e aplicar políticas.

**AAA** (Authentication, Authorization, Accounting)
: Três funções de controle de acesso: autenticar (quem é?), autorizar (o que pode fazer?) e registrar (o que fez?).

**CGNAT** (Carrier-Grade NAT)
: NAT realizado pelo ISP para compartilhar um único IPv4 público entre múltiplos clientes. Necessário pela escassez de endereços IPv4.

**IXP** (Internet Exchange Point)
: Ponto neutro onde ISPs trocam tráfego diretamente (peering) sem pagar trânsito. No Brasil: PTT.br (IX.br) em São Paulo, Rio, etc.

---

## GPON / Óptica

**OLT** (Optical Line Terminal)
: Equipamento central da rede GPON, localizado no POP do ISP. Gerencia os splitters e as ONUs dos clientes.

**ONU** (Optical Network Unit)
: Equipamento do cliente na ponta da fibra óptica. Também chamado de ONT quando inclui router integrado.

**ONT** (Optical Network Terminal)
: ONU com funcionalidades de roteador (PPPoE, NAT, WiFi). Terminologia Huawei e ITU-T.

**GPON** (Gigabit Passive Optical Network)
: Padrão de rede óptica passiva com velocidade de 2.488 Gbps downstream e 1.244 Gbps upstream, compartilhada entre até 128 ONUs por porta PON.

**XGS-PON** (10-Gigabit Symmetric Passive Optical Network)
: Evolução do GPON com 10 Gbps simétrico. Padrão crescente em novos deployments FTTH.

**Splitter**
: Divisor óptico passivo (sem energia) que divide o sinal de uma porta PON da OLT para múltiplas ONUs. Razões comuns: 1:8, 1:16, 1:32, 1:64.

**Orçamento óptico**
: Diferença máxima de potência suportada entre a OLT e a ONU (em dB). GPON classe B+: até 28 dB. Acima disso, a ONU perde conexão.

**DBA** (Dynamic Bandwidth Allocation)
: Mecanismo da OLT para alocar banda upstream dinamicamente para cada ONU conforme a demanda, evitando desperdício.

**T-CONT** (Transmission Container)
: Unidade de alocação de banda upstream no GPON. Cada T-CONT é associado a um perfil DBA.

**GEM port** (GPON Encapsulation Method port)
: Canal lógico de tráfego dentro de uma sessão GPON. Cada serviço (internet, VoIP, IPTV) geralmente usa um GEM port separado.

---

## Linux / Infra

**systemd**
: Gerenciador de serviços e inicialização padrão nas distribuições Linux modernas. Substitui o SysVinit. Comandos: `systemctl`, `journalctl`.

**journalctl**
: Ferramenta do systemd para consultar logs. `journalctl -u serviço -f` mostra o log ao vivo de um serviço.

**cgroups** (Control Groups)
: Mecanismo do kernel Linux para limitar e isolar recursos (CPU, memória, rede) de grupos de processos. Base para containers Docker.

**namespace**
: Mecanismo do kernel para isolamento de recursos entre processos. Base para containers (network namespace, PID namespace, etc.).

**SNMP** (Simple Network Management Protocol)
: Protocolo para monitoramento e gerenciamento de dispositivos de rede. Versões: v1 (obsoleta), v2c (mais usada), v3 (com autenticação e criptografia).

**MIB** (Management Information Base)
: Base de dados de objetos SNMP. Define os OIDs (identificadores) para cada informação monitorável de um equipamento.

**OID** (Object Identifier)
: Identificador numérico único de um objeto SNMP. Ex: `1.3.6.1.2.1.1.3.0` = sysUpTime (tempo de operação do sistema).

**NTP** (Network Time Protocol)
: Protocolo de sincronização de tempo. Crucial para logs correlacionáveis, certificados TLS e protocolos de roteamento.

**DSCP** (Differentiated Services Code Point)
: Campo de 6 bits no cabeçalho IP usado para marcar e classificar tráfego para QoS. Ex: EF (46) para VoIP, AF41 para vídeo.

**QoS** (Quality of Service)
: Conjunto de mecanismos para priorizar tipos de tráfego (VoIP, vídeo) em detrimento de outros (bulk download) em momentos de congestionamento.
