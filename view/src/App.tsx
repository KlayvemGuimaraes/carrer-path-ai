import { useState } from "react";

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
  // Estado para a explicação por IA
  const [aiAnswer, setAiAnswer] = useState<string>("");
  const [userQuestion, setUserQuestion] = useState<string>("");

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
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-white">CareerAI — Recomendações de Certificações</h1>

      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1">
          <label className="block text-sm text-slate-300 mb-1">Cargo</label>
          <input
            className="w-full rounded-lg bg-slate-900/60 border border-slate-600 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={role}
            onChange={e => setRole(e.target.value)}
            placeholder="ex: desenvolvedor, devops"
          />
        </div>

        <div className="col-span-1">
          <label className="block text-sm text-slate-300 mb-1">Senioridade</label>
          <select
            className="w-full rounded-lg bg-slate-900/60 border border-slate-600 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={seniority}
            onChange={e => setSeniority(e.target.value as any)}
          >
            <option value="junior">júnior</option>
            <option value="pleno">pleno</option>
            <option value="senior">sênior</option>
          </select>
        </div>

        <div className="col-span-1">
          <label className="block text-sm text-slate-300 mb-1">Área-alvo</label>
          <select
            className="w-full rounded-lg bg-slate-900/60 border border-slate-600 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={targetArea}
            onChange={e => setTargetArea(e.target.value)}
          >
            <option value="cloud">cloud</option>
            <option value="seguranca">segurança</option>
            <option value="gestao">gestão</option>
            <option value="dados">dados</option>
            <option value="dev">dev</option>
            <option value="redes">redes</option>
          </select>
        </div>

        <div className="col-span-1">
          <label className="block text-sm text-slate-300 mb-1">Metas (separe por vírgula)</label>
          <input
            className="w-full rounded-lg bg-slate-900/60 border border-slate-600 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={goals}
            onChange={e => setGoals(e.target.value)}
            placeholder="ex: arquitetura, segurança"
          />
        </div>

        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm text-slate-300 mb-1">Orçamento (USD)</label>
          <input
            type="number"
            className="w-full md:w-1/2 rounded-lg bg-slate-900/60 border border-slate-600 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={budgetUSD}
            onChange={e => setBudget(e.target.value === "" ? "" : Number(e.target.value))}
            placeholder="ex: 300"
          />
        </div>

        <div className="col-span-1 md:col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white px-4 py-2 shadow-md transition-colors"
          >
            {loading ? "Gerando..." : "Recomendar"}
          </button>
        </div>
      </form>

      {err && (
        <p className="text-red-400 text-sm">Erro: {err}</p>
      )}

      {!!items.length && (
        <div className="space-y-3">
          <h2 className="text-lg font-medium text-white mt-2">Top recomendações</h2>
          <ul className="grid gap-3">
            {items.map((it) => (
              <li key={it.certification.id} className="rounded-xl border border-slate-700 bg-slate-900/40 p-4">
                <div className="flex items-center justify-between">
                  <strong className="text-slate-100">{it.certification.name}</strong>
                  <span className="text-slate-400 text-sm">Score: {it.score}</span>
                </div>
                <div className="text-slate-400 text-sm mt-1">
                  {it.certification.provider} • {it.certification.level}{it.certification.area ? ` • ${it.certification.area}` : ""}
                </div>
                {it.reasons?.length ? (
                  <ul className="list-disc pl-5 mt-2 text-slate-300 text-sm">
                    {it.reasons.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      )}

      {items.length > 0 && (
        <div className="mt-4">
          <h3 className="text-base font-medium text-white">Explicação por IA</h3>
          <textarea
            placeholder="Quer perguntar algo? (opcional)"
            value={userQuestion}
            onChange={e => setUserQuestion(e.target.value)}
            rows={3}
            className="w-full rounded-lg bg-slate-900/60 border border-slate-600 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={async () => {
              setAiAnswer("");
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
              const data = await res.json();
              setAiAnswer(data.answer || "");
            }}
            className="mt-2 inline-flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 shadow-md transition-colors"
          >
            Explicar recomendações com IA
          </button>

          {aiAnswer && (
            <div className="whitespace-pre-wrap border border-slate-700 bg-slate-900/40 text-slate-100 p-3 rounded-lg mt-3">
              {aiAnswer}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
