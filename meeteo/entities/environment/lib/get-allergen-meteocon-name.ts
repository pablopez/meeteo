import type { PollenAllergen } from "../model/allergy";

export type PollenRisk =
  | "low"
  | "moderate"
  | "high"
  | "very-high";

const ALLERGEN_METEOCONS: Record<PollenAllergen, string> = {
  alder: "pollen-tree",
  birch: "pollen-tree",
  grass: "pollen-grass",
  mugwort: "pollen-flower",
  olive: "pollen-tree",
  ragweed: "pollen-flower",
};

export function getAllergenMeteoconName(
  allergen: PollenAllergen,
): string {
  return ALLERGEN_METEOCONS[allergen];
}

export function getPollenRisk(concentration: number): PollenRisk {
  if (concentration < 10) {
    return "low";
  }

  if (concentration < 50) {
    return "moderate";
  }

  if (concentration < 100) {
    return "high";
  }

  return "very-high";
}

export function getPollenRiskMeteoconName(
  concentration: number,
): string {
  const risk = getPollenRisk(concentration);

  if (risk === "low") {
    return "code-green";
  }

  if (risk === "moderate") {
    return "code-yellow";
  }

  if (risk === "high") {
    return "code-orange";
  }

  return "code-red";
}
