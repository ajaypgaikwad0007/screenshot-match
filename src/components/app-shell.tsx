import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { LayoutDashboard, CalendarDays, UtensilsCrossed, Apple, LineChart, User, Shield, LogOut, Menu } from "lucide-react";
import { useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "./site";
import { useIsAdmin, useProfile, useUser } from "@/hooks/use-auth";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/planner", label: "Meal Planner", icon: CalendarDays },
  { to: "/meals", label: "Meal Log", icon: UtensilsCrossed },
  { to: "/foods", label: "Food Catalog", icon: Apple },
  { to: "/progress", label: "Progress", icon: LineChart },
  { to: "/profile", label: "Profile", icon: User },
] as const;

function Nav({ isAdmin, onNav }: { isAdmin: boolean; onNav?: () => void }) {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/login", replace: true });
  };
  const cls = "flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent";
  const active = { className: "bg-sidebar-accent text-sidebar-accent-foreground font-medium" };
  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <div className="px-2 pt-1"><Logo /></div>
      <div>
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Dashboard</p>
        <nav className="space-y-1">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className={cls} activeProps={active} onClick={onNav}>
              <n.icon className="size-4" /> {n.label}
            </Link>
          ))}
        </nav>
      </div>
      {isAdmin && (
        <div>
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Admin</p>
          <Link to="/admin" className={cls} activeProps={active} onClick={onNav}>
            <Shield className="size-4" /> Admin Panel
          </Link>
        </div>
      )}
      <button onClick={signOut} className={`${cls} mt-auto`}>
        <LogOut className="size-4" /> Logout
      </button>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const { data: isAdmin } = useIsAdmin(user?.id);
  const { data: profile } = useProfile(user?.id);
  const [open, setOpen] = useState(false);
  const name = profile?.full_name || user?.email || "";
  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 border-r bg-sidebar lg:block">
        <Nav isAdmin={!!isAdmin} />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/85 px-4 backdrop-blur md:px-8">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu"><Menu /></Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-sidebar p-0">
              <Nav isAdmin={!!isAdmin} onNav={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
          <div className="ml-auto flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium">{name}</p>
              <p className="text-xs text-muted-foreground">{isAdmin ? "Administrator" : "Member"}</p>
            </div>
            <div className="grid size-9 place-items-center rounded-full bg-primary-soft font-display font-semibold text-accent-foreground">
              {name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
