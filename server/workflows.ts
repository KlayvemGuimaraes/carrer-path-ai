import { createWorkflow, createStepFromTool } from "@deco/workers-runtime/mastra";
import { UserProfileSchema, RecommendationResponseSchema } from "./schemas.ts";
import createCertRecommendTool from "./tools/certRecommend.ts";
import type { Env } from "./main.ts";

/**
 * Workflow que:
 *  1) recebe um perfil,
 *  2) chama a tool CERT_RECOMMEND,
 *  3) devolve as recomendações.
 *
 *  Este workflow demonstra o padrão recomendado de usar `createStepFromTool`
 *  e `.then()` para orquestrar a execução de tools.
 */
export const createRecommendForProfileWorkflow = (env: Env) => {
  // Cria um "passo" a partir da factory function da tool.
  // O `env` é passado para a factory para que a tool seja instanciada corretamente.
  const recommendStep = createStepFromTool(createCertRecommendTool(env));

  return createWorkflow({
    id: "RECOMMEND_FOR_PROFILE",
    inputSchema: UserProfileSchema,
    outputSchema: RecommendationResponseSchema,
  })
  // Executa o passo, passando o input do workflow para a tool.
  .then(recommendStep)
  // Finaliza a definição do workflow.
  .commit();
};


export const workflows = [createRecommendForProfileWorkflow];
