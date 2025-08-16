/**
 * This is the main entry point for your application and
 * MCP server. This is a Cloudflare workers app, and serves
 * both your MCP server at /mcp and your views as a react
 * application at /.
 */
import { DefaultEnv, withRuntime } from "@deco/workers-runtime";
import { type Env as DecoEnv, StateSchema } from "./deco.gen.ts";
import { tools } from "./tools/index.ts";
import { workflows } from "./workflows.ts";
import { RecommendationResponseSchema, UserProfileSchema } from "./schemas.ts";
import createCertRecommendTool from "./tools/certRecommend.ts";

/**
 * This Env type is the main context object that is passed to
 * all of your Application.
 */
export type Env = DefaultEnv & DecoEnv & {
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
};

// (Removido) Workflows via ctx; vamos instanciar diretamente quando necessário.

/**
 * Handles the /api/recommend endpoint logic.
 */
async function handleRecommend(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }
  try {
    const body = await request.json();
    // Accept either { role, seniority, ... } or { profile: { ... } }
    const rawProfile = (body && body.profile) ? body.profile : body;
    const profile = UserProfileSchema.parse(rawProfile);

    // Usa a Tool MCP tipada para gerar recomendações
    const recommendTool = createCertRecommendTool(env);
    const result = await (recommendTool as any).execute({ context: profile });
    return Response.json(result);
  } catch (error) {
    // Provide clearer validation feedback
    if (error && typeof error === "object" && "issues" in (error as any)) {
      return new Response(
        JSON.stringify({ error: "ValidationError", details: (error as any).issues }),
        { status: 422, headers: { "Content-Type": "application/json" } },
      );
    }
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    const name = (error as any)?.name || "Error";
    const stack = (error as any)?.stack || undefined;
    return new Response(
      JSON.stringify({ error: message, name, stack }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
}

/**
 * Handles the /api/ai/explain endpoint logic.
 */
async function handleAiExplain(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }
  try {
    const body = await request.json();
    const profile = UserProfileSchema.parse(body.profile);
    const rec = RecommendationResponseSchema.parse(body.recommendations);
    const question = (body.question as string | undefined) || "";

    const context = `
Perfil:
- Cargo: ${profile.role}
- Senioridade: ${profile.seniority}
- Área-alvo: ${profile.targetArea || "-"}
- Metas: ${(profile.goals || []).join(", ") || "-"}

Top recomendações:
${rec.items.map((it, i) =>
  `${i + 1}. ${it.certification.name} (${it.certification.provider}, ${it.certification.level}${it.certification.area ? `, ${it.certification.area}` : ""}) — Score ${it.score}
   Motivos: ${it.reasons.join("; ")}`
).join("\n")}
`.trim();

    const prompt = `
Você é um assistente de carreira. Explique de forma objetiva POR QUE essas certificações foram recomendadas para o perfil abaixo, sugira ordem de estudo (1→3) e riscos/atalhos. 
Se houver pergunta do usuário, responda no final em até 5 linhas.
${question ? `\nPergunta do usuário: ${question}\n` : ""}

Contexto:
${context}
      `.trim();

    const resp = await env.DECO_CHAT_WORKSPACE_API.AI_GENERATE({
      messages: [{ role: "user", content: prompt }],
      maxTokens: 400,
      temperature: 0.3,
    });

    return Response.json({ answer: resp.text });
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(JSON.stringify({ error: message }), { status: 400, headers: { "Content-Type": "application/json" } });
  }
}

/**
 * Main fetch handler that acts as a router.
 */
const fetchHandler = (
  req: Request,
  env: Env,
): Promise<Response> => {
  const url = new URL(req.url);

  // API Router
  if (url.pathname === "/api/recommend") {
    return handleRecommend(req, env);
  }
  if (url.pathname === "/api/ai/explain") {
    return handleAiExplain(req, env);
  }

  // Fallback to serving the React frontend
  const LOCAL_URL = "http://localhost:4000";
  const useDevServer = (req.headers.get("origin") || req.headers.get("host"))
    ?.includes("localhost");

  const request = new Request(
    useDevServer
      ? new URL(`${url.pathname}${url.search}`, LOCAL_URL)
      : new URL("/", req.url),
    req,
  );

  return useDevServer ? fetch(request) : env.ASSETS.fetch(request);
};

const runtime = withRuntime<Env, typeof StateSchema>({
  oauth: {
    scopes: ["AI_GENERATE", "AI_GENERATE_OBJECT"],
    state: StateSchema,
  },
  workflows,
  tools,
  fetch: fetchHandler,
});

export const Workflow = runtime.Workflow;
export default runtime;
