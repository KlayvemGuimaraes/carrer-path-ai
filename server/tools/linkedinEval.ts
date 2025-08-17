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
  duration: z.string().optional(),
});

const educationSchema = z.object({
  institution: z.string().optional(),
  degree: z.string().optional(),
  field: z.string().optional(),
  period: z.string().optional(),
});

const skillSchema = z.object({
  name: z.string(),
  endorsements: z.number().optional(),
});

const outputSchema = z.object({
  profileUrl: z.string().url(),
  name: z.string().optional(),
  headline: z.string().optional(),
  about: z.string().optional(),
  experiences: z.array(expSchema),
  education: z.array(educationSchema),
  skills: z.array(skillSchema),
  inferredSeniority: z.string().optional(),
  strengths: z.array(z.string()).default([]),
  weaknesses: z.array(z.string()).default([]),
  score: z.number().int().min(0).max(100),
  assessment: z.string(),
  recommendations: z.array(z.string()),
  meta: z.object({ 
    fetched: z.boolean(), 
    status: z.number().optional(),
    parsingQuality: z.string().optional()
  }).optional(),
});

function clean(text?: string | null): string | undefined {
  if (!text) return undefined;
  return text.replace(/\s+/g, " ").trim();
}

function inferSeniorityFromHeadline(headline?: string): string | undefined {
  if (!headline) return undefined;
  const h = headline.toLowerCase();
  
  // Senior level indicators
  if (/senior|sr\b|sênior|lead|principal|staff|architect|director|head|chief|vp|cto|ceo/i.test(h)) {
    return "senior";
  }
  
  // Mid level indicators
  if (/pleno|mid|middle|intermediate|intermediário|ss\b|specialist|analyst/i.test(h)) {
    return "pleno";
  }
  
  // Junior level indicators
  if (/junior|jr\b|júnior|entry|associate|assistente|trainee|intern/i.test(h)) {
    return "junior";
  }
  
  return undefined;
}

function calculateLinkedInScore(data: {
  name?: string;
  headline?: string;
  about?: string;
  experiences: any[];
  education: any[];
  skills: any[];
  fetched: boolean;
}): {
  score: number;
  strengths: string[];
  weaknesses: string[];
} {
  let score = 0;
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  // Profile completeness (0-25 points)
  if (data.name) { score += 8; strengths.push("Nome completo presente"); }
  else { weaknesses.push("Nome não identificado"); }

  if (data.headline && data.headline.length > 30) { 
    score += 8; strengths.push("Headline detalhada e profissional"); 
  } else if (data.headline && data.headline.length > 15) { 
    score += 5; strengths.push("Headline presente"); 
  } else { 
    weaknesses.push("Headline curta ou ausente"); 
  }

  const aboutLength = (data.about?.length || 0);
  if (aboutLength > 300) { 
    score += 9; strengths.push("Resumo (About) muito detalhado"); 
  } else if (aboutLength > 150) { 
    score += 6; strengths.push("Resumo (About) detalhado"); 
  } else if (aboutLength > 50) { 
    score += 3; strengths.push("Resumo (About) presente"); 
  } else { 
    weaknesses.push("Resumo (About) ausente ou muito curto"); 
  }

  // Experience section (0-30 points)
  const expCount = data.experiences.length;
  if (expCount >= 5) { 
    score += 15; strengths.push("Muitas experiências listadas (5+)"); 
  } else if (expCount >= 3) { 
    score += 12; strengths.push("Boa quantidade de experiências (3+)"); 
  } else if (expCount >= 1) { 
    score += 8; strengths.push("Algumas experiências listadas"); 
  } else { 
    weaknesses.push("Experiências não detectadas"); 
  }

  // Calculate experience duration and quality
  let totalDuration = 0;
  let hasRecentExperience = false;
  
  data.experiences.forEach(exp => {
    if (exp.duration) {
      const duration = exp.duration.toLowerCase();
      if (duration.includes('ano') || duration.includes('year')) {
        const years = parseInt(duration.match(/\d+/)?.[0] || '0');
        totalDuration += years;
      }
    }
    
    if (exp.period) {
      const period = exp.period.toLowerCase();
      if (period.includes('2024') || period.includes('2023') || period.includes('atual') || period.includes('present')) {
        hasRecentExperience = true;
      }
    }
  });

  if (totalDuration >= 5) { 
    score += 10; strengths.push("Experiência profissional significativa (5+ anos)"); 
  } else if (totalDuration >= 2) { 
    score += 7; strengths.push("Alguma experiência profissional (2+ anos)"); 
  } else { 
    weaknesses.push("Experiência profissional limitada"); 
  }

  if (hasRecentExperience) { 
    score += 5; strengths.push("Experiência profissional recente"); 
  } else { 
    weaknesses.push("Sem experiência profissional recente"); 
  }

  // Education section (0-15 points)
  const eduCount = data.education.length;
  if (eduCount >= 2) { 
    score += 8; strengths.push("Múltiplas formações educacionais"); 
  } else if (eduCount >= 1) { 
    score += 5; strengths.push("Formação educacional listada"); 
  } else { 
    weaknesses.push("Formação educacional não detectada"); 
  }

  // Skills section (0-20 points)
  const skillCount = data.skills.length;
  if (skillCount >= 15) { 
    score += 20; strengths.push("Muitas habilidades listadas (15+)"); 
  } else if (skillCount >= 10) { 
    score += 15; strengths.push("Boa quantidade de habilidades (10+)"); 
  } else if (skillCount >= 5) { 
    score += 10; strengths.push("Algumas habilidades listadas (5+)"); 
  } else if (skillCount >= 1) { 
    score += 5; strengths.push("Poucas habilidades listadas"); 
  } else { 
    weaknesses.push("Habilidades não detectadas"); 
  }

  // Check for endorsed skills
  const endorsedSkills = data.skills.filter(s => (s.endorsements || 0) > 0).length;
  if (endorsedSkills >= 5) { 
    score += 5; strengths.push("Muitas habilidades com endossos (5+)"); 
  } else if (endorsedSkills >= 1) { 
    score += 3; strengths.push("Algumas habilidades com endossos"); 
  } else { 
    weaknesses.push("Habilidades sem endossos"); 
  }

  // Penalty for poor data quality
  if (!data.fetched) {
    score -= 10;
    weaknesses.push("Conteúdo público indisponível (bloqueio/privado)");
  }

  // Cap score at 100
  score = Math.max(0, Math.min(100, score));

  return { score, strengths, weaknesses };
}

function generateLinkedInRecommendations(strengths: string[], weaknesses: string[], score: number): string[] {
  const recommendations: string[] = [];

  if (score < 50) {
    recommendations.push("Complete todas as seções do seu perfil LinkedIn para melhorar a visibilidade");
    recommendations.push("Adicione uma headline profissional e descritiva");
    recommendations.push("Escreva um resumo (About) detalhado sobre sua experiência e objetivos");
    recommendations.push("Liste todas as suas experiências profissionais relevantes");
  }

  if (score < 70) {
    if (weaknesses.includes("Experiências não detectadas")) {
      recommendations.push("Adicione experiências profissionais com descrições detalhadas");
      recommendations.push("Inclua responsabilidades e conquistas em cada posição");
    }
    if (weaknesses.includes("Habilidades não detectadas")) {
      recommendations.push("Liste suas principais habilidades técnicas e soft skills");
      recommendations.push("Peça endossos de colegas para suas habilidades");
    }
    if (weaknesses.includes("Formação educacional não detectada")) {
      recommendations.push("Adicione sua formação educacional e certificações");
    }
  }

  if (score >= 80) {
    recommendations.push("Excelente perfil! Considere compartilhar conteúdo técnico regularmente");
    recommendations.push("Participe de grupos profissionais relevantes para sua área");
    recommendations.push("Mantenha o perfil atualizado com novas experiências e habilidades");
  }

  return recommendations;
}

const createLinkedInEvalTool = (env: Env) => createTool({
  id: "LINKEDIN_EVAL",
  description: "Avalia um perfil público do LinkedIn a partir da URL, retornando dados detalhados, scoring numérico e análise completa com recomendações.",
  inputSchema,
  outputSchema,
  execute: async ({ context }) => {
    const profileUrl = context.url.trim();

    // Enhanced LinkedIn scraping with multiple fallback strategies
    let html = "";
    let fetched = false;
    let status: number | undefined = undefined;
    let parsingQuality = "unknown";
    let debugInfo = "";
    
    // Strategy 1: Try with enhanced headers
    try {
      console.log(`[LinkedInEval] Attempting to fetch: ${profileUrl}`);
      const res = await fetch(profileUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9,pt-BR;q=0.8,pt;q=0.7",
          "Accept-Encoding": "gzip, deflate, br",
          "DNT": "1",
          "Connection": "keep-alive",
          "Upgrade-Insecure-Requests": "1",
          "Sec-Fetch-Dest": "document",
          "Sec-Fetch-Mode": "navigate",
          "Sec-Fetch-Site": "none",
          "Cache-Control": "max-age=0",
        },
      });
      
      status = res.status;
      debugInfo += `Strategy 1 - Status: ${status}, Headers: ${JSON.stringify(Object.fromEntries(res.headers.entries()))}`;
      
      if (res.ok) {
        html = await res.text();
        fetched = true;
        console.log(`[LinkedInEval] Strategy 1 successful. Status: ${status}, HTML length: ${html.length}`);
        parsingQuality = "full";
      } else {
        console.log(`[LinkedInEval] Strategy 1 failed. Status: ${status}`);
      }
    } catch (error: any) {
      console.error(`[LinkedInEval] Strategy 1 network error: ${error.message}`);
      debugInfo += `Strategy 1 - Error: ${error.message}`;
    }

    // Strategy 2: Try with different User-Agent if first failed
    if (!fetched) {
      try {
        console.log(`[LinkedInEval] Trying Strategy 2 with different User-Agent`);
        const res2 = await fetch(profileUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
            "Accept-Encoding": "gzip, deflate",
            "Connection": "keep-alive",
          },
        });
        
        status = res2.status;
        debugInfo += ` | Strategy 2 - Status: ${status}`;
        
        if (res2.ok) {
          html = await res2.text();
          fetched = true;
          console.log(`[LinkedInEval] Strategy 2 successful. Status: ${status}, HTML length: ${html.length}`);
          parsingQuality = "full";
        } else {
          console.log(`[LinkedInEval] Strategy 2 failed. Status: ${status}`);
        }
      } catch (error: any) {
        console.error(`[LinkedInEval] Strategy 2 network error: ${error.message}`);
        debugInfo += ` | Strategy 2 - Error: ${error.message}`;
      }
    }

    // Strategy 3: Try with minimal headers if both failed
    if (!fetched) {
      try {
        console.log(`[LinkedInEval] Trying Strategy 3 with minimal headers`);
        const res3 = await fetch(profileUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
        });
        
        status = res3.status;
        debugInfo += ` | Strategy 3 - Status: ${status}`;
        
        if (res3.ok) {
          html = await res3.text();
          fetched = true;
          console.log(`[LinkedInEval] Strategy 3 successful. Status: ${status}, HTML length: ${html.length}`);
          parsingQuality = "full";
        } else {
          console.log(`[LinkedInEval] Strategy 3 failed. Status: ${status}`);
        }
      } catch (error: any) {
        console.error(`[LinkedInEval] Strategy 3 network error: ${error.message}`);
        debugInfo += ` | Strategy 3 - Error: ${error.message}`;
      }
    }

    // Final debug info
    if (!fetched) {
      console.log(`[LinkedInEval] All strategies failed. Debug info: ${debugInfo}`);
      parsingQuality = "all_strategies_failed";
    }

    // Enhanced parsing with multiple strategies
    let name: string | undefined;
    let headline: string | undefined;
    let about: string | undefined;
    const experiences: Array<{ title?: string; company?: string; period?: string; duration?: string }> = [];
    const education: Array<{ institution?: string; degree?: string; field?: string; period?: string }> = [];
    const skills: Array<{ name: string; endorsements?: number }> = [];

    if (html) {
      // Name extraction - multiple strategies
      const ogTitle = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["'][^>]*>/i);
      const titleTag = html.match(/<title>([^<]+)<\/title>/i);
      const linkedinTitle = html.match(/<meta[^>]+name=["']title["'][^>]+content=["']([^"']+)["'][^>]*>/i);
      
      name = clean(ogTitle?.[1] || linkedinTitle?.[1] || titleTag?.[1]?.replace(/\s*\|\s*LinkedIn.*/i, ""));

      // Headline extraction
      const ogDesc = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["'][^>]*>/i);
      const linkedinDesc = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["'][^>]*>/i);
      headline = clean(ogDesc?.[1] || linkedinDesc?.[1]);

      // About section - re-enhanced extraction with more generic patterns
      const aboutPatterns = [
        /aria-label="About"[\s\S]{0,5000}?<p[^>]*>([\s\S]*?)<\/p>/i, // Tentar atributos aria
        /data-test-id="about-section"[\s\S]{0,5000}?<p[^>]*>([\s\S]*?)<\/p>/i, // Tentar atributos data-
        /<section[^>]*>(?:<h2[^>]*>(?:About|Sobre)<\/h2>)([\s\S]*?)<\/section>/i, // Buscar título H2 e depois conteúdo
        /<div[^>]*>(?:<h2[^>]*>(?:About|Sobre)<\/h2>)([\s\S]*?)<\/div>/i, // Buscar título H2 e depois conteúdo
        /About(?:<\/span>)?([\s\S]{0,2000}?)<\/p>/i, // Mais simples, focado no texto "About" e fechamento de parágrafo
        /Sobre(?:<\/span>)?([\s\S]{0,2000}?)<\/p>/i, // Mais simples, focado no texto "Sobre" e fechamento de parágrafo
      ];
      
      for (const pattern of aboutPatterns) {
        const match = html.match(pattern);
        if (match) {
          about = clean(match[1]?.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&#039;/g, "\'")); // Limpar HTML e entidades
          break;
        }
      }
      if (about) {
        parsingQuality = parsingQuality === "full" ? "good" : "partial"; // Atualizar qualidade de parsing
      }

      // Experience extraction - more robust
      const expPatterns = [
        /<section[^>]*aria-label="Experience"[^>]*>([\s\S]*?)<\/section>/i, // Tentar atributos aria-label
        /<section[^>]*data-test-id="experience-section"[^>]*>([\s\S]*?)<\/section>/i, // Tentar atributos data-test-id
        /Experience(?:<\/span>)?([\s\S]{0,10000}?)<\/section>/i, // Fallback para seções com título "Experience"
        /Experiência(?:<\/span>)?([\s\S]{0,10000}?)<\/section>/i, // Fallback para seções com título "Experiência"
      ];
      
      for (const pattern of expPatterns) {
        const expBlockMatch = html.match(pattern);
        if (expBlockMatch) {
          const block = expBlockMatch[1] || expBlockMatch[0]; // Capturar grupo ou bloco inteiro
          
          // Tentar dividir por itens de experiência mais genéricos
          const items = block.split(/<li[^>]*>([\s\S]*?)<\/li>/i).slice(1); // Dividir por <li>
          
          for (const item of items.slice(0, 10)) { // Limitar a 10 experiências
            const title = clean(item.match(/(?:<h3[^>]*>|<div[^>]*>|<span[^>]*>)([\s\S]{2,150}?)(?:<\/h3>|<\/div>|<\/span>)/i)?.[1]); // Título: h3, div ou span
            const company = clean(item.match(/(?:<a[^>]*>|<div[^>]*>|<span[^>]*>)([\s\S]{2,150}?)(?:<\/a>|<\/div>|<\/span>)/i)?.[1]); // Empresa: a, div ou span
            const periodMatch = item.match(/(\b\d{4}\b[\s\S]{0,80}?\b\d{4}\b|\b\d{4}\b[\s\S]{0,80}?(?:Atual|Presente)|\d+\s*(?:ano|mês)s?)/i); // Período: ex: 2020 - 2023, 2 anos, 6 meses
            const period = clean(periodMatch?.[0]);
            
            if (title || company || period) {
              experiences.push({ title, company, period });
            }
          }
          parsingQuality = parsingQuality === "full" ? "good" : "partial"; // Atualizar qualidade
          break;
        }
      }

      // Education extraction - more robust
      const eduPatterns = [
        /<section[^>]*aria-label="Education"[^>]*>([\s\S]*?)<\/section>/i, // Tentar atributos aria-label
        /<section[^>]*data-test-id="education-section"[^>]*>([\s\S]*?)<\/section>/i, // Tentar atributos data-test-id
        /Education(?:<\/span>)?([\s\S]{0,5000}?)<\/section>/i, // Fallback para seções com título "Education"
        /Educação(?:<\/span>)?([\s\S]{0,5000}?)<\/section>/i, // Fallback para seções com título "Educação"
      ];
      
      for (const pattern of eduPatterns) {
        const eduBlockMatch = html.match(pattern);
        if (eduBlockMatch) {
          const block = eduBlockMatch[1] || eduBlockMatch[0];
          const items = block.split(/<li[^>]*>([\s\S]*?)<\/li>/i).slice(1);
          
          for (const item of items.slice(0, 5)) { // Limitar a 5 educações
            const institution = clean(item.match(/(?:<h3[^>]*>|<div[^>]*>|<span[^>]*>)([\s\S]{2,150}?)(?:<\/h3>|<\/div>|<\/span>)/i)?.[1]);
            const degree = clean(item.match(/(?:<h4[^>]*>|<div[^>]*>|<span[^>]*>)([\s\S]{2,150}?)(?:<\/h4>|<\/div>|<\/span>)/i)?.[1]);
            const field = clean(item.match(/(?:<div[^>]*class="[^"]*field-of-study[^"]*"[^>]*>|<span[^>]*>)([\s\S]{2,150}?)(?:<\/div>|<\/span>)/i)?.[1]);
            const period = clean(item.match(/(\b\d{4}\b[\s\S]{0,40}?\b\d{4}\b|\b\d{4}\b[\s\S]{0,40}?(?:Atual|Presente))/i)?.[0]);
            
            if (institution || degree || field) {
              education.push({ institution, degree, field, period });
            }
          }
          parsingQuality = parsingQuality === "full" ? "good" : "partial";
          break;
        }
      }

      // Skills extraction - more robust
      const skillPatterns = [
        /<section[^>]*aria-label="Skills"[^>]*>([\s\S]*?)<\/section>/i, // Tentar atributos aria-label
        /<section[^>]*data-test-id="skills-section"[^>]*>([\s\S]*?)<\/section>/i, // Tentar atributos data-test-id
        /Skills(?:<\/span>)?([\s\S]{0,5000}?)<\/section>/i, // Fallback para seções com título "Skills"
        /Habilidades(?:<\/span>)?([\s\S]{0,5000}?)<\/section>/i, // Fallback para seções com título "Habilidades"
      ];
      
      for (const pattern of skillPatterns) {
        const skillBlockMatch = html.match(pattern);
        if (skillBlockMatch) {
          const block = skillBlockMatch[1] || skillBlockMatch[0];
          // Tentar extrair habilidades de <span> ou <div> com classes de habilidade
          const skillItems = block.match(/(?:<span[^>]*>|<div[^>]*class="[^"]*skill-name[^"]*"[^>]*>)([\s\S]{2,100}?)(?:<\/span>|<\/div>)/gi);
          
          if (skillItems) {
            for (const skillItem of skillItems.slice(0, 20)) { // Limitar a 20 habilidades
              const skillName = clean(skillItem.replace(/<[^>]+>/g, ""));
              // Tentar extrair endossos (se houver um padrão)
              const endorsementMatch = skillItem.match(/\b(\d+)\s*endorsement/i); // Ex: 10 endorsements
              const endorsements = endorsementMatch ? parseInt(endorsementMatch[1]) : 0;

              if (skillName && skillName.length > 2) {
                skills.push({ name: skillName, endorsements });
              }
            }
          }
          parsingQuality = parsingQuality === "full" ? "good" : "partial";
          break;
        }
      }
    }

    const inferredSeniority = inferSeniorityFromHeadline(headline);
    const { score, strengths, weaknesses } = calculateLinkedInScore({
      name, headline, about, experiences, education, skills, fetched
    });
    const recommendations = generateLinkedInRecommendations(strengths, weaknesses, score);

    // Add specific feedback for scraping failures
    if (parsingQuality === "all_strategies_failed") {
      weaknesses.push("LinkedIn bloqueou o acesso automatizado ao perfil");
      weaknesses.push("O perfil pode estar configurado como privado ou ter restrições de acesso");
      
      recommendations.unshift("LinkedIn implementou medidas anti-bot rigorosas que impedem a análise automatizada");
      recommendations.unshift("Considere usar a API oficial do LinkedIn ou compartilhar informações do perfil manualmente");
    }

    // Refine parsingQuality based on content found
    if (fetched && name && headline && about && experiences.length > 0 && education.length > 0 && skills.length > 0) {
      parsingQuality = "good";
    } else if (fetched) {
      parsingQuality = "partial";
    } else {
      parsingQuality = "failed_fetch_no_html";
    }

    console.log(`[LinkedInEval] Parsing quality: ${parsingQuality}`);
    console.log(`[LinkedInEval] Profile data: Name=${!!name}, Headline=${!!headline}, About=${!!about}, Experiences=${experiences.length}, Education=${education.length}, Skills=${skills.length}`);

    // Generate comprehensive assessment
    const assessment = `${name ? `Perfil de ${name}` : 'Perfil LinkedIn'} - Score: ${score}/100

${inferredSeniority ? `Senioridade sugerida: ${inferredSeniority}` : 'Senioridade não detectada'}

${strengths.length > 0 ? `Pontos Fortes: ${strengths.join(", ")}` : "Sem pontos fortes identificados"}

${weaknesses.length > 0 ? `Áreas de Melhoria: ${weaknesses.join(", ")}` : "Sem áreas de melhoria identificadas"}

Estatísticas: ${experiences.length} experiências, ${education.length} formações, ${skills.length} habilidades
${headline ? `Headline: ${headline}` : 'Headline não detectada'}
${about ? `Resumo: ${about.substring(0, 100)}${about.length > 100 ? '...' : ''}` : 'Resumo não detectado'}

${recommendations.length > 0 ? `Recomendações: ${recommendations.join("; ")}` : ""}`;

    return {
      profileUrl,
      name,
      headline,
      about,
      experiences,
      education,
      skills,
      inferredSeniority,
      strengths,
      weaknesses,
      score,
      assessment,
      recommendations,
      meta: { 
        fetched, 
        status, 
        parsingQuality 
      },
    };
  },
});

export default createLinkedInEvalTool;
