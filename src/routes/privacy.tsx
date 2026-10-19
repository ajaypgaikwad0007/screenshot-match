import { createFileRoute } from "@tanstack/react-router";
import { PublicPage } from "@/components/site";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy Policy — NutriPlan" }, { name: "description", content: "We store only the profile and meal data you enter, and only you can see your records." }, { property: "og:title", content: "Privacy Policy — NutriPlan" }, { property: "og:description", content: "We store only the profile and meal data you enter, and only you can see your records." }] }),
  component: () => (
    <PublicPage>
      <section className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-4xl font-semibold">Privacy Policy</h1>
        <p className="mt-4 text-muted-foreground">We store only the profile and meal data you enter, and only you can see your records.</p>
      </section>
    </PublicPage>
  ),
});
