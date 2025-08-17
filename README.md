# CarrerPath — Plataforma de Desenvolvimento Profissional

Uma plataforma moderna para avaliação de perfis profissionais, recomendações de certificações e cards de perfil compartilháveis, desenvolvida com arquitetura MCP e tecnologias modernas.

## ✨ Funcionalidades Principais

### 🎨 **Interface Moderna**
- Design responsivo e elegante
- Tema claro/escuro
- Animações suaves e micro-interações
- Paleta de cores moderna

### 🤖 **Avaliação de Perfis GitHub**
- Análise completa de perfis profissionais
- Scoring numérico de 0-100
- Identificação de pontos fortes e fracos
- Recomendações personalizadas para melhoria

### 📚 **Sistema de Certificações**
- Recomendações baseadas em perfil e objetivos
- Algoritmo de scoring personalizado
- Exportação de planos de estudo em PDF
- Integração com IA para explicações detalhadas

### 🃏 **Profile Cards Compartilháveis**
- Criação de cards profissionais personalizáveis
- Upload de imagens (arquivos locais ou URLs)
- 5 temas de cores diferentes
- Sistema de skills com badges visuais
- Geração de PDFs profissionais
- Links públicos para compartilhamento

### 🚀 **Arquitetura Técnica**
- Backend: Cloudflare Workers + Deco MCP
- Frontend: React + TypeScript + Tailwind CSS
- Database: SQLite com Drizzle ORM
- State Management: TanStack Query
- Roteamento: TanStack Router

## 🏆 **Lab Prático Deco - Status**

### **✅ Checklist Completo (5/5 itens)**
- ✅ **Funcionalidade fim-a-fim** - Fluxo completo do usuário
- ✅ **Integração tipada (MCP)** - Tools e schemas tipados
- ✅ **Views operáveis** - Interface responsiva e moderna
- ✅ **Funcionalidade agêntica** - IA integrada
- ✅ **Qualidade da entrega** - Repo limpo e deploy ativo

---

## 🌐 **Aplicação Online**

### **Links de Acesso**
- **URL Principal**: https://carrerpath-app-2024.deco.page

## Demonstração / Pitch em Vídeo

Confira abaixo a demonstração em vídeo:

[Assista ao Pitch (YouTube)](https://www.youtube.com/watch?v=48kyhFBlaFQ)

### **Funcionalidades Disponíveis**
- ✅ Análise de perfis GitHub
- ✅ Recomendações de certificações
- ✅ Profile cards compartilháveis
- ✅ Upload de imagens
- ✅ Geração de PDFs
- ✅ Integração com IA
- ✅ Interface responsiva

---

## 🛠️ **Tecnologias**

### **Backend**
- Cloudflare Workers
- Deco Runtime (MCP)
- TypeScript
- SQLite + Drizzle ORM

### **Frontend**
- React + TypeScript
- Tailwind CSS
- TanStack Router
- TanStack Query
- jsPDF

### **Arquitetura**
- MCP (Model Context Protocol)
- RPC Tipado
- REST API
- File Upload
- PDF Generation

---

## 📁 **Estrutura do Projeto**

```
carrerpath/
├── server/                    # Backend MCP (Cloudflare Workers + Deco)
│   ├── main.ts               # Entry point do servidor MCP
│   ├── tools/                # MCP Tools - Funções expostas via protocolo
│   │   ├── index.ts          # Registry de todas as tools
│   │   ├── hello.ts          # Tool básica de teste
│   │   ├── certSearch.ts     # Busca de certificações
│   │   ├── certRecommend.ts  # Recomendações personalizadas
│   │   ├── githubEval.ts     # Análise de perfis GitHub
│   │   └── profileCard.ts    # CRUD de profile cards
│   ├── schemas.ts            # Schemas Zod para validação
│   ├── db-schema.ts          # Schema do banco SQLite
│   ├── db.ts                 # Conexão e utilitários do banco
│   ├── drizzle/              # Migrações automáticas do banco
│   ├── deco.gen.ts           # Tipos gerados automaticamente
│   └── wrangler.toml         # Configuração Cloudflare Workers
├── view/                     # Frontend React (Vite + Tailwind)
│   ├── src/
│   │   ├── main.tsx          # Entry point da aplicação React
│   │   ├── App.tsx           # Componente principal
│   │   ├── lib/
│   │   │   ├── rpc.ts        # Cliente RPC tipado
│   │   │   ├── profileCard.ts # Utilitários para profile cards
│   │   │   └── utils.ts      # Funções utilitárias
│   │   ├── components/
│   │   │   ├── ui/           # Componentes base (Button, Card, etc.)
│   │   │   ├── ProfileCard.tsx      # Componente de exibição
│   │   │   ├── ProfileCardForm.tsx  # Formulário de criação/edição
│   │   │   └── Footer.tsx    # Footer da aplicação
│   │   ├── routes/           # Páginas com TanStack Router
│   │   │   ├── home.tsx      # Página inicial
│   │   │   ├── profile-cards.tsx    # Gerenciamento de cards
│   │   │   └── profile.tsx   # Visualização individual
│   │   └── styles.css        # Estilos globais
│   ├── package.json          # Dependências do frontend
│   └── vite.config.ts        # Configuração Vite
├── package.json              # Workspace principal
└── README.md                 # Documentação
```

### **🔧 Arquitetura MCP (Model Context Protocol)**

O **MCP (Model Context Protocol)** é um protocolo que permite que aplicações exponham funcionalidades como **tools** tipadas e **workflows** orquestrados. No CarrerPath, utilizamos o MCP para:

#### **🎯 Tools MCP**
- **Funções independentes** que podem ser chamadas via protocolo
- **Tipagem completa** com TypeScript e Zod schemas
- **Validação robusta** de entrada e saída
- **Integração com IA** para automação

#### **🔄 Workflows MCP**
- **Orquestração** de múltiplas tools
- **Controle de fluxo** com operadores como `.then()`, `.parallel()`, `.branch()`
- **Processamento de dados** entre steps
- **Tratamento de erros** centralizado

#### **💡 Vantagens do MCP**
- **Reutilização**: Tools podem ser usadas por diferentes interfaces
- **Escalabilidade**: Fácil adição de novas funcionalidades
- **Type Safety**: Comunicação tipada entre frontend e backend
- **IA Integration**: Ferramentas podem ser usadas por agentes de IA

---

## 🚀 **Desenvolvimento**

### **📋 Pré-requisitos**
- **Node.js** ≥22.0.0
- **npm** ou **yarn**
- **Git**
- **Deco CLI** (instalado globalmente)

### **⚙️ Setup Inicial**

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/carrerpath.git
cd carrerpath

# 2. Instale dependências do workspace principal
npm install

# 3. Instale dependências do frontend
cd view
npm install

# 4. Volte para o diretório raiz
cd ..
```

### **🔧 Configuração**

```bash
# Configure o Deco CLI (se necessário)
deco login

# Configure variáveis de ambiente (se necessário)
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

### **▶️ Executando o Projeto**

#### **Desenvolvimento Local (Recomendado)**

```bash
# Terminal 1: Inicie o servidor MCP
npm run dev

# Terminal 2: Em outro terminal, inicie o frontend
cd view
npm run dev
```

**URLs de acesso:**
- **Frontend**: `http://localhost:4000`
- **Servidor MCP**: `http://localhost:8787`
- **API**: `http://localhost:8787/api/*`

#### **Build de Produção**

```bash
# Build do frontend
cd view
npm run build

# Deploy para produção
npm run deploy
```

### **🛠️ Comandos Disponíveis**

```bash
# Desenvolvimento
npm run dev          # Inicia servidor MCP local
npm run gen          # Gera tipos para integrações externas
npm run gen:self     # Gera tipos para suas próprias tools/workflows

# Build e Deploy
npm run build        # Build do projeto
npm run deploy       # Deploy para Cloudflare Workers

# Database
npm run db:generate  # Gera migrações do banco de dados

# Utilitários
npm run lint         # Verifica qualidade do código
npm run test         # Executa testes (se configurados)
```

### **🔍 Verificando se Está Funcionando**

1. **Frontend**: Acesse `http://localhost:4000` - deve carregar a interface
2. **Servidor MCP**: Acesse `http://localhost:8787` - deve retornar informações do servidor
3. **API de Recomendações**: Teste o formulário de certificações
4. **GitHub Analysis**: Teste com um username do GitHub
5. **Profile Cards**: Teste a criação e gerenciamento de cards
6. **IA Integration**: Teste a funcionalidade de explicações com IA

### **🚨 Troubleshooting Comum**

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

#### **Erro: "Database migration"**
```bash
# Gere as migrações do banco
npm run db:generate
```

---

## 🎯 **Futuras implmentações**

- [ ] Análise de perfis LinkedIn
- [ ] Templates de profile cards
- [ ] Sistema de reviews
- [ ] Marketplace de certificações
- [ ] Mentoria IA

---

## 🤝 **Contribuição**

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Abra um Pull Request

---

**CarrerPath** - Transformando o desenvolvimento profissional com tecnologia moderna.

**Ready to build your next professional development platform? [Get started now!](https://deco.chat)**