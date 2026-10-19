import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Empty } from "@/components/kit";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — NutriPlan" }, { name: "description", content: "Dashboard in NutriPlan diet planner." }] }),
  component: () => (
    <div>
      <PageHeader title="Dashboard" />
      <Empty title="This section is not built yet." />
    </div>
  ),
});
