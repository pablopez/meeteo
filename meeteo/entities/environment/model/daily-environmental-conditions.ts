import type { AirQuality } from "./air-quality";
import type { AllergyMeasurement } from "./allergy";

export type DailyEnvironmentalConditions = {
  readonly date: string;
  readonly airQuality: AirQuality | null;
  readonly allergyMeasurements:
    readonly AllergyMeasurement[];
};

export type CreateDailyEnvironmentalConditionsInput = {
  date: string;
  airQuality: AirQuality | null;
  allergyMeasurements: readonly AllergyMeasurement[];
};

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function isValidIsoDate(value: string): boolean {
  if (!ISO_DATE_PATTERN.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00Z`);

  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().startsWith(value)
  );
}

export function createDailyEnvironmentalConditions({
  date,
  airQuality,
  allergyMeasurements,
}: CreateDailyEnvironmentalConditionsInput): DailyEnvironmentalConditions {
  if (!isValidIsoDate(date)) {
    throw new Error(
      "Invalid environmental conditions date",
    );
  }

  return {
    date,
    airQuality,
    allergyMeasurements: [...allergyMeasurements],
  };
}
