import { createTool } from "@deco/workers-runtime/mastra";
import { z } from "zod";
import { CertificationSchema } from "../schemas.ts";
import { loadCatalog } from "../util/catalog.ts";
import type { Env } from "../main.ts";

/**
 * @module CERT_SEARCH
 * @description A tool to search and filter professional certifications.
 */

const inputSchema = z.object({
  area: z.string().optional().describe("Filter by area of expertise (e.g., 'Cloud', 'Security')."),
  level: z.enum(["iniciante", "intermediario", "avancado"]).optional().describe("Filter by certification level."),
  role: z.string().optional().describe("Filter by professional role (e.g., 'Developer', 'Architect')."),
  query: z.string().optional().describe("Free-text search in name, provider, or skills."),
  limit: z.number().min(1).max(100).default(20).optional().describe("Limit the number of results."),
});

const outputSchema = z.object({
  items: z.array(CertificationSchema).describe("A list of matching certifications."),
});

const createCertSearchTool = (env: Env) => createTool({
  id: "CERT_SEARCH",
  description: "Searches for certifications based on filters (area, level, role, query).",
  inputSchema,
  outputSchema,
  execute: async ({ context }) => {
    const catalog = await loadCatalog();
    let items = catalog;

    if (context.area) {
      items = items.filter(c => (c.area || "").toLowerCase() === context.area!.toLowerCase());
    }
    if (context.level) {
      items = items.filter(c => c.level === context.level);
    }
    if (context.role) {
      items = items.filter(c => c.roles.map(r => r.toLowerCase()).includes(context.role!.toLowerCase()));
    }
    if (context.query) {
      const q = context.query.toLowerCase();
      items = items.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.provider.toLowerCase().includes(q) ||
        (c.skills || []).some(s => s.toLowerCase().includes(q))
      );
    }

    if (context.limit) {
      items = items.slice(0, context.limit);
    }

    return { items };
  },
});

export default createCertSearchTool;
