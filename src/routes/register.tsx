import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/auth-form";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Register — NutriPlan" }, { name: "description", content: "Create your free NutriPlan account." }] }),
  component: () => <AuthForm mode="register" />,
});
