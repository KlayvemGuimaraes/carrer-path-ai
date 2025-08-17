# CarrerPath — Plataforma de Desenvolvimento Profissional

Uma plataforma moderna e elegante para avaliação de perfis profissionais, recomendações de certificações e planejamento de carreira, inspirada no design da LoVable e Vercel.

## ✨ Features Principais

### 🎨 **UI/UX Moderna**
- **Design Inspirado na LoVable/Vercel**: Interface limpa, minimalista e profissional
- **Paleta de Cores Moderna**: Gradientes sutis, glass morphism e animações fluidas
- **Responsivo**: Layout adaptável para todos os dispositivos
- **Tipografia Elegante**: Fonte Inter para máxima legibilidade
- **Animações Suaves**: Transições e micro-interações para melhor experiência
- **Footer Profissional**: Links para redes sociais e navegação rápida

### 🤖 **Avaliação de Perfis**
- **GitHub Profile Analysis**: 
  - Scoring numérico de 0-100
  - Análise de repositórios, linguagens e atividade
  - Identificação de pontos fortes e fracos
  - Recomendações personalizadas para melhoria
  - Métricas de qualidade do código e contribuições

- **LinkedIn Profile Analysis**:
  - Avaliação completa de perfis profissionais
  - Análise de experiências, educação e habilidades
  - Detecção automática de senioridade
  - Scoring baseado em completude e qualidade
  - Recomendações para otimização do perfil

### 📚 **Sistema de Certificações**
- **Recomendações Inteligentes**: Baseadas em perfil, objetivos e orçamento
- **Scoring Avançado**: Algoritmo que considera múltiplos fatores
- **Exportação PDF**: Geração automática de planos de estudo
- **Integração com IA**: Explicações e insights personalizados

### 🚀 **Arquitetura Técnica**
- **MCP Server**: Cloudflare Workers com tools tipadas
- **Frontend React**: Vite + Tailwind CSS + TypeScript
- **RPC Tipado**: Comunicação segura entre frontend e backend
- **Hot Reload**: Desenvolvimento com recarregamento automático

## 🎯 **Melhorias Implementadas**

### **GitHub Evaluation v2.0**
- ✅ **Scoring Numérico**: Sistema de pontuação de 0-100
- ✅ **Análise de Qualidade**: Avaliação de repositórios e código
- ✅ **Métricas Avançadas**: Atividade recente, diversidade de linguagens
- ✅ **Pontos Fortes/Fracos**: Identificação automática de áreas
- ✅ **Recomendações**: Sugestões personalizadas para melhoria

### **LinkedIn Evaluation v2.0** *(Em desenvolvimento)*
- 🔄 **Scraping Aprimorado**: Múltiplas estratégias de parsing
- 🔄 **Análise Completa**: Experiências, educação, habilidades
- 🔄 **Detecção de Senioridade**: IA para identificar nível profissional
- 🔄 **Scoring Inteligente**: Baseado em completude e qualidade
- 🔄 **Recomendações Profissionais**: Sugestões para otimização

### **UI/UX Moderna**
- ✅ **Design System**: Paleta de cores inspirada na LoVable/Vercel
- ✅ **Glass Morphism**: Efeitos visuais modernos e elegantes
- ✅ **Animações**: Transições suaves e micro-interações
- ✅ **Responsividade**: Layout adaptável para todos os dispositivos
- ✅ **Tipografia**: Fonte Inter para máxima legibilidade
- ✅ **Footer Profissional**: Links para redes sociais e navegação rápida

## 🚀 Quick Start

### Prerequisites
- Node.js ≥22.0.0
- [Deco CLI](https://deco.chat): `npm i -g deco-cli`

### Setup
```bash
# Install dependencies
npm install

# Configure your app
npm run configure

# Start development server
npm run dev
```

O servidor sobe em `http://localhost:8787` (API/MCP) e o front em `http://localhost:4000`.

## 📁 Project Structure

```
├── server/           # MCP Server (Cloudflare Workers + Deco runtime)
│   ├── main.ts      # Server entry point with tools & workflows
│   ├── tools/       # Enhanced evaluation tools
│   │   ├── githubEval.ts    # GitHub profile analysis v2.0
│   │   └── linkedinEval.ts  # LinkedIn profile analysis v2.0
│   └── deco.gen.ts  # Auto-generated integration types
└── view/            # React Frontend (Vite + Tailwind CSS)
    ├── src/
    │   ├── App.tsx          # Main application with modern UI
    │   ├── styles.css       # Enhanced CSS with animations
    │   ├── lib/rpc.ts       # Typed RPC client
    │   └── routes/          # TanStack Router routes
    └── tailwind.config.js   # Tailwind configuration
```

## 🛠️ Development Workflow

- **`npm run dev`** - Start development with hot reload
- **`npm run gen`** - Generate types for external integrations
- **`npm run gen:self`** - Generate types for your own tools/workflows
- **`npm run deploy`** - Deploy to production

## 🔍 **Funcionalidades Detalhadas**

### **GitHub Profile Analysis**
O sistema analisa perfis GitHub considerando:
- **Completude do Perfil** (0-20 pts): Nome, bio, empresa, localização
- **Prova Social** (0-25 pts): Seguidores, alcance da comunidade
- **Atividade de Repositórios** (0-30 pts): Quantidade e qualidade
- **Qualidade do Código** (0-15 pts): Estrelas, forks, manutenção
- **Diversidade de Linguagens** (0-10 pts): Múltiplas tecnologias

### **GitHub Profile Analysis**
Avaliação de perfis GitHub considerando:
- **Completude do Perfil** (0-20 pts): Nome, bio, empresa, localização
- **Prova Social** (0-25 pts): Seguidores, alcance da comunidade
- **Atividade de Repositórios** (0-30 pts): Quantidade e qualidade
- **Qualidade do Código** (0-15 pts): Estrelas, forks, manutenção
- **Diversidade de Linguagens** (0-10 pts): Múltiplas tecnologias

### **LinkedIn Profile Analysis** *(Em desenvolvimento)*
Avaliação profissional baseada em:
- **Completude do Perfil** (0-25 pts): Nome, headline, resumo
- **Seção de Experiências** (0-30 pts): Quantidade e detalhamento
- **Formação Educacional** (0-15 pts): Instituições e diplomas
- **Habilidades e Endossos** (0-20 pts): Competências e validação
- **Qualidade dos Dados** (0-10 pts): Atualização e precisão

### **Sistema de Recomendações**
- **Algoritmo Inteligente**: Considera múltiplos fatores para scoring
- **Personalização**: Baseado em objetivos e contexto profissional
- **IA Integrada**: Explicações e insights personalizados
- **Exportação**: Planos de estudo em PDF

### **Footer e Navegação**
- **Links para Redes Sociais**: GitHub, LinkedIn e site pessoal com ícones
- **Navegação Rápida**: Links internos para todas as funcionalidades
- **Design Responsivo**: Adaptável para todos os dispositivos
- **Integração Visual**: Consistente com o design system da aplicação

## 🎨 **Design System**

### **Paleta de Cores**
- **Primária**: Azul moderno com gradientes sutis
- **Secundária**: Tons de slate para elementos neutros
- **Acentos**: Verde para sucessos, laranja para melhorias
- **Backgrounds**: Gradientes suaves e glass morphism

### **Tipografia**
- **Fonte Principal**: Inter (Google Fonts)
- **Hierarquia**: Tamanhos consistentes e espaçamento generoso
- **Legibilidade**: Alto contraste e tamanhos adequados

### **Componentes**
- **Cards**: Glass morphism com bordas sutis
- **Botões**: Gradientes e hover effects
- **Inputs**: Bordas arredondadas e focus states
- **Animações**: Transições suaves e micro-interações

## 🧪 **Testando as Funcionalidades**

### **GitHub Evaluation**
1. Insira uma URL do GitHub (ex: `https://github.com/torvalds`)
2. Clique em "Avaliar"
3. Visualize o score, pontos fortes/fracos e recomendações

### **LinkedIn Evaluation** *(Em desenvolvimento)*
*Funcionalidade em desenvolvimento - em breve você poderá avaliar perfis do LinkedIn*

### **Certificações**
1. Preencha o formulário com seus dados
2. Receba recomendações personalizadas
3. Exporte seu plano de estudo em PDF
4. Use a IA para explicações adicionais

### **Navegação e Footer**
1. Use os links do footer para navegar rapidamente pelas seções
2. Acesse suas redes sociais e site pessoal através dos ícones
3. Explore as funcionalidades através dos links de navegação rápida

## 🚀 **Deploy**

```bash
# Deploy to Cloudflare Workers
npm run deploy
```

A aplicação fica disponível em URL pública e pode ser usada como servidor MCP por agentes de IA.

## 🔗 **Integrações**

- **GitHub API**: Análise de perfis e repositórios
- **LinkedIn Scraping**: *(Em desenvolvimento)* Avaliação de perfis profissionais
- **IA Integration**: Explicações e insights personalizados
- **PDF Generation**: Exportação de planos de estudo
- **Redes Sociais**: Links diretos para GitHub, LinkedIn e site pessoal
- **Navegação por Âncoras**: Sistema de navegação interna otimizado

## 📚 **Tecnologias Utilizadas**

- **Backend**: Cloudflare Workers, Deco Runtime, TypeScript
- **Frontend**: React, Vite, Tailwind CSS, TypeScript
- **RPC**: TanStack Query, TypeScript RPC
- **Design**: Glass morphism, gradientes, animações CSS
- **Deploy**: Cloudflare Workers, Deco Platform
- **Componentes**: Footer responsivo, navegação por âncoras, ícones SVG

## 🎯 **Roadmap Futuro**

- [ ] **Análise de Portfólios**: Avaliação de sites e projetos
- [ ] **Comparação de Perfis**: Benchmarking entre profissionais
- [ ] **Marketplace de Certificações**: Integração com provedores
- [ ] **Mentoria IA**: Coaching personalizado para carreira
- [ ] **Analytics Avançado**: Métricas de evolução profissional
- [ ] **Integração com Redes Sociais**: Conectividade com LinkedIn, GitHub e outros
- [ ] **Sistema de Notificações**: Alertas sobre novas certificações e oportunidades

## 🤝 **Contribuição**

Contribuições são bem-vindas! Por favor:
1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para detalhes.

---

**CarrerPath** - Transformando o desenvolvimento profissional com tecnologia moderna e design elegante.

**Ready to build your next professional development platform? [Get started now!](https://deco.chat)**
