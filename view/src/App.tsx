import { useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import StudyPlanDoc from "./pdf/StudyPlanDoc";
import { buildStudyPlan } from "./lib/studyPlan";

type RecommendationItem = {
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

export default function App() {
  const [role, setRole] = useState("desenvolvedor");
  const [seniority, setSeniority] = useState<"junior"|"pleno"|"senior">("junior");
  const [targetArea, setTargetArea] = useState("cloud");
  const [goals, setGoals] = useState("arquitetura,ha-dr");
  const [budgetUSD, setBudget] = useState<number | ''>('');
  const [items, setItems] = useState<RecommendationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [aiAnswer, setAiAnswer] = useState<string>("");
  const [userQuestion, setUserQuestion] = useState<string>("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  
  // GitHub evaluation
  const [githubUrl, setGithubUrl] = useState<string>("");
  const [ghLoading, setGhLoading] = useState(false);
  const [ghError, setGhError] = useState<string | null>(null);
  const [ghResult, setGhResult] = useState<any | null>(null);
  
  // LinkedIn evaluation
  const [linkedinUrl, setLinkedinUrl] = useState<string>("");
  const [liLoading, setLiLoading] = useState(false);
  const [liError, setLiError] = useState<string | null>(null);
  const [liResult, setLiResult] = useState<any | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setErr(null); setItems([]);
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role, seniority, targetArea,
          goals: goals.split(",").map(s => s.trim()).filter(Boolean),
          budgetUSD: budgetUSD === '' ? undefined : Number(budgetUSD),
        }),
      });
      if (!res.ok) {
        let message = `HTTP ${res.status}`;
        try {
          const data = await res.json();
          if (data?.error === "ValidationError" && Array.isArray(data.details)) {
            message = `Dados inválidos: ${data.details.map((d: any) => d.message).join("; ")}`;
          } else if (data?.error) {
            message = String(data.error);
          }
        } catch {}
        throw new Error(message);
      }
      const data = await res.json();
      setItems(data.items || []);
    } catch (e:any) {
      setErr(e.message || "Erro ao recomendar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              <span className="gradient-text">CarrerPath</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Sua jornada para o sucesso profissional começa aqui. 
              Avaliamos perfis, recomendamos certificações e criamos planos personalizados.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* GitHub Evaluation Card */}
          <div className="glass rounded-2xl p-8 card-hover animate-slide-in-right">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white dark:text-slate-900" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">GitHub Profile</h2>
                <p className="text-slate-600 dark:text-slate-400">Avaliação completa do seu perfil</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-3">
          <input
                  className="flex-1 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus-ring transition-all"
                  placeholder="https://github.com/username"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
          />
          <button
            onClick={async () => {
              setGhError(null); setGhResult(null); setGhLoading(true);
              try {
                const res = await fetch('/api/eval/github', {
                  method: 'POST', headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ url: githubUrl })
                });
                const data = await res.json().catch(() => ({}));
                if (!res.ok) throw new Error(data?.error || `Falha (HTTP ${res.status})`);
                setGhResult(data);
              } catch (e:any) {
                setGhError(e?.message || 'Não foi possível avaliar o GitHub');
              } finally {
                setGhLoading(false);
              }
            }}
            disabled={ghLoading || !githubUrl.trim()}
                  className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed btn-hover focus-ring"
                >
                  {ghLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white dark:border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                      Avaliando...
                    </div>
                  ) : 'Avaliar'}
          </button>
        </div>
              
              {ghError && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400">
                  {ghError}
                </div>
              )}
              
        {ghResult && (
                <div className="space-y-4 p-6 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-900 dark:bg-white rounded-full flex items-center justify-center">
                        <span className="text-white dark:text-slate-900 font-bold text-lg">
                          {ghResult.username?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">{ghResult.username}</h3>
                        <a className="text-blue-600 dark:text-blue-400 hover:underline text-sm" href={ghResult.profileUrl} target="_blank" rel="noreferrer">
                          Ver perfil
                        </a>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="w-16 h-16 bg-gradient-to-br from-slate-900 dark:from-white to-slate-200 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-white dark:text-slate-900 font-bold text-xl">
                          {ghResult.score || 0}
                        </span>
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Score</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                      <div className="text-lg font-semibold text-slate-900 dark:text-white">{ghResult.stats?.publicRepos ?? 0}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Repos</div>
                    </div>
                    <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                      <div className="text-lg font-semibold text-slate-900 dark:text-white">{ghResult.stats?.totalStars ?? 0}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Stars</div>
                    </div>
                    <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                      <div className="text-lg font-semibold text-slate-900 dark:text-white">{ghResult.stats?.totalForks ?? 0}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Forks</div>
                    </div>
                  </div>
                  
                  {ghResult.stats?.topLanguages?.length > 0 && (
              <div>
                      <h4 className="font-medium text-slate-900 dark:text-white mb-2">Top Languages</h4>
                      <div className="flex flex-wrap gap-2">
                        {ghResult.stats.topLanguages.map((lang: any, i: number) => (
                          <span key={i} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
                            {lang.language}
                          </span>
                        ))}
                      </div>
              </div>
                  )}
                  
                  {ghResult.strengths?.length > 0 && (
                    <div>
                      <h4 className="font-medium text-green-700 dark:text-green-400 mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Pontos Fortes
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {ghResult.strengths.map((strength: string, i: number) => (
                          <span key={i} className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm">
                            {strength}
                          </span>
                        ))}
              </div>
            </div>
                  )}
                  
                  {ghResult.weaknesses?.length > 0 && (
                    <div>
                      <h4 className="font-medium text-orange-700 dark:text-orange-400 mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0 16 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Pontos de Melhoria
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {ghResult.weaknesses.map((weakness: string, i: number) => (
                          <span key={i} className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 rounded-full text-sm">
                            {weakness}
                          </span>
                        ))}
                      </div>
              </div>
            )}
                  
                  {ghResult.recommendations?.length > 0 && (
                    <div>
                      <h4 className="font-medium text-blue-700 dark:text-blue-400 mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0 16 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Recomendações
                      </h4>
                      <div className="space-y-2">
                        {ghResult.recommendations.map((rec: string, i: number) => (
                          <div key={i} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                            {rec}
                          </div>
                        ))}
                      </div>
              </div>
            )}
                  
            {ghResult.assessment && (
                    <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
                      <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                {ghResult.assessment}
                      </p>
              </div>
            )}
          </div>
        )}
      </div>
          </div>

          {/* LinkedIn Evaluation Card */}
          <div className="glass rounded-2xl p-8 card-hover animate-slide-in-right">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">LinkedIn Profile</h2>
                <p className="text-slate-600 dark:text-slate-400">Análise profissional completa</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-3">
          <input
                  className="flex-1 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus-ring transition-all"
                  placeholder="https://linkedin.com/in/username"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
          />
          <button
            onClick={async () => {
              setLiError(null); setLiResult(null); setLiLoading(true);
              try {
                const res = await fetch('/api/eval/linkedin', {
                  method: 'POST', headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ url: linkedinUrl })
                });
                const data = await res.json().catch(() => ({}));
                if (!res.ok) throw new Error(data?.error || `Falha (HTTP ${res.status})`);
                setLiResult(data);
              } catch (e:any) {
                setLiError(e?.message || 'Não foi possível avaliar o LinkedIn');
              } finally {
                setLiLoading(false);
              }
            }}
            disabled={liLoading || !linkedinUrl.trim()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed btn-hover focus-ring"
                >
                  {liLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Avaliando...
                    </div>
                  ) : 'Avaliar'}
          </button>
        </div>
              
              {liError && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400">
                  {liError}
                </div>
              )}
              
        {liResult && (
                <div className="space-y-4 p-6 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-2xl">
                        {liResult.score}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                      {liResult.name || 'Perfil LinkedIn'}
                    </h3>
                    {liResult.headline && (
                      <p className="text-slate-600 dark:text-slate-400 text-sm">
                        {liResult.headline}
                      </p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {liResult.strengths?.length > 0 && (
                      <div>
                        <h4 className="font-medium text-green-700 dark:text-green-400 mb-2 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Pontos Fortes
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {liResult.strengths.map((strength: string, i: number) => (
                            <span key={i} className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm">
                              {strength}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {liResult.weaknesses?.length > 0 && (
                      <div>
                        <h4 className="font-medium text-orange-700 dark:text-orange-400 mb-2 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0 16 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Pontos de Melhoria
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {liResult.weaknesses.map((weakness: string, i: number) => (
                            <span key={i} className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 rounded-full text-sm">
                              {weakness}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {liResult.experiences?.length > 0 && (
                      <div>
                        <h4 className="font-medium text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                          </svg>
                          Experiências ({liResult.experiences.length})
                        </h4>
                        <div className="space-y-2">
                          {liResult.experiences.slice(0, 3).map((exp: any, i: number) => (
                            <div key={i} className="text-sm text-slate-700 dark:text-slate-300 p-2 bg-slate-100 dark:bg-slate-700 rounded">
                              {exp.title && <div className="font-medium">{exp.title}</div>}
                              {exp.company && <div className="text-slate-600 dark:text-slate-400">{exp.company}</div>}
                              {exp.period && <div className="text-xs text-slate-500">{exp.period}</div>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {liResult.education?.length > 0 && (
                      <div>
                        <h4 className="font-medium text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.17 1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                          </svg>
                          Educação ({liResult.education.length})
                        </h4>
                        <div className="space-y-2">
                          {liResult.education.slice(0, 3).map((edu: any, i: number) => (
                            <div key={i} className="text-sm text-slate-700 dark:text-slate-300 p-2 bg-slate-100 dark:bg-slate-700 rounded">
                              {edu.institution && <div className="font-medium">{edu.institution}</div>}
                              {edu.degree && <div className="text-slate-600 dark:text-slate-400">{edu.degree}</div>}
                              {edu.field && <div className="text-slate-600 dark:text-slate-400">{edu.field}</div>}
                              {edu.period && <div className="text-xs text-slate-500">{edu.period}</div>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {liResult.skills?.length > 0 && (
                      <div>
                        <h4 className="font-medium text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Habilidades ({liResult.skills.length})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {liResult.skills.slice(0, 10).map((skill: any, i: number) => (
                            <span key={i} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm">
                              {skill.name}
                            </span>
                          ))}
                          {liResult.skills.length > 10 && (
                            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-full text-sm">
                              +{liResult.skills.length - 10} mais
                            </span>
              )}
            </div>
              </div>
            )}
                    
                    {liResult.recommendations?.length > 0 && (
                      <div>
                        <h4 className="font-medium text-blue-700 dark:text-blue-400 mb-2 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0 16 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                          Recomendações
                        </h4>
                        <div className="space-y-2">
                          {liResult.recommendations.map((rec: string, i: number) => (
                            <div key={i} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                              {rec}
                            </div>
                          ))}
                        </div>
              </div>
            )}
                  </div>
                  
            {liResult.assessment && (
                    <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
                      <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                {liResult.assessment}
                      </p>
              </div>
            )}
          </div>
        )}
            </div>
          </div>
        </div>

        {/* Certification Recommendations Section */}
        <div className="glass rounded-2xl p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Recomendações de Certificações
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Preencha o formulário abaixo para receber recomendações personalizadas de certificações 
              baseadas no seu perfil profissional e objetivos de carreira.
            </p>
      </div>

          <form onSubmit={submit} className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Cargo
                </label>
          <input
                  className="w-full rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus-ring transition-all"
            value={role}
            onChange={e => setRole(e.target.value)}
            placeholder="ex: desenvolvedor, devops"
          />
        </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Senioridade
                </label>
          <select
                  className="w-full rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 px-4 py-3 text-slate-900 dark:text-white focus-ring transition-all"
            value={seniority}
            onChange={e => setSeniority(e.target.value as any)}
          >
                  <option value="junior">Júnior</option>
                  <option value="pleno">Pleno</option>
                  <option value="senior">Sênior</option>
          </select>
        </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Área-alvo
                </label>
          <select
                  className="w-full rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 px-4 py-3 text-slate-900 dark:text-white focus-ring transition-all"
            value={targetArea}
            onChange={e => setTargetArea(e.target.value)}
          >
                  <option value="cloud">Cloud</option>
                  <option value="seguranca">Segurança</option>
                  <option value="gestao">Gestão</option>
                  <option value="dados">Dados</option>
                  <option value="dev">Desenvolvimento</option>
                  <option value="redes">Redes</option>
          </select>
        </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Metas (separe por vírgula)
                </label>
          <input
                  className="w-full rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus-ring transition-all"
            value={goals}
            onChange={e => setGoals(e.target.value)}
            placeholder="ex: arquitetura, segurança"
          />
        </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Orçamento (USD)
                </label>
          <input
            type="number"
                  className="w-full md:w-1/2 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus-ring transition-all"
            value={budgetUSD}
            onChange={e => setBudget(e.target.value === "" ? "" : Number(e.target.value))}
            placeholder="ex: 300"
          />
              </div>
        </div>

            <div className="text-center">
          <button
            type="submit"
            disabled={loading}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed btn-hover focus-ring"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Gerando Recomendações...
                  </div>
                ) : 'Gerar Recomendações'}
          </button>
        </div>
      </form>

      {err && (
            <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-center">
              Erro: {err}
            </div>
      )}
        </div>

        {/* Recommendations Results */}
      {!!items.length && (
          <div className="glass rounded-2xl p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Top Recomendações
              </h2>
            <PDFDownloadLink
              document={(
                <StudyPlanDoc
                  profile={{
                    role,
                    seniority,
                    targetArea,
                    goals: goals.split(",").map((s) => s.trim()).filter(Boolean),
                    budgetUSD: budgetUSD === '' ? undefined : Number(budgetUSD),
                  }}
                  items={items}
                  plan={buildStudyPlan(
                    {
                      role,
                      seniority,
                      targetArea,
                      goals: goals.split(",").map((s) => s.trim()).filter(Boolean),
                      budgetUSD: budgetUSD === '' ? undefined : Number(budgetUSD),
                    },
                    items,
                  )}
                />
              )}
              fileName={`careerpath-plano-${new Date().toISOString().slice(0,10)}.pdf`}
            >
              {({ loading }: { loading: boolean }) => (
                <button
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed btn-hover focus-ring"
                  disabled={loading}
                >
                  {loading ? "Gerando PDF..." : "Exportar PDF"}
                </button>
              )}
            </PDFDownloadLink>
          </div>
            
            <div className="grid gap-6">
              {items.map((item, index) => (
                <div key={item.certification.id} className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700 card-hover">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          #{index + 1}
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                          {item.certification.name}
                        </h3>
                      </div>
                      <div className="text-slate-600 dark:text-slate-400 text-sm">
                        {item.certification.provider} • {item.certification.level}
                        {item.certification.area ? ` • ${item.certification.area}` : ""}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">
                        {item.score}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Score</div>
                </div>
                </div>
                  
                  {item.reasons?.length && (
                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                      <h4 className="font-medium text-slate-900 dark:text-white mb-2">Por que esta certificação?</h4>
                      <ul className="space-y-1">
                        {item.reasons.map((reason, i) => (
                          <li key={i} className="text-slate-700 dark:text-slate-300 text-sm flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                            {reason}
              </li>
            ))}
          </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
        </div>
      )}

        {/* AI Explanation Section */}
      {items.length > 0 && (
          <div className="glass rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Explicação por IA
            </h3>
            <div className="space-y-4">
          <textarea
                placeholder="Quer perguntar algo específico sobre as recomendações? (opcional)"
            value={userQuestion}
            onChange={e => setUserQuestion(e.target.value)}
                rows={3}
                className="w-full rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus-ring transition-all resize-none" />
          <button
            onClick={async () => {
              setAiError(null);
              setAiAnswer("");
              setAiLoading(true);
              try {
                const res = await fetch("/api/ai/explain", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    profile: {
                      role, seniority, targetArea,
                      goals: goals.split(",").map(s => s.trim()).filter(Boolean),
                      budgetUSD: budgetUSD === '' ? undefined : Number(budgetUSD),
                    },
                    recommendations: { items },
                    question: userQuestion,
                  }),
                });
                const data = await res.json().catch(() => ({}));
                if (!res.ok) {
                  const msg = data?.error || `Falha na IA (HTTP ${res.status})`;
                  throw new Error(msg);
                }
                setAiAnswer(data.answer || "");
              } catch (e: any) {
                setAiError(e?.message || "Não foi possível obter a explicação por IA. Verifique créditos.");
              } finally {
                setAiLoading(false);
              }
            }}
            disabled={aiLoading}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed btn-hover focus-ring"
              >
                {aiLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Gerando Explicação...
                  </div>
                ) : 'Explicar com IA'}
          </button>

          {aiError && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400">
                  {aiError}
                </div>
          )}

          {aiAnswer && (
                <div className="p-6 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Resposta da IA:</h4>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {aiAnswer}
                    </p>
                  </div>
            </div>
          )}
            </div>
        </div>
      )}
      </div>
    </div>
  );
}
