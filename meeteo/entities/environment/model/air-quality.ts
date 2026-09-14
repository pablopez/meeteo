export type AirQualityLevel =
  | "good"
  | "fair"
  | "moderate"
  | "poor"
  | "very-poor"
  | "extremely-poor";

export type AirQuality = {
  readonly europeanIndex: number;
  readonly level: AirQualityLevel;
};

function getAirQualityLevel(
  index: number,
): AirQualityLevel {
  if (index <= 20) {
    return "good";
  }

  if (index <= 40) {
    return "fair";
  }

  if (index <= 60) {
    return "moderate";
  }

  if (index <= 80) {
    return "poor";
  }

  if (index <= 100) {
    return "very-poor";
  }

  return "extremely-poor";
}

export function createAirQuality(
  europeanIndex: number,
): AirQuality {
  if (
    !Number.isFinite(europeanIndex) ||
    europeanIndex < 0
  ) {
    throw new Error("Invalid European air quality index");
  }

  return {
    europeanIndex,
    level: getAirQualityLevel(europeanIndex),
  };
}