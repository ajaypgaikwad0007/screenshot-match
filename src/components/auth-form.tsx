import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PublicPage } from "./site";

const schema = z.object({
  name: z.string().trim().max(100).optional(),
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
});

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const navigate = useNavigate();
  const [f, setF] = useState({ name: "", email: "", password: "", confirm: "", terms: false });
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const p = schema.safeParse(f);
    if (!p.success) return toast.error(p.error.issues[0]?.message);
    if (mode === "register") {
      if (!f.name.trim()) return toast.error("Enter your name");
      if (f.password !== f.confirm) return toast.error("Passwords do not match");
      if (!f.terms) return toast.error("Please accept the terms");
    }
    setBusy(true);
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email: f.email, password: f.password });
      setBusy(false);
      if (error) return toast.error("Invalid email or password");
      navigate({ to: "/dashboard" });
    } else {
      const { error } = await supabase.auth.signUp({
        email: f.email,
        password: f.password,
        options: { emailRedirectTo: window.location.origin, data: { full_name: f.name.trim() } },
      });
      setBusy(false);
      if (error) return toast.error(error.message);
      toast.success("Check your email to confirm your account.");
    }
  };

  return (
    <PublicPage>
      <form onSubmit={submit} className="card-soft mx-auto mt-16 max-w-md space-y-4 p-8">
        <h1 className="text-2xl font-semibold">{mode === "login" ? "Welcome back" : "Create your account"}</h1>
        {mode === "register" && (
          <div className="space-y-1"><Label>Full name</Label><Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
        )}
        <div className="space-y-1"><Label>Email</Label><Input type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
        <div className="space-y-1">
          <Label>Password</Label>
          <div className="flex gap-2">
            <Input type={show ? "text" : "password"} value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
            <Button type="button" variant="outline" onClick={() => setShow(!show)}>{show ? "Hide" : "Show"}</Button>
          </div>
        </div>
        {mode === "register" && (
          <>
            <div className="space-y-1"><Label>Confirm password</Label><Input type="password" value={f.confirm} onChange={(e) => setF({ ...f, confirm: e.target.value })} /></div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.terms} onChange={(e) => setF({ ...f, terms: e.target.checked })} /> I accept the terms and disclaimer</label>
          </>
        )}
        <Button className="w-full" disabled={busy}>{busy ? "Please wait…" : mode === "login" ? "Login" : "Create account"}</Button>
        <p className="text-center text-sm text-muted-foreground">
          {mode === "login" ? <>No account? <Link to="/register" className="text-primary">Register</Link></> : <>Have an account? <Link to="/login" className="text-primary">Login</Link></>}
        </p>
      </form>
    </PublicPage>
  );
}
