export type Temperature = {
  readonly value: number;
  readonly unit: "celsius";
};

export function createTemperature(
  value: number,
): Temperature {
  if (!Number.isFinite(value)) {
    throw new Error("Invalid temperature");
  }

  return {
    value,
    unit: "celsius",
  };
}