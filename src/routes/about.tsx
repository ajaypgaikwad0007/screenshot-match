import { createFileRoute } from "@tanstack/react-router";
import { PublicPage } from "@/components/site";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About NutriPlan — NutriPlan" }, { name: "description", content: "NutriPlan helps you plan meals, estimate calorie needs with the Mifflin-St Jeor equation, and track nutrition using transparent rule-based recommendations." }, { property: "og:title", content: "About NutriPlan — NutriPlan" }, { property: "og:description", content: "NutriPlan helps you plan meals, estimate calorie needs with the Mifflin-St Jeor equation, and track nutrition using transparent rule-based recommendations." }] }),
  component: () => (
    <PublicPage>
      <section className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-4xl font-semibold">About NutriPlan</h1>
        <p className="mt-4 text-muted-foreground">NutriPlan helps you plan meals, estimate calorie needs with the Mifflin-St Jeor equation, and track nutrition using transparent rule-based recommendations.</p>
      </section>
    </PublicPage>
  ),
});
