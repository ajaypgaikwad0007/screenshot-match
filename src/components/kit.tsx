import type { ReactNode } from "react";
import { Loader2, Inbox, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageHeader({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{eyebrow}</p>}
        <h1 className="text-3xl font-semibold">{title}</h1>
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}

export function StatCard({ label, value, unit, hint, icon, tone }: { label: string; value: ReactNode; unit?: string; hint?: string; icon?: ReactNode; tone?: "primary" }) {
  return (
    <div className={cn("card-soft p-4", tone === "primary" && "border-primary bg-primary text-primary-foreground")}>
      <div className="flex items-center justify-between">
        <p className={cn("text-xs font-medium", tone === "primary" ? "text-primary-foreground/80" : "text-muted-foreground")}>{label}</p>
        {icon}
      </div>
      <p className="mt-2 font-display text-2xl font-semibold">
        {value}
        {unit && <span className="ml-1 text-sm font-normal opacity-70">{unit}</span>}
      </p>
      {hint && <p className={cn("mt-1 text-xs", tone === "primary" ? "text-primary-foreground/80" : "text-muted-foreground")}>{hint}</p>}
    </div>
  );
}

const barTone = { calories: "bg-primary", protein: "bg-protein", carbohydrates: "bg-carbs", fat: "bg-fat" } as const;

export function MacroBar({ label, value, target, unit = "g", kind }: { label: string; value: number; target: number; unit?: string; kind: keyof typeof barTone }) {
  const pct = target > 0 ? Math.min(100, (value / target) * 100) : 0;
  const over = target > 0 && value > target * 1.05;
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className={cn("text-muted-foreground", over && "text-destructive")}>
          {Math.round(value)} / {Math.round(target)} {unit}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div className={cn("h-full rounded-full transition-all", barTone[kind])} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function Ring({ value, target, size = 140 }: { value: number; target: number; size?: number }) {
  const r = size / 2 - 10;
  const c = 2 * Math.PI * r;
  const pct = target > 0 ? Math.min(1, value / target) : 0;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={10} className="fill-none stroke-muted" />
      <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={10} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct)} className="fill-none stroke-primary transition-all" />
    </svg>
  );
}

export function Loading({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
      <Loader2 className="size-4 animate-spin" /> {label}
    </div>
  );
}

export function Empty({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed bg-card/50 px-4 py-10 text-center">
      <Inbox className="size-6 text-muted-foreground" />
      <p className="font-medium">{title}</p>
      {children && <div className="text-sm text-muted-foreground">{children}</div>}
    </div>
  );
}

export function ErrorBox({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
      <AlertTriangle className="size-4" /> {message}
    </div>
  );
}

export function Disclaimer() {
  return (
    <p className="rounded-lg bg-secondary px-3 py-2 text-xs text-secondary-foreground">
      All values are estimates based on sample nutrition data and a rule-based algorithm. This is not medical advice or a prescribed diet.
    </p>
  );
}
