# AbaDesk - Interface Web (Frontend)

Bem-vindo ao repositório frontend do AbaDesk. Esta é a interface visual SPA (Single Page Application) com a qual administradores, equipe de suporte e usuários finais interagem. A plataforma foca numa experiência de usuário moderna, fluida e extremamente eficiente.

## Visão Geral do Projeto

A interface do AbaDesk quebra os moldes tradicionais de sistemas de chamados maçantes e burocráticos, introduzindo um design de altíssima qualidade, limpo e direto ao ponto. Ele foi pensado para se adequar a diferentes perfis operacionais:
- Usuários finais possuem uma visão simplificada, orientada e amigável.
- Administradores e o time de suporte usufruem de visões enriquecidas com métricas detalhadas (organizadas no padrão gráfico tridimensional do logotipo da marca AbaDesk), modo Kanban para fluxos contínuos e controle tático dos casos.

## Stack Tecnológico

O desenvolvimento deste cliente web foi pautado pela escolha de tecnologias ágeis, robustas e focadas em alta responsividade:

- React.js: Biblioteca declarativa para a construção de uma interface de usuário modular baseada em componentes.
- Vite: Ferramenta de build de nova geração, proporcionando compilação super-rápida.
- Tailwind CSS: Framework utilitário de CSS que permitiu a construção do design sistêmico customizado, animações fluidas e estilização de alto nível, livre de bibliotecas de componentes engessadas.
- Zustand: Gerenciamento de estado global leve e sem complicações (utilizado primariamente para os dados persistentes da sessão do usuário autenticado).
- Framer Motion: Biblioteca poderosa para animações complexas, responsável pelas transições suaves de tela, progresso de steps e efeitos de hover avançados.
- Axios: Cliente HTTP centralizado com interceptadores, realizando a comunicação assíncrona autenticada (via JWT) com a API Backend.
- React Router DOM: Roteamento dinâmico, proteção de rotas privadas no cliente e navegação SPA.
- Material Symbols Outlined: Biblioteca iconográfica minimalista empregada para entregar uma aparência premium.

## Funcionalidades em Destaque

- Dashboard Dinâmico com SVG Customizado: Um painel inovador construído não com grids comuns, mas sim organizando dados vitais dentro de formas SVG poligonais (pétalas) idênticas à logomarca da empresa, com micro-animações programadas na interação.
- Visões Duplas (Painel Kanban e Lista): Total flexibilidade para o time de suporte operar tanto em uma visualização Kanban (baseada no Workflow de desenvolvimento) quanto no formato clássico de tabela.
- Navegação Segura por Perfil (Guards): Sistema de autorização de interface que exibe e restringe abas de administração ou recursos avançados dependendo se o usuário possui cargo de Admin, Support ou User.
- Modais Nativos Desenhados sob Medida: Sem uso de alertas pesados ou plugins. Todos os pontos de ação crítica (confirmações de exclusão, aprovações de homologação e atualizações do chamado) invocam um modal de fundo desfocado super rápido criado puramente com React + Tailwind.
- Workflow Visual Ativo: Componente de Stepper que preenche interativamente seu status de progresso dentro da página de detalhes do chamado, oferecendo previsibilidade de ponta a ponta.

## Instruções de Instalação e Execução

### Pré-requisitos
- Node.js (versão 18 ou superior).
- NPM ou Yarn instalados.

### Inicializando a Aplicação

1. Clone ou faça download deste repositório em sua máquina.
2. Abra o terminal na pasta raiz e instale as dependências:
   ```bash
   npm install
   ```
3. É imprescindível que a API Backend do AbaDesk esteja sendo executada simultaneamente. Por padrão, os serviços frontend estão apontando para o servidor local (essa configuração pode ser alterada nas instâncias do Axios na pasta `api`).
4. Inicie a visualização no ambiente de desenvolvimento:
   ```bash
   npm run dev
   ```

O console exibirá o endereço (normalmente `http://localhost:5173/`). Acesse a URL no navegador de sua preferência.

### Acesso Inicial
Utilize os dados padrão estabelecidos pela API (Seeder) para ingressar com a conta administrativa e experimentar as capacidades completas da interface.
