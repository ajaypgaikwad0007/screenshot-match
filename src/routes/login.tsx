import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/auth-form";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — NutriPlan" }, { name: "description", content: "Sign in to your NutriPlan diet planner." }] }),
  component: () => <AuthForm mode="login" />,
});
