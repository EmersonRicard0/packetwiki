---
description: Glossário completo de termos técnicos de redes, ISP, óptica, switching e Linux usados no PacketWiki.
---

# Glossário

Termos técnicos usados no PacketWiki organizados em ordem alfabética. Clique na letra para navegar diretamente.

[A](#a) · [B](#b) · [C](#c) · [D](#d) · [E](#e) · [F](#f) · [G](#g) · [I](#i) · [L](#l) · [M](#m) · [N](#n) · [O](#o) · [P](#p) · [Q](#q) · [R](#r) · [S](#s) · [T](#t) · [V](#v) · [X](#x)

---

## A

### AAA
Authentication, Authorization, Accounting. Três pilares do controle de acesso: autenticar (verificar identidade), autorizar (definir permissões) e contabilizar (registrar o que foi feito). Implementado via RADIUS ou TACACS+ em equipamentos de rede.

### ACL
Access Control List. Lista de regras que permitem ou bloqueiam tráfego com base em critérios como endereço IP de origem/destino, protocolo e porta. Aplicada em interfaces de roteadores e switches para filtragem de pacotes.

### AS (Autonomous System)
Conjunto de redes sob uma única política de roteamento administrativa, identificado por um número ASN (Autonomous System Number). Exemplos brasileiros: ASN 18881 = Oi, ASN 28573 = Claro, ASN 7738 = Telemar. ASNs de 16 bits (1–65535) ou 32 bits (até 4.294.967.295).

---

## B

### BGP
Border Gateway Protocol. Protocolo de roteamento entre sistemas autônomos (EGP), rodando sobre TCP porta 179. Responsável por trocar prefixos de roteamento entre ISPs, IXPs e provedores de trânsito. É o protocolo que sustenta a tabela de roteamento global da internet.

### BNG
Broadband Network Gateway. Equipamento que termina sessões PPPoE dos assinantes de banda larga, realiza autenticação via RADIUS, aplica políticas de banda (shaping/policing) e roteia o tráfego para a internet. Também chamado de BRAS (Broadband Remote Access Server).

---

## C

### CE
Customer Edge. Roteador do lado do cliente em uma VPN MPLS L3VPN. Conecta-se ao PE (Provider Edge) do provedor e não precisa ter conhecimento da rede MPLS; recebe as rotas do PE via BGP, OSPF ou estático.

### CIDR
Classless Inter-Domain Routing. Notação de endereçamento IP que substitui as antigas classes A/B/C. Representa uma rede pelo endereço seguido do prefixo (ex: `192.168.1.0/24`). Permite agregação eficiente de rotas (route summarization) e uso flexível do espaço de endereçamento.

---

## D

### DBA
Dynamic Bandwidth Allocation. Mecanismo da OLT GPON que aloca banda upstream dinamicamente para cada ONU conforme a demanda real, evitando desperdício e garantindo melhor uso da capacidade compartilhada da porta PON.

### DSCP
Differentiated Services Code Point. Campo de 6 bits no cabeçalho IP (dentro do byte ToS/DS) usado para marcar e classificar tráfego para QoS. Valores comuns: EF (46) para VoIP, AF41 (34) para videoconferência, CS0 (0) para best-effort.

---

## E

### eBGP
External BGP. Sessão BGP estabelecida entre roteadores de sistemas autônomos diferentes (ASNs distintos). O TTL padrão é 1, portanto os peers precisam ser diretamente conectados (ou usar `ebgp-multihop` para sessões com múltiplos saltos).

### EGP
Exterior Gateway Protocol. Categoria de protocolos de roteamento usados entre sistemas autônomos diferentes. O BGP é o único EGP em uso prático hoje. Contrasta com IGP, usado dentro de um único AS.

### EVPN
Ethernet VPN. Plano de controle baseado em BGP para distribuição de informações MAC/IP em redes VXLAN ou MPLS. Padrão moderno para fabric de data center e substituição do VPLS, oferecendo maior escala e convergência mais rápida.

---

## F

### FTTH
Fiber to the Home. Arquitetura de acesso onde a fibra óptica chega diretamente até a residência ou empresa do cliente, sem trecho de cobre. Oferece a maior largura de banda e menor latência dentre as tecnologias de acesso fixo. Geralmente implementada com GPON ou XGS-PON.

---

## G

### GPON
Gigabit Passive Optical Network. Padrão ITU-T G.984 de rede óptica passiva com velocidade de 2.488 Gbps downstream e 1.244 Gbps upstream, compartilhada entre até 128 ONUs por porta PON. A tecnologia FTTH mais implantada no Brasil.

---

## I

### iBGP
Internal BGP. Sessão BGP entre roteadores do mesmo sistema autônomo (mesmo ASN). Diferente do eBGP, não decrementa o TTL de AS-path e exige que todos os roteadores iBGP se vejam em full-mesh (ou usem route reflectors).

### IGP
Interior Gateway Protocol. Categoria de protocolos de roteamento usados dentro de um único sistema autônomo. Exemplos: OSPF, IS-IS, EIGRP, RIP. Responsável por distribuir rotas de infraestrutura (loopbacks, links de interconexão) dentro da rede do ISP.

### IS-IS
Intermediate System to Intermediate System. Protocolo IGP baseado em link-state, alternativo ao OSPF. Preferido por operadoras tier-1 por ser mais escalável, por não depender de IP para trocar LSPs (roda diretamente sobre L2) e por suportar múltiplas famílias de endereços (IPv4 e IPv6 no mesmo processo).

---

## L

### LAG / LACP
Link Aggregation Group / Link Aggregation Control Protocol. Agregação de múltiplos links físicos em um único canal lógico para aumentar banda e garantir redundância. O protocolo LACP (802.3ad) negocia a agregação dinamicamente. Huawei denomina Eth-Trunk; Cisco denomina Port-Channel.

### LDP
Label Distribution Protocol. Protocolo que distribui e mapeia labels MPLS entre roteadores (LSRs). Usa o IGP (OSPF/IS-IS) para calcular os caminhos e associa labels automaticamente a cada FEC (Forwarding Equivalence Class), formando os LSPs.

### Loopback
Interface virtual de software em um roteador, sempre ativa enquanto o equipamento estiver ligado. Usada como router-id em OSPF/BGP, como endpoint de tunnels e como endereço estável de gerência. Anunciada via IGP para ser alcançável de qualquer ponto da rede.

### LSP
Label Switched Path. Caminho pré-estabelecido dentro de uma rede MPLS pelo qual os pacotes são encaminhados com base em labels, sem necessidade de consultar a tabela de roteamento IP a cada salto. Criado pelo LDP (LDP-LSP) ou RSVP-TE (TE-LSP).

### LSR
Label Switching Router. Roteador dentro de uma rede MPLS que encaminha pacotes com base nas labels MPLS. O LSR de entrada (ingress) adiciona o label; os LSRs intermediários (P routers) trocam labels; o LSR de saída (egress/PE) remove o label.

### L2VPN
Layer 2 VPN. Serviço de VPN que transporta tráfego Ethernet (L2) entre sites remotos sobre uma infraestrutura IP/MPLS. Variantes: VPLS (multipoint-to-multipoint) e VPWS/pseudowire (point-to-point).

---

## M

### MIB
Management Information Base. Base de dados hierárquica que define todos os objetos SNMP monitoráveis de um equipamento. Cada objeto é identificado por um OID único. MIBs padrão (RFC) cobrem funções básicas; MIBs proprietárias (Huawei, Cisco) adicionam objetos específicos do fabricante.

### MPLS
Multiprotocol Label Switching. Tecnologia de encaminhamento baseada em labels de tamanho fixo (32 bits) inseridas entre o cabeçalho L2 e o cabeçalho IP. Permite criar LSPs, VPNs L2 (VPLS) e L3 (VRF/BGP VPN), Traffic Engineering e Fast Reroute em redes de ISP.

### MTU
Maximum Transmission Unit. Tamanho máximo de um pacote (em bytes) que pode ser transmitido em um enlace sem fragmentação. Ethernet padrão: 1500 bytes. Com MPLS, o MTU efetivo é reduzido por cada label adicionada (4 bytes cada). Problemas de MTU causam lentidão e travamento de sessões TCP.

---

## N

### NAT
Network Address Translation. Tradução de endereços IP, geralmente de endereços privados (RFC 1918) para um ou mais endereços públicos. Amplamente usado em roteadores de borda. No contexto de ISP, o CGNAT realiza NAT em escala para compartilhar IPv4 entre muitos clientes.

### NTP
Network Time Protocol. Protocolo de sincronização de tempo entre dispositivos de rede. Essencial para correlacionar logs, emitir certificados TLS e manter protocolos de roteamento funcionando corretamente. Hierarquia: stratum 0 (relógio atômico) → stratum 1 (servidor NTP primário) → stratum 2+ (clientes/servidores).

---

## O

### OLT
Optical Line Terminal. Equipamento central da rede GPON/PON, instalado no POP do ISP. Gerencia os splitters passivos e as ONUs dos clientes, controlando ranging, DBA, autenticação e provisionamento de serviços.

### ONU
Optical Network Unit. Equipamento instalado na ponta da fibra óptica, no local do cliente. Converte o sinal óptico em elétrico e fornece as interfaces de acesso (Ethernet, VoIP, CATV). Quando inclui roteador integrado (NAT, Wi-Fi), é denominada ONT.

### ONT
Optical Network Terminal. ONU com funcionalidades de roteador integrado (PPPoE, NAT, Wi-Fi). Terminologia utilizada pela Huawei e definida pela ITU-T. Na prática, os termos ONU e ONT são frequentemente usados como sinônimos.

### OSPF
Open Shortest Path First. Protocolo IGP baseado em link-state que usa o algoritmo de Dijkstra para calcular o menor caminho. Organizado em áreas (area 0 = backbone). Muito usado como IGP de backbone em ISPs brasileiros. Versão para IPv6: OSPFv3.

---

## P

### P Router
Provider Core Router. Roteador dentro do núcleo da rede MPLS do provedor que não tem contato direto com clientes. Encaminha pacotes usando apenas labels MPLS (label switching), sem conhecer as VPNs dos clientes. Conecta-se apenas a outros P routers e PE routers.

### PE
Provider Edge. Roteador de borda da rede MPLS do provedor, que se conecta diretamente aos CE (Customer Edge) dos clientes. Mantém as VRFs dos clientes, realiza a imposição/remoção de labels MPLS e anuncia as rotas dos clientes via MP-BGP.

### PON
Passive Optical Network. Arquitetura de rede óptica que usa apenas componentes passivos (splitters) entre a OLT e as ONUs, sem amplificadores ou equipamentos ativos intermediários. Reduz custo de implantação e manutenção. Variantes: GPON, XGS-PON, EPON.

### PPPoE
Point-to-Point Protocol over Ethernet. Protocolo de autenticação de clientes de banda larga sobre Ethernet. O cliente negocia uma sessão PPPoE com o BNG, autentica via RADIUS (usuário/senha) e recebe um endereço IP. Amplamente usado por ISPs brasileiros para autenticar clientes FTTH e ADSL.

---

## Q

### QoS
Quality of Service. Conjunto de mecanismos para classificar, marcar, priorizar e limitar tipos de tráfego em momentos de congestionamento. Garante que tráfego sensível (VoIP, videoconferência) seja entregue com baixa latência e jitter, em detrimento de tráfego bulk (downloads, backup).

---

## R

### RADIUS
Remote Authentication Dial-In User Service. Protocolo de AAA (UDP portas 1812/1813) usado por BNGs para validar credenciais de usuários PPPoE, aplicar perfis de banda, controlar tempo de sessão e registrar accounting. Implementações comuns: FreeRADIUS, Cisco ISE.

### RSTP
Rapid Spanning Tree Protocol (IEEE 802.1w). Evolução do STP com convergência muito mais rápida (segundos vs. 30–50 segundos do STP original). Introduz os estados de porta Discarding/Learning/Forwarding e os papéis Root/Designated/Alternate/Backup.

---

## S

### SNMP
Simple Network Management Protocol. Protocolo para monitoramento e gerenciamento de dispositivos de rede. Versões: v1 (obsoleta), v2c (mais usada, sem criptografia), v3 (com autenticação e criptografia). Usado por Zabbix, Grafana, Cacti e outras ferramentas de monitoramento.

### SSH
Secure Shell. Protocolo de acesso remoto seguro (TCP porta 22) que substituiu o Telnet. Fornece autenticação com senha ou chave pública/privada e criptografia de toda a sessão. Padrão obrigatório para gerenciamento de equipamentos de rede.

### STP
Spanning Tree Protocol (IEEE 802.1D). Protocolo que evita loops em redes com links redundantes, bloqueando automaticamente portas redundantes e mantendo uma topologia em árvore. Versões modernas: RSTP (802.1w) e MSTP (802.1s).

### Syslog
Protocolo padrão (RFC 5424) para envio de mensagens de log de dispositivos de rede para um servidor centralizado (UDP/TCP porta 514). Permite correlacionar eventos de múltiplos equipamentos. Servidores comuns: rsyslog, syslog-ng, Graylog.

---

## T

### Telnet
Protocolo de acesso remoto em texto plano (TCP porta 23). Transmite tudo sem criptografia, incluindo senhas. Deve ser desabilitado em favor do SSH em qualquer ambiente de produção. Ainda encontrado em equipamentos legados.

### Trunk
Porta de switch configurada para transportar múltiplas VLANs simultaneamente. As frames recebem a tag IEEE 802.1Q (4 bytes) ao sair pela porta trunk, identificando a qual VLAN pertencem. Conecta switches entre si ou switch a roteadores (router-on-a-stick).

---

## V

### VLAN
Virtual Local Area Network (IEEE 802.1Q). Segmentação lógica de uma rede física em redes separadas e isoladas. Identificada por uma tag de 12 bits, suportando até 4094 VLANs por domínio. Permite separar tráfego de clientes, gerência e serviços no mesmo hardware.

### VPLS
Virtual Private LAN Service. Serviço L2VPN baseado em MPLS que emula uma LAN (switch virtual) sobre uma rede IP/MPLS. Conecta sites remotos como se estivessem no mesmo switch Ethernet. Usa pseudowires para interconectar os PE routers dos diferentes sites.

### VRF
Virtual Routing and Forwarding. Instância de tabela de roteamento isolada dentro do mesmo roteador. Permite que múltiplos clientes com espaços de endereçamento sobrepostos (RFC 1918) coexistam no mesmo equipamento PE sem interferência mútua. Base das VPNs MPLS L3VPN.

### VXLAN
Virtual Extensible LAN. Encapsulamento de frames Ethernet dentro de pacotes UDP (porta 4789) para transportar L2 sobre L3. Suporta até 16 milhões de segmentos (VNI de 24 bits), vs. 4094 VLANs do 802.1Q. Padrão em redes de data center e nuvem.

---

## X

### XGS-PON
10-Gigabit Symmetric Passive Optical Network (ITU-T G.9807.1). Evolução do GPON com velocidade simétrica de 10 Gbps tanto no downstream quanto no upstream. Compatível com a infraestrutura óptica passiva existente (mesma fibra e splitters). Padrão crescente em novos deployments FTTH de alta capacidade.
