import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Empty } from "@/components/kit";

export const Route = createFileRoute("/_authenticated/progress")({
  head: () => ({ meta: [{ title: "Progress — NutriPlan" }, { name: "description", content: "Progress in NutriPlan diet planner." }] }),
  component: () => (
    <div>
      <PageHeader title="Progress" />
      <Empty title="This section is not built yet." />
    </div>
  ),
});
