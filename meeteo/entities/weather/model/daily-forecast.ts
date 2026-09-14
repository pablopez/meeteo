import {
  createPrecipitation,
  type Precipitation,
  type PrecipitationType,
} from "./precipitation";
import {
  createTemperature,
  type Temperature,
} from "./temperature";

export type DailyForecast = {
  readonly date: string;
  readonly temperature: {
    readonly minimum: Temperature | null;
    readonly maximum: Temperature | null;
  };
  readonly precipitation: Precipitation;
  readonly weatherCode: number | null;
  readonly uvIndex: number | null;
  readonly sunrise: string | null;
  readonly sunset: string | null;
};

export type CreateDailyForecastInput = {
  readonly date: string;
  readonly minimumTemperature: number | null;
  readonly maximumTemperature: number | null;
  readonly precipitationProbability: number | null;
  readonly precipitationAmount: number | null;
  readonly precipitationType: PrecipitationType;
  readonly isThunderstorm: boolean;
  readonly weatherCode: number | null;
  readonly uvIndex: number | null;
  readonly sunrise: string | null;
  readonly sunset: string | null;
};

function isValidIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00Z`);

  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().startsWith(value)
  );
}

function isValidTime(value: string): boolean {
  return /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value);
}

export function createDailyForecast({
  date,
  minimumTemperature,
  maximumTemperature,
  precipitationProbability,
  precipitationAmount,
  precipitationType,
  isThunderstorm,
  weatherCode,
  uvIndex,
  sunrise,
  sunset,
}: CreateDailyForecastInput): DailyForecast {
  if (!isValidIsoDate(date)) {
    throw new Error("Invalid forecast date");
  }

  if (
    minimumTemperature !== null &&
    maximumTemperature !== null &&
    minimumTemperature > maximumTemperature
  ) {
    throw new Error(
      "Minimum temperature cannot exceed maximum temperature",
    );
  }

  if (
    weatherCode !== null &&
    (!Number.isInteger(weatherCode) || weatherCode < 0)
  ) {
    throw new Error("Invalid weather code");
  }

  if (
    uvIndex !== null &&
    (!Number.isFinite(uvIndex) || uvIndex < 0)
  ) {
    throw new Error("Invalid UV index");
  }

  if (sunrise !== null && !isValidTime(sunrise)) {
    throw new Error("Invalid sunrise");
  }

  if (sunset !== null && !isValidTime(sunset)) {
    throw new Error("Invalid sunset");
  }

  return {
    date,
    temperature: {
      minimum:
        minimumTemperature === null
          ? null
          : createTemperature(minimumTemperature),
      maximum:
        maximumTemperature === null
          ? null
          : createTemperature(maximumTemperature),
    },
    precipitation: createPrecipitation(
      precipitationProbability,
      precipitationAmount,
      precipitationType,
      isThunderstorm,
    ),
    weatherCode,
    uvIndex,
    sunrise,
    sunset,
  };
}
