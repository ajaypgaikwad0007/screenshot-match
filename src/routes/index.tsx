import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicPage } from "@/components/site";
import { Button } from "@/components/ui/button";
import hero from "@/assets/hero-thali.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NutriPlan — Your Personal Diet Planner" },
      { name: "description", content: "Plan daily meals, estimate calorie needs and track nutrition with rule-based Indian diet plans." },
      { property: "og:title", content: "NutriPlan — Your Personal Diet Planner" },
      { property: "og:description", content: "Personalized meal planning and nutrition tracking." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <PublicPage>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2">
        <div>
          <h1 className="text-5xl font-semibold leading-tight">Your Personal Diet Planner</h1>
          <p className="mt-4 text-lg text-muted-foreground">Personalized meal plans, calorie estimates and daily nutrition tracking — built around everyday Indian foods.</p>
          <div className="mt-8 flex gap-3">
            <Button asChild size="lg"><Link to="/register">Get Started</Link></Button>
            <Button asChild size="lg" variant="outline"><Link to="/login">Login</Link></Button>
          </div>
        </div>
        <img src={hero} alt="Healthy Indian thali" width={1280} height={960} className="rounded-2xl shadow-card" />
      </section>
      <section className="mx-auto grid max-w-6xl gap-4 px-4 md:grid-cols-3">
        {[
          ["Calorie tracking", "Log meals and see calories against your daily target."],
          ["Personalized plans", "Rule-based plans from your profile, preferences and goal."],
          ["Nutrition monitoring", "Protein, carbs and fat progress every day."],
        ].map(([t, d]) => (
          <div key={t} className="card-soft p-6"><h3 className="text-lg font-semibold">{t}</h3><p className="mt-2 text-sm text-muted-foreground">{d}</p></div>
        ))}
      </section>
    </PublicPage>
  );
}
