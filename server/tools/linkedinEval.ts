import { createTool } from "@deco/workers-runtime/mastra";
import { z } from "zod";
import type { Env } from "../main.ts";

const inputSchema = z.object({
  url: z.string().url().describe("LinkedIn public profile URL (e.g., https://www.linkedin.com/in/username/)"),
});

const expSchema = z.object({
  title: z.string().optional(),
  company: z.string().optional(),
  period: z.string().optional(),
});

const outputSchema = z.object({
  profileUrl: z.string().url(),
  name: z.string().optional(),
  headline: z.string().optional(),
  about: z.string().optional(),
  experiences: z.array(expSchema),
  inferredSeniority: z.string().optional(),
  strengths: z.array(z.string()).default([]),
  weaknesses: z.array(z.string()).default([]),
  score: z.number().int().min(0).max(100),
  assessment: z.string(),
  meta: z.object({ fetched: z.boolean(), status: z.number().optional() }).optional(),
});

function clean(text?: string | null): string | undefined {
  if (!text) return undefined;
  return text.replace(/\s+/g, " ").trim();
}

function inferSeniorityFromHeadline(headline?: string): string | undefined {
  if (!headline) return undefined;
  const h = headline.toLowerCase();
  if (/senior|sr\b|sênior/.test(h)) return "senior";
  if (/pleno|mid|\bss\b/.test(h)) return "pleno";
  if (/junior|jr\b/.test(h)) return "junior";
  return undefined;
}

const createLinkedInEvalTool = (env: Env) => createTool({
  id: "LINKEDIN_EVAL",
  description: "Avalia um perfil público do LinkedIn a partir da URL, retornando dados básicos e uma análise heurística.",
  inputSchema,
  outputSchema,
  execute: async ({ context }) => {
    const profileUrl = context.url.trim();

    // Nota: LinkedIn frequentemente bloqueia scraping anônimo (403).
    // Implementamos um fetch best-effort e um fallback heurístico se falhar.
    let html = "";
    let fetched = false;
    let status: number | undefined = undefined;
    try {
      const res = await fetch(profileUrl, {
        headers: {
          "User-Agent": "careerpath-app",
          "Accept": "text/html,application/xhtml+xml",
        },
      });
      status = res.status;
      if (res.ok) {
        html = await res.text();
        fetched = true;
      }
    } catch {
      // ignore network errors; we'll fallback
    }

    // Parsers muito simples baseados em padrões comuns de páginas públicas.
    // Esses seletores podem quebrar; por isso todo parsing é best-effort.
    let name: string | undefined;
    let headline: string | undefined;
    let about: string | undefined;
    const experiences: Array<{ title?: string; company?: string; period?: string }> = [];

    if (html) {
      // name (og:title or <title>)
      const ogTitle = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["'][^>]*>/i);
      const titleTag = html.match(/<title>([^<]+)<\/title>/i);
      name = clean(ogTitle?.[1] || titleTag?.[1]?.replace(/\s*\|\s*LinkedIn.*/i, ""));

      // headline (meta description / or prominent h2)
      const ogDesc = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["'][^>]*>/i);
      headline = clean(ogDesc?.[1]);

      // about (look for "About" section text snippets)
      const aboutMatch = html.match(/About<\/span>[\s\S]{0,2000}?<p[^>]*>([\s\S]*?)<\/p>/i) ||
                         html.match(/Sobre<\/span>[\s\S]{0,2000}?<p[^>]*>([\s\S]*?)<\/p>/i);
      about = clean(aboutMatch?.[1]?.replace(/<[^>]+>/g, " "));

      // experiences (very rough extraction)
      const expBlocks = html.match(/Experience[\s\S]{0,5000}?<section[\s\S]*?<\/section>/i) ||
                        html.match(/Experiência[\s\S]{0,5000}?<section[\s\S]*?<\/section>/i);
      if (expBlocks) {
        const block = expBlocks[0];
        const items = block.split(/<li[\s\S]*?>/i).slice(1).slice(0, 5);
        for (const it of items) {
          const t = clean(it.match(/<span[^>]*>\s*([^<]{2,100})<\/span>/i)?.[1]);
          const c = clean(it.match(/<span[^>]*>\s*([^<]{2,100})<\/span>/i)?.[1]);
          const p = clean(it.match(/(\b\d{4}\b[\s\S]{0,40}?\b\d{4}\b|\b\d+\+?\s*(mes|ano)s?)/i)?.[0]);
          if (t || c || p) experiences.push({ title: t, company: c, period: p });
        }
      }
    }

    const inferredSeniority = inferSeniorityFromHeadline(headline);

    const assessmentParts: string[] = [];
    if (name) assessmentParts.push(`Perfil de ${name}`);
    if (inferredSeniority) assessmentParts.push(`senioridade sugerida: ${inferredSeniority}`);
    if ((experiences?.length || 0) > 0) assessmentParts.push(`${experiences.length} experiências listadas (amostra)`);
    if (headline) assessmentParts.push(`headline: ${headline}`);
    if (!assessmentParts.length) assessmentParts.push("Informações públicas limitadas (LinkedIn pode bloquear scraping anônimo). Forneça mais detalhes manualmente se possível.");

    // Heurísticas de avaliação (0-100)
    const strengths: string[] = [];
    const weaknesses: string[] = [];

    let score = 50; // base
    if (name) { score += 10; strengths.push("Nome presente"); } else { weaknesses.push("Nome não identificado"); }
    if (headline && headline.length > 20) { score += 15; strengths.push("Headline clara e descritiva"); } else { weaknesses.push("Headline curta ou ausente"); }
    if (inferredSeniority) { score += 10; strengths.push(`Sinal de senioridade: ${inferredSeniority}`); }
    const aboutLen = (about?.length || 0);
    if (aboutLen > 200) { score += 10; strengths.push("Resumo (About) detalhado"); }
    else if (aboutLen > 80) { score += 5; strengths.push("Resumo (About) presente"); }
    else { weaknesses.push("Resumo (About) ausente ou muito curto"); }
    const expCount = experiences.length;
    if (expCount >= 3) { score += 10; strengths.push("Experiências listadas (3+)"); }
    else if (expCount >= 1) { score += 5; strengths.push("Ao menos 1 experiência listada"); }
    else { weaknesses.push("Experiências não detectadas na página pública"); }

    if (!fetched) {
      // Penaliza se não conseguiu obter HTML (provável bloqueio)
      score -= 5;
      weaknesses.push("Conteúdo público indisponível (bloqueio/privado)");
    }
    score = Math.max(0, Math.min(100, score));

    const assessment = [
      ...assessmentParts,
      `\nPontos fortes: ${strengths.join(", ") || "-"}.`,
      `Pontos fracos: ${weaknesses.join(", ") || "-"}.`,
      `Nota final: ${score}/100.`,
    ].join(" ");

    return {
      profileUrl,
      name,
      headline,
      about,
      experiences,
      inferredSeniority,
      strengths,
      weaknesses,
      score,
      assessment,
      meta: { fetched, status },
    };
  },
});

export default createLinkedInEvalTool;
