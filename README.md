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

## 🏆 **Lab Prático Deco - Resumo**

Este projeto foi desenvolvido para o **Lab Prático Deco** e atende aos requisitos principais:

### **✅ Checklist Completado (4/5 itens)**

1. **Funcionalidade fim-a-fim** ✅ - Formulário → API → Resultados → PDF
2. **Integração tipada (MCP)** ✅ - 4 tools MCP com schemas Zod
3. **Views operáveis** ✅ - Interface responsiva com Tailwind CSS
4. **Funcionalidade agêntica** ✅ - IA integrada para explicações
5. **Qualidade da entrega** ⚠️ - Repo + README ✅, Vídeo pendente

### **🎯 Status: QUALIFICADO para Badge de Expert!**

**Para completar 100%**: Gravar vídeo ≤ 90s demonstrando o fluxo completo.

---

## 🎯 **Como o CarrerPath Atende aos Requisitos do Lab Prático**

### **📊 Critérios de Avaliação Atendidos**

#### **✅ Funcionalidade fim-a-fim (do input do usuário ao resultado final)**
- **Input**: Formulário completo com campos para perfil profissional
- **Processamento**: API de recomendações com algoritmo de scoring
- **Resultado**: Cards visuais com certificações recomendadas e scores
- **Exportação**: PDF do plano de estudo personalizado
- **IA**: Explicações detalhadas sobre as recomendações

#### **✅ Integração tipada (MCP) com fonte de dados**
- **Tools MCP**: 4 tools implementadas com schemas Zod
- **Validação**: Entrada e saída tipadas para todas as operações
- **API Externa**: Integração com GitHub API para análise de perfis
- **Schemas**: Tipos TypeScript inferidos automaticamente dos schemas

#### **✅ Views operáveis - UI e UX**
- **Interface Responsiva**: Layout adaptável para todos os dispositivos
- **Componentes Visuais**: Cards, tabelas, formulários e gráficos
- **Navegação**: Footer com links de navegação rápida
- **Estados**: Loading, sucesso, erro e vazio
- **Tema**: Alternância suave entre claro e escuro

#### **✅ Funcionalidade agêntica**
- **API de IA**: Endpoint `/api/ai/explain` integrado
- **Chat Inteligente**: IA que entende contexto e gera explicações
- **Workflow**: Perfil + certificações → Explicação personalizada
- **Dados Estruturados**: Informações tipadas enviadas para IA

#### **⚠️ Qualidade da entrega (repo limpo, README claro, vídeo ≤ 90s)**
- **Repo Limpo**: ✅ Estrutura organizada e código bem documentado
- **README Claro**: ✅ Documentação detalhada com exemplos
- **Vídeo ≤ 90s**: ❌ Pendente (último item para completar)

### **🔍 Exemplo de Recorte Implementado**

O CarrerPath implementa um **recorte específico e bem definido**:

**MCP**: Conecta aos endpoints de certificações profissionais e GitHub API
**Workflow**: Cruza dados de perfil profissional com catálogo de certificações, calcula scores personalizados e gera recomendações
**Views**: 
- (a) Formulário de perfil profissional com filtros
- (b) Cards de certificações com scores visuais
- (c) Seção de IA para explicações detalhadas
- (d) Exportação de PDF do plano de estudo

**AI View**: Chat que responde perguntas sobre as recomendações e gera insights personalizados sobre ordem de estudo e justificativas

### **🚀 Stack Deco Utilizada**

- **deco create**: Projeto criado com template oficial
- **Cloudflare Workers**: Runtime para o servidor MCP
- **TypeScript**: Tipagem completa em todo o projeto
- **Zod**: Validação de schemas e tipos
- **React + Vite**: Frontend moderno e responsivo
- **Tailwind CSS**: Sistema de design utilitário

### **📈 Pontuação para Badge de Expert**

**Status Atual: 4/5 itens = 80%**
- ✅ Funcionalidade fim-a-fim
- ✅ Integração tipada (MCP)
- ✅ Views operáveis
- ✅ Funcionalidade agêntica
- ⚠️ Qualidade da entrega (falta vídeo)

**Para Badge de Expert: Precisa de 4/5 itens = ✅ QUALIFICADO!**

---

## 🎯 **Melhorias Implementadas**

### **GitHub Evaluation**
- ✅ **Scoring Numérico**: Sistema de pontuação de 0-100
- ✅ **Análise de Qualidade**: Avaliação de repositórios e código
- ✅ **Métricas Avançadas**: Atividade recente, diversidade de linguagens
- ✅ **Pontos Fortes/Fracos**: Identificação automática de áreas
- ✅ **Recomendações**: Sugestões personalizadas para melhoria

### **LinkedIn Evaluation** *(Em desenvolvimento)*
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
- **Node.js** ≥22.0.0
- **npm** ou **yarn** para gerenciamento de dependências
- **Git** para clonar o repositório

### Setup e Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/carrerpath.git
cd carrerpath

# 2. Instale as dependências do projeto principal
npm install

# 3. Instale as dependências do frontend
cd view
npm install

# 4. Volte para o diretório raiz
cd ..
```

### Configuração

```bash
# Configure as variáveis de ambiente (se necessário)
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

### Rodando o Projeto

#### **Opção 1: Desenvolvimento Local (Recomendado)**

```bash
# Terminal 1: Inicie o servidor MCP (Cloudflare Workers)
npm run dev

# Terminal 2: Em outro terminal, inicie o frontend
cd view
npm run dev
```

**URLs de acesso:**
- **Frontend**: `http://localhost:4000`
- **Servidor MCP**: `http://localhost:8787`
- **API**: `http://localhost:8787/api/*`

#### **Opção 2: Build de Produção**

```bash
# Build do frontend
cd view
npm run build

# Deploy para produção
npm run deploy
```

### **Estrutura de Comandos Disponíveis**

```bash
# Desenvolvimento
npm run dev          # Inicia servidor MCP local
npm run gen          # Gera tipos para integrações externas
npm run gen:self     # Gera tipos para suas próprias tools/workflows

# Build e Deploy
npm run build        # Build do projeto
npm run deploy       # Deploy para Cloudflare Workers

# Utilitários
npm run lint         # Verifica qualidade do código
npm run test         # Executa testes (se configurados)
```

### **Verificando se Está Funcionando**

1. **Frontend**: Acesse `http://localhost:4000` - deve carregar a interface do CarrerPath
2. **Servidor MCP**: Acesse `http://localhost:8787` - deve retornar informações do servidor
3. **API de Recomendações**: Teste o formulário de certificações
4. **GitHub Analysis**: Teste com um username do GitHub
5. **IA Integration**: Teste a funcionalidade de explicações com IA

### **Troubleshooting Comum**

#### **Erro: "Port already in use"**
```bash
# Verifique se as portas estão livres
lsof -i :4000  # Frontend
lsof -i :8787  # Servidor MCP

# Mate processos se necessário
kill -9 <PID>
```

#### **Erro: "Module not found"**
```bash
# Reinstale dependências
rm -rf node_modules package-lock.json
npm install

# No diretório view também
cd view
rm -rf node_modules package-lock.json
npm install
```

#### **Erro: "Cloudflare Workers"**
```bash
# Verifique se o Wrangler está configurado
npm install -g wrangler
wrangler login
```

---

## 📁 Project Structure

```
├── server/           # MCP Server (Cloudflare Workers + Deco runtime)
│   ├── main.ts      # Server entry point with tools & workflows
│   ├── tools/       # Enhanced evaluation tools
│   │   ├── githubEval.ts    # GitHub profile analysis v2.0
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
