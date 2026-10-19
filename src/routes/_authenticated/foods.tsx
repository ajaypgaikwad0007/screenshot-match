import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Empty } from "@/components/kit";

export const Route = createFileRoute("/_authenticated/foods")({
  head: () => ({ meta: [{ title: "Food Catalog — NutriPlan" }, { name: "description", content: "Food Catalog in NutriPlan diet planner." }] }),
  component: () => (
    <div>
      <PageHeader title="Food Catalog" />
      <Empty title="This section is not built yet." />
    </div>
  ),
});
