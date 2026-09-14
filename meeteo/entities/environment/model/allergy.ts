export const POLLEN_ALLERGENS = [
  "alder",
  "birch",
  "grass",
  "mugwort",
  "olive",
  "ragweed",
] as const;

export type PollenAllergen =
  (typeof POLLEN_ALLERGENS)[number];

export type AllergyMeasurement = {
  readonly allergen: PollenAllergen;
  readonly concentration: number;
  readonly unit: "grains/m³";
};

export function createAllergyMeasurement(
  allergen: PollenAllergen,
  concentration: number,
): AllergyMeasurement {
  if (
    !Number.isFinite(concentration) ||
    concentration < 0
  ) {
    throw new Error(
      "Invalid pollen concentration",
    );
  }

  return {
    allergen,
    concentration,
    unit: "grains/m³",
  };
}