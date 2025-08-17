import { useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import StudyPlanDoc from "./pdf/StudyPlanDoc";
import { buildStudyPlan } from "./lib/studyPlan";
import Footer from "./components/Footer";

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
  const [role, setRole] = useState("DevOps");
  const [seniority, setSeniority] = useState<"junior"|"pleno"|"senior">("senior");
  const [targetArea, setTargetArea] = useState("cloud");
  const [goals, setGoals] = useState("Aprender sobre Arquitetura, Aumento de salário, Especialização");
  const [budgetUSD, setBudget] = useState<number | ''>('');
  const [items, setItems] = useState<RecommendationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [aiAnswer, setAiAnswer] = useState<string>("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  
  // GitHub evaluation
  const [githubUrl, setGithubUrl] = useState<string>("");
  const [ghLoading, setGhLoading] = useState(false);
  const [ghError, setGhError] = useState<string | null>(null);
  const [ghResult, setGhResult] = useState<any | null>(null);
  
  // Theme
  const [isDark, setIsDark] = useState(false);

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
    <div className={`min-h-screen transition-[background-color,color,border-color] duration-500 ease-in-out ${isDark ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-[background] duration-500 ease-in-out pb-0">
        {/* Header with Theme Toggle */}
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-3 bg-white/20 dark:bg-slate-800/20 backdrop-blur-sm rounded-xl border border-white/30 dark:border-slate-700/30 hover:bg-white/30 dark:hover:bg-slate-800/30 transition-all"
          >
            {isDark ? (
              <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-slate-700" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </div>

        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
            <div className="text-center animate-fade-in-up">
              <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
                <span className="gradient-text">CarrerPath</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
                Sua jornada para o sucesso profissional começa aqui. 
                Avaliamos perfis, recomendamos certificações e criamos planos personalizados.
              </p>
              
              {/* Profile Cards CTA */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="/profile-cards"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Criar Profile Card Compartilhável
                </a>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  ✨ Nova funcionalidade
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {/* Certification Recommendations Section */}
          <div id="certifications" className="glass rounded-2xl p-8 mb-12">
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
                    className="w-full rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus-ring transition-[background-color,border-color,box-shadow] duration-200 ease-in-out"
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
                    className="w-full rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 px-4 py-3 text-slate-900 dark:text-white focus-ring transition-[background-color,border-color,box-shadow] duration-200 ease-in-out"
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
                    className="w-full rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 px-4 py-3 text-slate-900 dark:text-white focus-ring transition-[background-color,border-color,box-shadow] duration-200 ease-in-out"
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
                    className="w-full rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus-ring transition-[background-color,border-color,box-shadow] duration-200 ease-in-out"
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
                    className="w-full md:w-1/2 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus-ring transition-[background-color,border-color,box-shadow] duration-200 ease-in-out"
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
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed btn-hover focus-ring transition-[transform,box-shadow,background] duration-200 ease-in-out"
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
              <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 transition-[background-color,border-color] duration-300 ease-in-out">
                {err}
              </div>
            )}

            {items.length > 0 && (
              <div className="mt-12">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    Suas Recomendações
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Baseadas no seu perfil, aqui estão as certificações mais adequadas para sua carreira.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((item, index) => (
                    <div key={index} className="bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-[transform,box-shadow,background-color,border-color] duration-300 ease-in-out">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900 dark:text-white text-lg mb-1">
                            {item.certification.name}
                          </h4>
                          <p className="text-slate-600 dark:text-slate-400 text-sm">
                            {item.certification.provider}
                          </p>
                        </div>
                        <div className="ml-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                            {item.certification.level}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Score</span>
                          <span className="text-lg font-bold text-slate-900 dark:text-white">{item.score}</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(item.score, 100)}%` }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium text-slate-900 dark:text-white mb-2">Por que esta certificação?</h5>
                        <ul className="space-y-1">
                          {item.reasons.map((reason, reasonIndex) => (
                            <li key={reasonIndex} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                              {reason}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI Explanation Section */}
                <div id="ai" className="mt-12 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 p-6 transition-[background-color,border-color] duration-300 ease-in-out">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      Precisa de ajuda para entender as recomendações?
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Clique no botão abaixo para receber uma explicação detalhada das suas recomendações.
                    </p>
                  </div>

                  <div className="max-w-2xl mx-auto space-y-4">
                    <div className="text-center">
                      <button
                        onClick={async () => {
                          setAiLoading(true);
                          setAiError(null);
                          
                          try {
                            const res = await fetch('/api/ai/explain', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                profile: { 
                                  role, 
                                  seniority, 
                                  targetArea, 
                                  goals: goals.split(",").map(s => s.trim()).filter(Boolean), 
                                  budgetUSD: budgetUSD === '' || budgetUSD === null || isNaN(Number(budgetUSD)) ? undefined : Number(budgetUSD)
                                },
                                recommendations: { items },
                                question: "Explique detalhadamente por que essas certificações foram recomendadas para mim e qual a ordem ideal de estudo"
                              })
                            });
                            
                            const data = await res.json();
                            if (!res.ok) throw new Error(data?.error || 'Erro na explicação');
                            
                            setAiAnswer(data.answer);
                          } catch (e: any) {
                            setAiError(e.message || 'Erro ao gerar explicação');
                          } finally {
                            setAiLoading(false);
                          }
                        }}
                        disabled={aiLoading}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed btn-hover focus-ring transition-[transform,box-shadow,background] duration-200 ease-in-out"
                      >
                        {aiLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Gerando Explicação...
                          </div>
                        ) : 'Explicação Detalhada'}
                      </button>
                    </div>

                    {aiError && (
                      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 transition-[background-color,border-color] duration-300 ease-in-out">
                        {aiError}
                      </div>
                    )}

                    {aiAnswer && (
                      <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-xl transition-[background-color] duration-300 ease-in-out">
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Explicação:</h4>
                        <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                          {aiAnswer}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Study Plan Download */}
                <div className="mt-8 text-center">
                  <PDFDownloadLink
                    document={<StudyPlanDoc 
                      items={items} 
                      profile={{ role, seniority, targetArea, goals: goals.split(",").map(s => s.trim()).filter(Boolean) }} 
                      plan={buildStudyPlan({ role, seniority, targetArea, goals: goals.split(",").map(s => s.trim()).filter(Boolean) }, items)}
                    />}
                    fileName="plano-estudo-certificacoes.pdf"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg btn-hover focus-ring transition-[transform,box-shadow,background] duration-200 ease-in-out"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Baixar Plano de Estudo (PDF)
                  </PDFDownloadLink>
                </div>
              </div>
            )}
          </div>

          {/* GitHub Evaluation Section */}
          <div id="github" className="mt-12 glass rounded-2xl p-8 card-hover animate-slide-in-right">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white dark:text-slate-900" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">GitHub</h2>
                <p className="text-slate-600 dark:text-slate-400">Análise do seu perfil GitHub</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/seu-usuario"
                  className="flex-1 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus-ring transition-[background-color,border-color,box-shadow] duration-200 ease-in-out"
                />
                <button
                  onClick={async () => {
                    if (!githubUrl) return;
                    
                    setGhError(null); 
                    setGhResult(null); 
                    setGhLoading(true);
                    
                    try {
                      const username = githubUrl.replace(/^https?:\/\/github\.com\//, '').split('/')[0];
                      const res = await fetch('/api/eval/github', {
                        method: 'POST', 
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username })
                      });
                      const data = await res.json().catch(() => ({}));
                      if (!res.ok) throw new Error(data?.error || `Falha (HTTP ${res.status})`);
                      setGhResult(data);
                    } catch (e:any) {
                      setGhError(e?.message || 'Não foi possível avaliar o perfil');
                    } finally {
                      setGhLoading(false);
                    }
                  }}
                  disabled={ghLoading || !githubUrl}
                  className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed btn-hover focus-ring transition-[background-color,text-color,transform,box-shadow] duration-200 ease-in-out"
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
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 transition-[background-color,border-color] duration-300 ease-in-out">
                  {ghError}
                </div>
              )}
              
              {ghResult && (
                <div className="space-y-4 p-6 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 transition-[background-color,border-color] duration-300 ease-in-out">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-2xl">
                        {ghResult.score}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                      {ghResult.username}
                    </h3>
                    {ghResult.name && (
                      <p className="text-slate-600 dark:text-slate-400 text-sm">
                        {ghResult.name}
                      </p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
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
                  </div>
                  
                  {ghResult.assessment && (
                    <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg transition-[background-color] duration-300 ease-in-out">
                      <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                        {ghResult.assessment}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      <style>{`
        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        /* Glass morphism removido - usando estilo global */
        
        .card-hover {
          transition: all 0.3s ease;
        }
        
        .card-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        
        .btn-hover {
          transition: all 0.2s ease;
        }
        
        .btn-hover:hover {
          transform: translateY(-1px);
        }
        
        .focus-ring:focus {
          outline: none;
          ring: 2px;
          ring-color: #3b82f6;
          ring-offset: 2px;
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }
        
        .animate-slide-in-right {
          animation: slideInRight 0.6s ease-out;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
} 
