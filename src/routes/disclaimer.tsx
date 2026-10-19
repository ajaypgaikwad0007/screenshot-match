import { createFileRoute } from "@tanstack/react-router";
import { PublicPage } from "@/components/site";

export const Route = createFileRoute("/disclaimer")({
  head: () => ({ meta: [{ title: "Disclaimer — NutriPlan" }, { name: "description", content: "All calculations and plans are estimates based on sample data. This is not medical advice or a prescribed diet." }, { property: "og:title", content: "Disclaimer — NutriPlan" }, { property: "og:description", content: "All calculations and plans are estimates based on sample data. This is not medical advice or a prescribed diet." }] }),
  component: () => (
    <PublicPage>
      <section className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-4xl font-semibold">Disclaimer</h1>
        <p className="mt-4 text-muted-foreground">All calculations and plans are estimates based on sample data. This is not medical advice or a prescribed diet.</p>
      </section>
    </PublicPage>
  ),
});
