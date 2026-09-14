export type PrecipitationType =
  | "none"
  | "rain"
  | "snow"
  | "drizzle"
  | "hail";

export type Precipitation = {
  readonly probability: number | null;
  readonly amount: number | null;
  readonly unit: "millimeter";
  readonly type: PrecipitationType;
  readonly isThunderstorm: boolean;
};

export function createPrecipitation(
  probability: number | null,
  amount: number | null,
  type: PrecipitationType,
  isThunderstorm: boolean,
): Precipitation {
  if (
    probability !== null &&
    (!Number.isFinite(probability) ||
      probability < 0 ||
      probability > 100)
  ) {
    throw new Error("Invalid precipitation probability");
  }

  if (
    amount !== null &&
    (!Number.isFinite(amount) || amount < 0)
  ) {
    throw new Error("Invalid precipitation amount");
  }

  const validTypes: readonly PrecipitationType[] = [
    "none",
    "rain",
    "snow",
    "drizzle",
    "hail",
  ];

  if (!validTypes.includes(type)) {
    throw new Error("Invalid precipitation type");
  }

  if (typeof isThunderstorm !== "boolean") {
    throw new Error("Invalid thunderstorm indicator");
  }

  return {
    probability,
    amount,
    unit: "millimeter",
    type,
    isThunderstorm,
  };
}
