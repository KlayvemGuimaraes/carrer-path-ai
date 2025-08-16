import { z } from "zod";
import type { Certification } from "../schemas.ts";
import { UserProfileSchema } from "../schemas.ts";

/**
 * Scores a certification based on a user's profile.
 * This simple scoring logic can be expanded with more complex rules.
 * @param c The certification to score.
 * @param p The user profile.
 * @returns An object containing the score and the reasons for it.
 */
export function scoreCertification(c: Certification, p: z.infer<typeof UserProfileSchema>): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // Match by role
  if (p.role && c.roles.map(r => r.toLowerCase()).includes(p.role.toLowerCase())) {
    score += 40;
    reasons.push(`Alinhada ao cargo (${p.role})`);
  }
  // Match by target area
  if (p.targetArea && (c.area || "").toLowerCase() === p.targetArea.toLowerCase()) {
    score += 30;
    reasons.push(`Foco na área desejada (${p.targetArea})`);
  }
  // Match by seniority
  if (p.seniority === "junior" && c.level === "iniciante") {
    score += 20;
    reasons.push("Boa porta de entrada");
  }
  if (p.seniority === "pleno" && c.level !== "iniciante") {
    score += 15;
    reasons.push("Coerente com nível pleno");
  }
  if (p.seniority === "senior" && c.level === "avancado") {
    score += 20;
    reasons.push("Desafio avançado para sênior");
  }

  // Match by budget
  if (typeof p.budgetUSD === "number" && typeof c.estimatedCostUSD === "number") {
    if (c.estimatedCostUSD <= p.budgetUSD) {
      score += 10;
      reasons.push("Dentro do orçamento");
    } else {
      score -= 10;
      reasons.push("Acima do orçamento");
    }
  }

  // Match by goals
  if (p.goals?.length) {
    const hit = p.goals.some(g => (c.skills || []).some(s => s.toLowerCase().includes(g.toLowerCase())));
    if (hit) {
      score += 10;
      reasons.push("Cobre metas declaradas");
    }
  }

  return { score, reasons };
}
