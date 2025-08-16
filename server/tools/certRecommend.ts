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
    const catalog = await loadCatalog();

    const scored = catalog.map(c => {
      const { score, reasons } = scoreCertification(c, context);
      return { certification: c, score, reasons };
    });

    const items = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    return { items } satisfies RecommendationResponse;
  },
});

export default createCertRecommendTool;
