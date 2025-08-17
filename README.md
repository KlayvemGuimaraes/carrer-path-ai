# CarrerPath — Recomendações de Certificações (MCP + View Agêntica)

Mini‑app full‑stack usando MCP tipado (Deco + Cloudflare Workers) e React/Vite.
Entrega voltada ao Lab Prático (15/08, 10h–16h BRT) e ao Badge de Expert.

## ✨ Features

- **🤖 MCP Server**: Cloudflare Workers-based server with typed tools and
  workflows
- **⚛️ React Frontend**: Modern React app with Vite, TanStack Router, and
  Tailwind CSS
- **🎨 UI Components**: Pre-configured shadcn/ui components for rapid
  development
- **🔧 Type Safety**: Full TypeScript support with auto-generated RPC client
  types
- **🚀 Hot Reload**: Live development with automatic rebuilding for both
  frontend and backend
- **☁️ Ready to Deploy**: One-command deployment to Cloudflare Workers

## 🎯 Objetivo do Lab

- Construir, publicar e demonstrar um mini‑app com dados públicos ou tema livre.
- Entrega “fim‑a‑fim”: input do usuário → MCP tipado → View → funcionalidade agêntica.
- Vídeo curto (≤ 90s), README claro, repo limpo.

Este projeto escolhe a opção B (Tema Livre): recomendações de certificações.

Checklist (Sim/Não):
- __Funcionalidade fim‑a‑fim__: Sim
- __Integração tipada (MCP)__: Sim (Tool `CERT_RECOMMEND`)
- __Views operáveis (UI/UX)__: Sim
- __Funcionalidade agêntica__: Sim, com fallback local quando IA indisponível
- __Qualidade da entrega__: Sim (README, setup, vídeo pendente)

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
│   └── deco.gen.ts  # Auto-generated integration types
└── view/            # React Frontend (Vite + Tailwind CSS)
    ├── src/
    │   ├── lib/rpc.ts    # Typed RPC client for server communication
    │   ├── routes/       # TanStack Router routes
    │   └── components/   # UI components with Tailwind CSS
    └── package.json
```

## 🛠️ Development Workflow

- **`npm run dev`** - Start development with hot reload
- **`npm run gen`** - Generate types for external integrations
- **`npm run gen:self`** - Generate types for your own tools/workflows
- **`npm run deploy`** - Deploy to production

## 🧪 Project — CarrerPath (This Repo)

### How to Run Locally

```bash
# Terminal 1: backend (Cloudflare Workers via Wrangler)
npm --prefix server run dev

# Terminal 2: frontend (Vite)
npm --prefix view run dev
```

- Backend on http://localhost:8787
- Frontend on http://localhost:4000 (proxy /api/* → 8787)

If port 8787 is busy on Windows:

```
netstat -ano | findstr :8787
taskkill /PID <PID> /F
```

### Endpoints

- `POST /api/recommend` — recomendações via Tool MCP tipada (`CERT_RECOMMEND`)
  - Input: `UserProfile` (`role`, `seniority`, `targetArea?`, `goals[]`, `budgetUSD?`)
  - Output: `{ items: { certification, score, reasons }[] }`
- `POST /api/ai/explain` — explicação por IA (usa `DECO_CHAT_WORKSPACE_API`)
  - Se a IA falhar (créditos/permissionamento), retornamos fallback determinístico
    com `meta: { ai: "unavailable", reference }`.

### Architecture

- __Server__
  - `server/main.ts` — Router (`/api/recommend`, `/api/ai/explain`) e fallback de IA
  - `server/tools/certRecommend.ts` — Tool MCP `CERT_RECOMMEND` (tipada)
    - helper tipado `runCertRecommend(env, profile)` (evita casts)
    - logs estruturados: `[CERT_RECOMMEND] role=... area=... top=... ms=...`
  - `server/util/catalog.ts` — carregamento/validação do catálogo
  - `server/util/scoring.ts` — função `scoreCertification()` (pesos abaixo)
  - `server/schemas.ts` — Schemas Zod (tipagem de ponta a ponta)
- __Frontend__
  - `view/src/App.tsx` — formulário, top recomendações, botão “Explicar com IA”
  - Proxy Vite → `/api/*`

## 🔎 MCP — Como foi aplicado

- Tool MCP tipada `CERT_RECOMMEND` (input: `UserProfile`, output: `RecommendationResponse`).
- O endpoint `/api/recommend` chama a Tool via helper `runCertRecommend()`.
- Workflows estão registrados em `server/workflows.ts` (demonstração do padrão `createStepFromTool`).

## 🧠 Scoring (regras atuais)

- __Área‑alvo__: +40
- __Cargo__: +35
- __Metas (`goals`)__: até +25 (5 pontos por match, máx 5)
- __Senioridade__: +20 iniciante/júnior, +15 pleno, +20 avançado/sênior
- __Orçamento__: +5 (dentro) / −5 (acima)

Motivos retornados em `reasons` são exibidos na UI.

## 📚 Catálogo

Arquivo: `server/data/certifications.json`. Cobre Cloud (AWS/Azure/GCP), Segurança
(Security+/PenTest+/CISSP/CEH/AZ‑500), Redes (CCNA/Network+), Dev/DevOps (CKA/Terraform),
Gestão (CAPM/PSM I), Dados/BI/ML (PL‑300/DP‑203/GCP PDE/AWS DA Specialty/AWS ML Specialty/AI‑102/TF Dev).

## 🧪 Testar localmente (fluxo)

1) `npm --prefix server run dev` (http://localhost:8787)
2) `npm --prefix view run dev` (http://localhost:4000)
3) Preencha o formulário, clique “Recomendar”.
4) Clique “Explicar recomendações com IA”.
   - Se IA indisponível, verá resposta de fallback e `meta.ai = "unavailable"`.

## 🚀 Deploy

- Cloudflare Workers via Wrangler (backend) e Vite (frontend).
- Scripts:
  - `npm run deploy` (template base)
  - ou pipelines CI/CD conforme seu fork.

## 🎥 Vídeo (≤ 90s)

- Mostre: preenchimento do formulário → recomendações → explicação com IA/fallback → valor pro usuário.
- Sugestão de roteiro: 20s app, 20s MCP, 20s scoring, 20s IA/fallback e call‑to‑action.

## 📦 Entrega (para o formulário)

- Link do app (deco.page/… ou URL do seu deploy)
- Link do repositório (este)
- Link do vídeo curto (≤ 90s)

## 🔗 Frontend ↔ Server Communication

The template includes a fully-typed RPC client that connects your React frontend
to your MCP server:

```typescript
// Typed calls to your server tools and workflows
const result = await client.MY_TOOL({ input: "data" });
const workflowResult = await client.MY_WORKFLOW({ input: "data" });
```

## 📖 Learn More

This template is built for deploying primarily on top of the
[Deco platform](https://deco.chat/about) which can be found at the
[deco-cx/chat](https://github.com/deco-cx/chat) repository.

Documentation can be found at [https://docs.deco.page](https://docs.deco.page)

---

**Ready to build your next MCP server with a beautiful frontend?
[Get started now!](https://deco.chat)**
