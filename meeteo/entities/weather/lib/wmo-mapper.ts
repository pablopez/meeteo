import type { PrecipitationType } from "../model/precipitation";

const CLEAR_CODES = new Set([0]);
const MAINLY_CLEAR_CODES = new Set([1]);
const PARTLY_CLOUDY_CODES = new Set([2]);
const OVERCAST_CODES = new Set([3]);
const FOG_CODES = new Set([45, 48]);
const DRIZZLE_CODES = new Set([51, 53, 55, 56, 57]);
const FREEZING_DRIZZLE_ICON_CODES = new Set([56, 57]);
const RAIN_CODES = new Set([61, 63, 65, 80, 81, 82, 95, 96, 99]);
const FREEZING_RAIN_ICON_CODES = new Set([66, 67]);
const SNOW_CODES = new Set([71, 73, 75, 77, 85, 86]);
const THUNDERSTORM_CODES = new Set([95, 96, 99]);
const THUNDERSTORM_ONLY_CODES = new Set([95]);
const THUNDERSTORM_HAIL_CODES = new Set([96, 99]);

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

export function getFlatMeteoconName(
  weatherCode: number | null,
  isDay: number | boolean,
): string {
  const isDaytime = Boolean(isDay);
  const daySuffix = isDaytime ? "day" : "night";

  if (weatherCode === null) {
    return "not-available";
  }

  if (CLEAR_CODES.has(weatherCode)) {
    return `clear-${daySuffix}`;
  }

  if (MAINLY_CLEAR_CODES.has(weatherCode)) {
    return `mostly-clear-${daySuffix}`;
  }

  if (PARTLY_CLOUDY_CODES.has(weatherCode)) {
    return `partly-cloudy-${daySuffix}`;
  }

  if (OVERCAST_CODES.has(weatherCode)) {
    return "overcast";
  }

  if (FOG_CODES.has(weatherCode)) {
    return `fog-${daySuffix}`;
  }

  if (THUNDERSTORM_HAIL_CODES.has(weatherCode)) {
    return `thunderstorms-hail-${daySuffix}`;
  }

  if (THUNDERSTORM_ONLY_CODES.has(weatherCode)) {
    return `thunderstorms-${daySuffix}`;
  }

  if (FREEZING_DRIZZLE_ICON_CODES.has(weatherCode)) {
    return "sleet";
  }

  if (DRIZZLE_CODES.has(weatherCode)) {
    return "drizzle";
  }

  if (FREEZING_RAIN_ICON_CODES.has(weatherCode)) {
    return "sleet";
  }

  if (RAIN_CODES.has(weatherCode)) {
    return "rain";
  }

  if (SNOW_CODES.has(weatherCode)) {
    return "snow";
  }

  return "not-available";
}
