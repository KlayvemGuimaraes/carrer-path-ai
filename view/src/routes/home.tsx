import { createRoute, type RootRoute } from "@tanstack/react-router";
import App from "@/App";

function HomePage() {
  return (
    <div className="bg-slate-900 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4">
        <header className="flex items-center gap-3 mb-8">
          <img src="/logo.png" alt="CareerAI" className="w-8 h-8" />
          <div>
            <h1 className="text-xl font-semibold text-white">CareerAI</h1>
            <p className="text-sm text-slate-400">Recomendações de Certificações</p>
          </div>
        </header>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
          {/* Render our app UI */}
          <App />
        </div>
      </div>
    </div>
  );
}

export default (parentRoute: RootRoute) =>
  createRoute({
    path: "/",
    component: HomePage,
    getParentRoute: () => parentRoute,
  });
