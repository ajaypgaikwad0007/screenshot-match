import { Link } from "@tanstack/react-router";
import { Leaf } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
      <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
        <Leaf className="size-4" />
      </span>
      NutriPlan
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Logo />
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "text-foreground font-medium" }}>Home</Link>
          <Link to="/about" activeProps={{ className: "text-foreground font-medium" }}>About</Link>
        </nav>
        <div className="flex gap-2">
          <Button asChild variant="ghost" size="sm"><Link to="/login">Login</Link></Button>
          <Button asChild size="sm"><Link to="/register">Get Started</Link></Button>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t bg-card">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            Personal meal planning and nutrition tracking with transparent, rule-based recommendations.
          </p>
        </div>
        <div className="space-y-2 text-sm">
          <h4 className="font-semibold">Product</h4>
          <Link to="/about" className="block text-muted-foreground hover:text-foreground">About</Link>
          <a href="mailto:support@nutriplan.app" className="block text-muted-foreground hover:text-foreground">Contact</a>
        </div>
        <div className="space-y-2 text-sm">
          <h4 className="font-semibold">Legal</h4>
          <Link to="/privacy" className="block text-muted-foreground hover:text-foreground">Privacy Policy</Link>
          <Link to="/disclaimer" className="block text-muted-foreground hover:text-foreground">Disclaimer</Link>
        </div>
      </div>
      <p className="border-t py-4 text-center text-xs text-muted-foreground">
        Estimates only — not medical advice. © {new Date().getFullYear()} NutriPlan
      </p>
    </footer>
  );
}

export function PublicPage({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
