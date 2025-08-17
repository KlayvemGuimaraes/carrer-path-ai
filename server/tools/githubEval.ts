import { createTool } from "@deco/workers-runtime/mastra";
import { z } from "zod";
import type { Env } from "../main.ts";

const inputSchema = z.object({
  url: z.string().url().optional().describe("GitHub profile URL (e.g., https://github.com/torvalds)"),
  username: z.string().optional().describe("GitHub username if URL not provided"),
});

const repoSchema = z.object({
  name: z.string(),
  html_url: z.string().url(),
  description: z.string().nullable().optional(),
  stargazers_count: z.number().int(),
  forks_count: z.number().int(),
  language: z.string().nullable().optional(),
  updated_at: z.string(),
});

const outputSchema = z.object({
  username: z.string(),
  profileUrl: z.string().url(),
  stats: z.object({
    followers: z.number().int(),
    following: z.number().int(),
    publicRepos: z.number().int(),
    totalStars: z.number().int(),
    totalForks: z.number().int(),
    topLanguages: z.array(z.object({ language: z.string(), count: z.number().int() })),
    recentRepos: z.array(z.object({ name: z.string(), url: z.string().url(), updatedAt: z.string() })),
  }),
  assessment: z.string(),
});

function parseUsername(input?: { url?: string; username?: string }): string | null {
  if (input?.username) return input.username.trim();
  const url = input?.url?.trim();
  if (!url) return null;
  try {
    const u = new URL(url);
    if (!/github\.com$/i.test(u.hostname)) return null;
    const seg = u.pathname.replace(/^\/+/, "").split("/");
    return seg[0] || null;
  } catch {
    return null;
  }
}

const createGitHubEvalTool = (env: Env) => createTool({
  id: "GITHUB_EVAL",
  description: "Avalia um perfil GitHub (público) a partir da URL ou username, retornando estatísticas e uma análise resumida.",
  inputSchema,
  outputSchema,
  execute: async ({ context }) => {
    const username = parseUsername(context);
    if (!username) {
      throw new Error("Forneça uma URL válida do GitHub ou um username.");
    }

    const base = `https://api.github.com/users/${encodeURIComponent(username)}`;
    const [userRes, reposRes] = await Promise.all([
      fetch(base, { headers: { 'User-Agent': 'careerpath-app' } }),
      fetch(`${base}/repos?per_page=100&sort=updated`, { headers: { 'User-Agent': 'careerpath-app' } }),
    ]);

    if (!userRes.ok) {
      throw new Error(`GitHub API (user) falhou: ${userRes.status}`);
    }
    if (!reposRes.ok) {
      throw new Error(`GitHub API (repos) falhou: ${reposRes.status}`);
    }

    const user = await userRes.json() as any;
    const repos = await reposRes.json() as z.infer<typeof repoSchema>[];

    // Aggregate stats
    let totalStars = 0;
    let totalForks = 0;
    const langCount = new Map<string, number>();

    for (const r of repos) {
      totalStars += (r.stargazers_count || 0);
      totalForks += (r.forks_count || 0);
      const lang = (r.language || '').trim();
      if (lang) langCount.set(lang, (langCount.get(lang) || 0) + 1);
    }

    const topLanguages = Array.from(langCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([language, count]) => ({ language, count }));

    const recentRepos = repos
      .slice(0, 5)
      .map(r => ({ name: r.name, url: r.html_url as string, updatedAt: r.updated_at }));

    // Simple heuristic assessment
    const signals: string[] = [];
    if ((user.followers || 0) >= 50) signals.push("bom alcance/seguidores");
    if (totalStars >= 50) signals.push("repositórios com estrelas");
    if (topLanguages.length >= 2) signals.push("diversidade de linguagens");
    if (repos.length >= 10) signals.push("portfólio consistente");

    const assessment = `Perfil GitHub de ${user.name || username}: ${signals.length ? signals.join(", ") : "sinais limitados"}. ` +
      `Principais linguagens: ${topLanguages.map(l => l.language).join(", ") || "-"}. ` +
      `Repositórios recentes: ${recentRepos.map(r => r.name).join(", ") || "-"}.`;

    return {
      username,
      profileUrl: user.html_url || `https://github.com/${username}`,
      stats: {
        followers: user.followers || 0,
        following: user.following || 0,
        publicRepos: user.public_repos || repos.length,
        totalStars,
        totalForks,
        topLanguages,
        recentRepos,
      },
      assessment,
    };
  },
});

export default createGitHubEvalTool;
