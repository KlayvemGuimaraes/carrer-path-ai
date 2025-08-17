import { createRoute, type RootRoute } from "@tanstack/react-router";
import App from "@/App";

function HomePage() {
  return (
    <div className="min-h-screen">
      <App />
    </div>
  );
}

export default (parentRoute: RootRoute) =>
  createRoute({
    path: "/",
    component: HomePage,
    getParentRoute: () => parentRoute,
  });
