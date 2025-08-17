import { createTool } from "@deco/workers-runtime/mastra";
import { z } from "zod";
import { UserProfileSchema, RecommendationResponseSchema, type RecommendationResponse } from "../schemas.ts";
import { loadCatalog } from "../util/catalog.ts";
import { scoreCertification } from "../util/scoring.ts";

/**
 * @module CERT_RECOMMEND
 * @description A tool to recommend certifications based on a user's professional profile.
 */

import type { Env } from "../main.ts";

const createCertRecommendTool = (env: Env) => createTool({
  id: "CERT_RECOMMEND",
  description: "Generates scored certification recommendations for a professional profile.",
  inputSchema: UserProfileSchema,
  outputSchema: RecommendationResponseSchema,
  execute: async ({ context }) => {
    const t0 = Date.now();
    const catalog = await loadCatalog();

    const scored = catalog.map(c => {
      const { score, reasons } = scoreCertification(c, context);
      return { certification: c, score, reasons };
    });

    const items = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    // logging resumido
    try {
      const role = context.role;
      const area = context.targetArea;
      const goals = (context.goals || []).slice(0, 3).join(",");
      const top = items.map(i => i.certification.id).join(",");
      console.log(`[CERT_RECOMMEND] role=${role} area=${area} goals=${goals} top=${top} ms=${Date.now()-t0}`);
    } catch { /* noop */ }

    return { items } satisfies RecommendationResponse;
  },
});

export default createCertRecommendTool;

// Typed helper to run the tool without casts at call sites
export async function runCertRecommend(env: Env, profile: z.infer<typeof UserProfileSchema>) {
  const tool = createCertRecommendTool(env);
  // Note: the underlying tool runtime may pass a second runtimeContext arg; it's ignored here.
  const result = await (tool as any).execute({ context: profile });
  return result as RecommendationResponse;
}
