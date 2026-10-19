import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Empty } from "@/components/kit";

export const Route = createFileRoute("/_authenticated/planner")({
  head: () => ({ meta: [{ title: "Meal Planner — NutriPlan" }, { name: "description", content: "Meal Planner in NutriPlan diet planner." }] }),
  component: () => (
    <div>
      <PageHeader title="Meal Planner" />
      <Empty title="This section is not built yet." />
    </div>
  ),
});
