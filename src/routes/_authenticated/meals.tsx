import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Empty } from "@/components/kit";

export const Route = createFileRoute("/_authenticated/meals")({
  head: () => ({ meta: [{ title: "Meal Log — NutriPlan" }, { name: "description", content: "Meal Log in NutriPlan diet planner." }] }),
  component: () => (
    <div>
      <PageHeader title="Meal Log" />
      <Empty title="This section is not built yet." />
    </div>
  ),
});
