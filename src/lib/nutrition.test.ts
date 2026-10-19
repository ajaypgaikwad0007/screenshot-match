import { describe, it, expect } from "vitest";
import { bmr, calculate, filterFoods, generateDay, scale, type Food } from "./nutrition";

describe("Mifflin-St Jeor", () => {
  it("male BMR", () => {
    expect(bmr({ age: 30, heightCm: 175, weightKg: 70, basis: "male" })).toBe(1648.75);
  });
  it("female BMR", () => {
    expect(bmr({ age: 30, heightCm: 160, weightKg: 60, basis: "female" })).toBe(1289);
  });
  it("applies moderate multiplier 1.55 and maintenance target", () => {
    const r = calculate({ age: 30, heightCm: 175, weightKg: 70, basis: "male", activity: "moderate", goal: "maintain" });
    expect(r.maintenance).toBe(Math.round(1649 * 1.55));
  });
  it("weight loss uses a conservative 400 kcal deficit", () => {
    const r = calculate({ age: 30, heightCm: 175, weightKg: 70, basis: "male", activity: "moderate", goal: "lose" });
    expect(r.target).toBe(Math.round((r.maintenance - 400) / 10) * 10);
  });
  it("never goes below the safe floor for women", () => {
    const r = calculate({ age: 60, heightCm: 150, weightKg: 45, basis: "female", activity: "sedentary", goal: "lose" });
    expect(r.target).toBeGreaterThanOrEqual(1200);
  });
  it("flags minors", () => {
    const r = calculate({ age: 15, heightCm: 160, weightKg: 50, basis: "female", activity: "light", goal: "maintain" });
    expect(r.warnings.some((w) => w.includes("under 18"))).toBe(true);
  });
  it("rejects out-of-range age", () => {
    expect(() => calculate({ age: 5, heightCm: 160, weightKg: 50, basis: "female", activity: "light", goal: "maintain" })).toThrow();
  });
});

const f = (p: Partial<Food>): Food => ({
  id: p.name!, name: p.name!, category: "grain", dietary_type: "vegan", meal_slots: ["breakfast", "lunch", "dinner"],
  serving_size: 100, serving_unit: "g", calories: 200, protein: 5, carbohydrates: 30, fat: 5, allergens: [], is_active: true, ...p,
});

describe("recommendation engine", () => {
  const foods = [
    f({ name: "Rice" }),
    f({ name: "Chicken", category: "protein", dietary_type: "non_vegetarian", protein: 30 }),
    f({ name: "Dal", category: "protein", protein: 10 }),
    f({ name: "Paneer", category: "protein", dietary_type: "vegetarian", allergens: ["milk"], protein: 15 }),
  ];
  it("vegetarian excludes chicken", () => {
    expect(filterFoods(foods, "vegetarian", [], []).map((x) => x.name)).not.toContain("Chicken");
  });
  it("milk allergy excludes paneer", () => {
    expect(filterFoods(foods, "vegetarian", ["milk"], []).map((x) => x.name)).not.toContain("Paneer");
  });
  it("is deterministic", () => {
    const o = { diet: "vegan" as const, allergies: [], exclusions: [], mealsPerDay: 3, target: 1800 };
    expect(generateDay(foods, o)).toEqual(generateDay(foods, o));
  });
  it("scales nutrition by quantity", () => {
    expect(scale(foods[0]!, 1.5).calories).toBe(300);
  });
});
