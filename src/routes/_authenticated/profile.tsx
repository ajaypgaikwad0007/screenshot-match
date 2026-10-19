import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Empty } from "@/components/kit";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "Profile — NutriPlan" }, { name: "description", content: "Profile in NutriPlan diet planner." }] }),
  component: () => (
    <div>
      <PageHeader title="Profile" />
      <Empty title="This section is not built yet." />
    </div>
  ),
});
