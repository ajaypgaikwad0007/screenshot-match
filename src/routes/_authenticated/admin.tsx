import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Empty } from "@/components/kit";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin Panel — NutriPlan" }, { name: "description", content: "Admin Panel in NutriPlan diet planner." }] }),
  component: () => (
    <div>
      <PageHeader title="Admin Panel" />
      <Empty title="This section is not built yet." />
    </div>
  ),
});
