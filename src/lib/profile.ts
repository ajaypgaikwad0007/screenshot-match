import { basisFromGender, calculate, type Activity, type CalcResult, type Goal, type Gender, type CalcBasis } from "./nutrition";
import type { Tables } from "@/integrations/supabase/types";

export type Profile = Tables<"profiles">;

export function isProfileComplete(p?: Profile | null) {
  return !!p && !!p.age && !!p.height_cm && !!p.weight_kg && !!p.gender;
}

export function profileCompletion(p?: Profile | null) {
  if (!p) return 0;
  const fields = [p.full_name, p.age, p.gender, p.height_cm, p.weight_kg, p.activity_level, p.dietary_preference, p.fitness_goal];
  return Math.round((fields.filter(Boolean).length / fields.length) * 100);
}

export function calcFromProfile(p?: Profile | null): CalcResult | null {
  if (!isProfileComplete(p)) return null;
  try {
    return calculate(
      {
        age: p!.age!,
        heightCm: Number(p!.height_cm),
        weightKg: Number(p!.weight_kg),
        basis: basisFromGender(p!.gender as Gender, p!.calc_basis as CalcBasis | null),
        activity: (p!.activity_level ?? "sedentary") as Activity,
        goal: (p!.fitness_goal ?? "maintain") as Goal,
      },
      { medicalFlag: p!.medical_flag },
    );
  } catch {
    return null;
  }
}

export const today = () => new Date().toISOString().slice(0, 10);
export const addDays = (d: string, n: number) => {
  const x = new Date(d + "T00:00:00Z");
  x.setUTCDate(x.getUTCDate() + n);
  return x.toISOString().slice(0, 10);
};
