export type UserProfile = {
  role: string;
  seniority: "junior" | "pleno" | "senior";
  targetArea?: string;
  goals?: string[];
  budgetUSD?: number;
};

export type RecommendationItem = {
  certification: {
    id: string;
    name: string;
    provider: string;
    area?: string;
    level: "iniciante" | "intermediario" | "avancado";
  };
  score: number;
  reasons: string[];
};

export type StudyResource = {
  title: string;
  url?: string;
  type?: "doc" | "video" | "course" | "practice";
};

export type StudyWeek = {
  title: string;
  goals: string[];
  resources: StudyResource[];
  estimateHrs: number;
};

export type StudyPlan = {
  totalWeeks: number;
  weeks: StudyWeek[];
  suggestionOrder: string[]; // certification ids in order
};

const commonResourcesByArea: Record<string, StudyResource[]> = {
  cloud: [
    { title: "Well-Architected (AWS)", url: "https://wa.aws.amazon.com/", type: "doc" },
    { title: "Azure Fundamentals docs", url: "https://learn.microsoft.com/azure/", type: "doc" },
    { title: "Google Cloud Skills Boost", url: "https://www.cloudskillsboost.google/", type: "course" },
  ],
  seguranca: [
    { title: "NIST Cybersecurity Framework", url: "https://www.nist.gov/cyberframework", type: "doc" },
    { title: "OWASP Top 10", url: "https://owasp.org/www-project-top-ten/", type: "doc" },
  ],
  dados: [
    { title: "dbt docs", url: "https://docs.getdbt.com/", type: "doc" },
    { title: "Power BI Learn", url: "https://learn.microsoft.com/power-bi/", type: "course" },
  ],
  dev: [
    { title: "Clean Architecture summary", type: "doc", url: "https://8thlight.com/blog/uncle-bob/2012/08/13/the-clean-architecture.html" },
  ],
  redes: [
    { title: "Cisco Packet Tracer labs", type: "practice", url: "https://www.netacad.com/courses/packet-tracer" },
  ],
  gestao: [
    { title: "PMBOK Guide (overview)", type: "doc", url: "https://www.pmi.org/pmbok-guide-standards" },
  ],
};

function suggestOrder(items: RecommendationItem[]): string[] {
  // ordem por score desc
  return items
    .slice()
    .sort((a, b) => b.score - a.score)
    .map((i) => i.certification.id);
}

export function buildStudyPlan(
  profile: UserProfile,
  items: RecommendationItem[],
): StudyPlan {
  const order = suggestOrder(items);
  const area = (profile.targetArea || "").toLowerCase();
  const areaResources = commonResourcesByArea[area] || [];

  // Heurística simples: 2 semanas por certificação iniciante, 3 para intermediário, 4 para avançado
  const weeks: StudyWeek[] = [];
  for (const id of order) {
    const rec = items.find((i) => i.certification.id === id)!;
    const level = rec.certification.level;
    const certWeeks = level === "iniciante" ? 2 : level === "intermediario" ? 3 : 4;

    for (let w = 1; w <= certWeeks; w++) {
      const title = `${rec.certification.name} — Semana ${w}/${certWeeks}`;
      const goals: string[] = [];
      if (w === 1) goals.push("Fundamentos e terminologia");
      if (w === 2) goals.push("Serviços principais e melhores práticas");
      if (w >= 3) goals.push("Prática guiada e simulados");
      if (w === certWeeks) goals.push("Revisão final e agendamento da prova");

      const resources: StudyResource[] = [
        ...areaResources.slice(0, 2),
        { title: `Exam guide — ${rec.certification.provider}`, type: "doc" },
        { title: "Simulados (prática)", type: "practice" },
      ];

      const estimateHrs = level === "iniciante" ? 6 : level === "intermediario" ? 8 : 10;

      weeks.push({ title, goals, resources, estimateHrs });
    }
  }

  return {
    totalWeeks: weeks.length,
    weeks,
    suggestionOrder: order,
  };
}
