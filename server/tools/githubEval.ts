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
  created_at: z.string(),
  size: z.number().int(),
  open_issues_count: z.number().int(),
  has_wiki: z.boolean(),
  has_pages: z.boolean(),
  archived: z.boolean(),
  fork: z.boolean(),
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
  score: z.number().int().min(0).max(100),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  assessment: z.string(),
  recommendations: z.array(z.string()),
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

function calculateGitHubScore(user: any, repos: z.infer<typeof repoSchema>[]): {
  score: number;
  strengths: string[];
  weaknesses: string[];
} {
  let score = 0;
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  // Profile completeness (0-20 points)
  if (user.name) { score += 5; strengths.push("Nome completo no perfil"); }
  if (user.bio) { score += 5; strengths.push("Bio descritiva"); }
  if (user.blog) { score += 3; strengths.push("Website/blog linkado"); }
  if (user.company) { score += 3; strengths.push("Empresa especificada"); }
  if (user.location) { score += 2; strengths.push("Localização especificada"); }
  if (user.hireable) { score += 2; strengths.push("Disponível para contratação"); }

  // Social proof (0-25 points)
  const followers = user.followers || 0;
  if (followers >= 1000) { score += 15; strengths.push("Alto número de seguidores (1000+)"); }
  else if (followers >= 500) { score += 12; strengths.push("Bom número de seguidores (500+)"); }
  else if (followers >= 100) { score += 8; strengths.push("Seguidores significativos (100+)"); }
  else if (followers >= 50) { score += 5; strengths.push("Alguns seguidores (50+)"); }
  else { weaknesses.push("Poucos seguidores"); }

  // Repository activity (0-30 points)
  const publicRepos = repos.length;
  if (publicRepos >= 20) { score += 15; strengths.push("Muitos repositórios públicos (20+)"); }
  else if (publicRepos >= 10) { score += 12; strengths.push("Bom número de repositórios (10+)"); }
  else if (publicRepos >= 5) { score += 8; strengths.push("Alguns repositórios (5+)"); }
  else if (publicRepos >= 1) { score += 5; strengths.push("Pelo menos um repositório"); }
  else { score += 0; weaknesses.push("Nenhum repositório público"); }

  // Code quality indicators (0-15 points)
  const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
  if (totalStars >= 100) { score += 15; strengths.push("Muitas estrelas (100+)"); }
  else if (totalStars >= 50) { score += 12; strengths.push("Bom número de estrelas (50+)"); }
  else if (totalStars >= 20) { score += 8; strengths.push("Algumas estrelas (20+)"); }
  else if (totalStars >= 5) { score += 5; strengths.push("Poucas estrelas (5+)"); }
  else { weaknesses.push("Poucas estrelas nos repositórios"); }

  // Repository maintenance (0-10 points)
  const activeRepos = repos.filter(r => !r.archived && !r.fork).length;
  const recentActivity = repos.filter(r => {
    const updated = new Date(r.updated_at);
    const now = new Date();
    const daysDiff = (now.getTime() - updated.getTime()) / (1000 * 3600 * 24);
    return daysDiff <= 90; // 3 months
  }).length;

  if (recentActivity >= 5) { score += 10; strengths.push("Muitos repositórios ativos recentemente"); }
  else if (recentActivity >= 3) { score += 7; strengths.push("Alguns repositórios ativos recentemente"); }
  else if (recentActivity >= 1) { score += 4; strengths.push("Pelo menos um repositório ativo recentemente"); }
  else { weaknesses.push("Pouca atividade recente nos repositórios"); }

  // Language diversity
  const languages = repos.map(r => r.language).filter(Boolean);
  const uniqueLanguages = new Set(languages);
  if (uniqueLanguages.size >= 5) { score += 5; strengths.push("Alta diversidade de linguagens (5+)"); }
  else if (uniqueLanguages.size >= 3) { score += 3; strengths.push("Boa diversidade de linguagens (3+)"); }
  else if (uniqueLanguages.size >= 2) { score += 1; strengths.push("Alguma diversidade de linguagens"); }
  else { weaknesses.push("Pouca diversidade de linguagens"); }

  // Cap score at 100
  score = Math.min(100, Math.max(0, score));

  return { score, strengths, weaknesses };
}

function generateRecommendations(strengths: string[], weaknesses: string[], score: number): string[] {
  const recommendations: string[] = [];

  if (score < 50) {
    recommendations.push("Considere criar mais repositórios públicos para demonstrar suas habilidades");
    recommendations.push("Atualize regularmente seus repositórios para mostrar atividade contínua");
    recommendations.push("Adicione uma bio descritiva e informações de contato no seu perfil");
  }

  if (score < 70) {
    if (weaknesses.includes("Poucos seguidores")) {
      recommendations.push("Participe de projetos open source para aumentar sua visibilidade");
      recommendations.push("Compartilhe seus projetos em comunidades técnicas relevantes");
    }
    if (weaknesses.includes("Poucas estrelas nos repositórios")) {
      recommendations.push("Foque na qualidade do código e documentação dos seus projetos");
      recommendations.push("Crie projetos que resolvam problemas reais e sejam úteis para outros desenvolvedores");
    }
  }

  if (score >= 80) {
    recommendations.push("Excelente perfil! Considere mentorar outros desenvolvedores");
    recommendations.push("Continue contribuindo para a comunidade open source");
  }

  return recommendations;
}

const createGitHubEvalTool = (env: Env) => createTool({
  id: "GITHUB_EVAL",
  description: "Avalia um perfil GitHub (público) a partir da URL ou username, retornando estatísticas detalhadas, scoring numérico e análise completa com recomendações.",
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

    // Calculate comprehensive score
    const { score, strengths, weaknesses } = calculateGitHubScore(user, repos);
    const recommendations = generateRecommendations(strengths, weaknesses, score);

    // Generate detailed assessment
    const assessment = `Perfil GitHub de ${user.name || username} - Score: ${score}/100

${strengths.length > 0 ? `Pontos Fortes: ${strengths.join(", ")}` : "Sem pontos fortes identificados"}

${weaknesses.length > 0 ? `Áreas de Melhoria: ${weaknesses.join(", ")}` : "Sem áreas de melhoria identificadas"}

Estatísticas: ${user.followers || 0} seguidores, ${repos.length} repositórios, ${totalStars} estrelas totais
Linguagens principais: ${topLanguages.map(l => l.language).join(", ") || "Nenhuma linguagem detectada"}
Repositórios recentes: ${recentRepos.map(r => r.name).join(", ") || "Nenhum repositório recente"}

${recommendations.length > 0 ? `Recomendações: ${recommendations.join("; ")}` : ""}`;

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
      score,
      strengths,
      weaknesses,
      assessment,
      recommendations,
    };
  },
});

export default createGitHubEvalTool;
