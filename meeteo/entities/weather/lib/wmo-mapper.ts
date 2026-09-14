import type { PrecipitationType } from "../model/precipitation";

const SNOW_CODES = new Set([71, 73, 75, 77, 85, 86]);
const RAIN_CODES = new Set([61, 63, 65, 80, 81, 82, 95, 96, 99]);
const DRIZZLE_CODES = new Set([51, 53, 55, 56, 57]);
const THUNDERSTORM_CODES = new Set([95, 96, 99]);

export type WmoWeather = {
  type: PrecipitationType;
  isThunderstorm: boolean;
};

export function mapWmoWeather(
  weatherCode: number | null,
): WmoWeather {
  let type: PrecipitationType = "none";

  if (weatherCode !== null) {
    if (SNOW_CODES.has(weatherCode)) {
      type = "snow";
    } else if (RAIN_CODES.has(weatherCode)) {
      type = "rain";
    } else if (DRIZZLE_CODES.has(weatherCode)) {
      type = "drizzle";
    }
  }

  return {
    type,
    isThunderstorm:
      weatherCode !== null &&
      THUNDERSTORM_CODES.has(weatherCode),
  };
}
