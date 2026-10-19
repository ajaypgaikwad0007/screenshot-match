// Pure, rule-based nutrition logic. No AI/ML. All values are estimates, not medical advice.

export type Gender = "male" | "female" | "other" | "prefer_not";
export type CalcBasis = "male" | "female" | "average";
export type Activity = "sedentary" | "light" | "moderate" | "very" | "extra";
export type Diet = "vegan" | "vegetarian" | "eggetarian" | "non_vegetarian";
export type Goal = "lose" | "maintain" | "gain";
export type MealType = "breakfast" | "mid_morning" | "lunch" | "evening" | "dinner";

export const ACTIVITY_MULTIPLIERS: Record<Activity, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very: 1.725,
  extra: 1.9,
};

export const ACTIVITY_LABELS: Record<Activity, string> = {
  sedentary: "Sedentary",
  light: "Lightly active",
  moderate: "Moderately active",
  very: "Very active",
  extra: "Extremely active",
};
export const DIET_LABELS: Record<Diet, string> = {
  vegan: "Vegan",
  vegetarian: "Vegetarian",
  eggetarian: "Eggetarian",
  non_vegetarian: "Non-vegetarian",
};
export const GOAL_LABELS: Record<Goal, string> = {
  lose: "Weight loss",
  maintain: "Weight maintenance",
  gain: "Weight gain",
};
export const MEAL_LABELS: Record<MealType, string> = {
  breakfast: "Breakfast",
  mid_morning: "Mid-morning snack",
  lunch: "Lunch",
  evening: "Evening snack",
  dinner: "Dinner",
};
export const MEAL_ORDER: MealType[] = ["breakfast", "mid_morning", "lunch", "evening", "dinner"];

/** Conservative goal adjustment in kcal. */
export const GOAL_ADJUSTMENT: Record<Goal, number> = { lose: -400, maintain: 0, gain: 300 };
export const MIN_TARGET = { female: 1200, male: 1500, average: 1350 } as const;

export interface CalcInput {
  age: number;
  heightCm: number;
  weightKg: number;
  basis: CalcBasis;
  activity: Activity;
  goal: Goal;
}

export interface CalcResult {
  bmr: number;
  maintenance: number;
  target: number;
  basisEstimated: boolean;
  floored: boolean;
  warnings: string[];
}

export function validateRanges(i: Pick<CalcInput, "age" | "heightCm" | "weightKg">): string | null {
  if (!(i.age >= 10 && i.age <= 100)) return "Age must be between 10 and 100.";
  if (!(i.heightCm >= 100 && i.heightCm <= 250)) return "Height must be between 100 and 250 cm.";
  if (!(i.weightKg >= 25 && i.weightKg <= 300)) return "Weight must be between 25 and 300 kg.";
  return null;
}

/** Mifflin-St Jeor BMR. "average" = midpoint of male (+5) and female (-161) constants, labelled as estimate. */
export function bmr(i: Pick<CalcInput, "age" | "heightCm" | "weightKg" | "basis">): number {
  const base = 10 * i.weightKg + 6.25 * i.heightCm - 5 * i.age;
  const c = i.basis === "male" ? 5 : i.basis === "female" ? -161 : -78;
  return base + c;
}

export function calculate(i: CalcInput, opts: { medicalFlag?: boolean } = {}): CalcResult {
  const err = validateRanges(i);
  if (err) throw new Error(err);
  const b = Math.round(bmr(i));
  const maintenance = Math.round(b * ACTIVITY_MULTIPLIERS[i.activity]);
  let target = maintenance + GOAL_ADJUSTMENT[i.goal];
  const floor = MIN_TARGET[i.basis];
  let floored = false;
  if (target < floor) {
    target = Math.max(floor, Math.min(maintenance, floor));
    floored = true;
  }
  target = Math.round(target / 10) * 10;
  const warnings: string[] = [];
  if (i.age < 18)
    warnings.push("You are under 18. Generic calorie targets may not suit growing bodies — please consult a doctor or dietitian.");
  if (opts.medicalFlag)
    warnings.push("You reported a medical condition. Please follow your doctor's advice over this generic plan.");
  if (floored) warnings.push("Target was raised to a safe minimum to avoid an overly aggressive deficit.");
  if (i.basis === "average")
    warnings.push("Calculated with an averaged formula because no male/female basis was chosen — treat as a rough estimate.");
  return { bmr: b, maintenance, target, basisEstimated: i.basis === "average", floored, warnings };
}

export function basisFromGender(g: Gender | null | undefined, explicit?: CalcBasis | null): CalcBasis {
  if (g === "male" || g === "female") return g;
  return explicit ?? "average";
}

// ---------- Foods & recommendation engine ----------

export interface Food {
  id: string;
  name: string;
  category: string;
  dietary_type: Diet;
  meal_slots: string[];
  serving_size: number;
  serving_unit: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  allergens: string[];
  is_active: boolean;
}

export interface Macros {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
}

export const zero = (): Macros => ({ calories: 0, protein: 0, carbohydrates: 0, fat: 0 });

export function scale(f: Pick<Food, "calories" | "protein" | "carbohydrates" | "fat">, qty: number): Macros {
  return {
    calories: Math.round(Number(f.calories) * qty),
    protein: Math.round(Number(f.protein) * qty * 10) / 10,
    carbohydrates: Math.round(Number(f.carbohydrates) * qty * 10) / 10,
    fat: Math.round(Number(f.fat) * qty * 10) / 10,
  };
}

export function add(a: Macros, b: Macros): Macros {
  return {
    calories: a.calories + b.calories,
    protein: Math.round((a.protein + b.protein) * 10) / 10,
    carbohydrates: Math.round((a.carbohydrates + b.carbohydrates) * 10) / 10,
    fat: Math.round((a.fat + b.fat) * 10) / 10,
  };
}

const DIET_ALLOWED: Record<Diet, Diet[]> = {
  vegan: ["vegan"],
  vegetarian: ["vegan", "vegetarian"],
  eggetarian: ["vegan", "vegetarian", "eggetarian"],
  non_vegetarian: ["vegan", "vegetarian", "eggetarian", "non_vegetarian"],
};

export function filterFoods(foods: Food[], diet: Diet, allergies: string[], exclusions: string[]): Food[] {
  const al = allergies.map((a) => a.trim().toLowerCase()).filter(Boolean);
  const ex = exclusions.map((a) => a.trim().toLowerCase()).filter(Boolean);
  return foods.filter(
    (f) =>
      f.is_active &&
      DIET_ALLOWED[diet].includes(f.dietary_type) &&
      !f.allergens.some((a) => al.includes(a.toLowerCase())) &&
      !ex.some((e) => f.name.toLowerCase().includes(e)),
  );
}

export function mealSlots(count: number): { type: MealType; share: number }[] {
  if (count <= 3)
    return [
      { type: "breakfast", share: 0.3 },
      { type: "lunch", share: 0.4 },
      { type: "dinner", share: 0.3 },
    ];
  if (count === 4)
    return [
      { type: "breakfast", share: 0.25 },
      { type: "lunch", share: 0.35 },
      { type: "evening", share: 0.1 },
      { type: "dinner", share: 0.3 },
    ];
  return [
    { type: "breakfast", share: 0.25 },
    { type: "mid_morning", share: 0.1 },
    { type: "lunch", share: 0.3 },
    { type: "evening", share: 0.1 },
    { type: "dinner", share: 0.25 },
  ];
}

/** Which categories make up each meal, in order. */
const MEAL_TEMPLATE: Record<MealType, string[][]> = {
  breakfast: [["grain", "protein"], ["fruit", "dairy"]],
  mid_morning: [["fruit", "nuts", "dairy", "snack"]],
  lunch: [["grain"], ["protein"], ["vegetable"], ["dairy"]],
  evening: [["snack", "nuts", "fruit", "dairy"]],
  dinner: [["grain"], ["protein"], ["vegetable"]],
};

export interface PlanItem {
  meal_type: MealType;
  food: Food;
  quantity: number;
}

export interface DayPlan {
  items: PlanItem[];
  totals: Macros;
  target: number;
  missing: MealType[];
}

const roundQ = (q: number) => Math.min(3, Math.max(0.5, Math.round(q * 4) / 4));

function candidates(pool: Food[], meal: MealType, cats: string[]): Food[] {
  // Prefer protein-dense options first, then by name — stable, deterministic ordering.
  return pool
    .filter((f) => f.meal_slots.includes(meal) && cats.includes(f.category))
    .sort((a, b) => b.protein / Math.max(1, b.calories) - a.protein / Math.max(1, a.calories) || a.name.localeCompare(b.name));
}

/** Deterministically pick foods for one meal. `variant` rotates choices (day index, regenerate count). */
export function buildMeal(pool: Food[], meal: MealType, kcalTarget: number, variant: number): PlanItem[] {
  const picked: Food[] = [];
  for (const cats of MEAL_TEMPLATE[meal]) {
    const c = candidates(pool, meal, cats).filter((f) => !picked.includes(f));
    if (c.length) picked.push(c[variant % c.length]);
  }
  if (!picked.length) return [];
  const base = picked.reduce((s, f) => s + Number(f.calories), 0);
  const factor = kcalTarget / base;
  return picked.map((food) => ({ meal_type: meal, food, quantity: roundQ(factor) }));
}

export function generateDay(
  foods: Food[],
  opts: { diet: Diet; allergies: string[]; exclusions: string[]; mealsPerDay: number; target: number; variant?: number },
): DayPlan {
  const pool = filterFoods(foods, opts.diet, opts.allergies, opts.exclusions);
  const items: PlanItem[] = [];
  const missing: MealType[] = [];
  for (const s of mealSlots(opts.mealsPerDay)) {
    const meal = buildMeal(pool, s.type, opts.target * s.share, opts.variant ?? 0);
    if (!meal.length) missing.push(s.type);
    items.push(...meal);
  }
  const totals = items.reduce((t, i) => add(t, scale(i.food, i.quantity)), zero());
  return { items, totals, target: opts.target, missing };
}

/** Next alternative food for an item (same meal, same category). */
export function alternativeFor(foods: Food[], item: PlanItem, diet: Diet, allergies: string[], exclusions: string[]): Food | null {
  const pool = filterFoods(foods, diet, allergies, exclusions);
  const c = candidates(pool, item.meal_type, [item.food.category]);
  if (c.length < 2) return null;
  const idx = c.findIndex((f) => f.id === item.food.id);
  return c[(idx + 1) % c.length];
}
