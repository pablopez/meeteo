import type { DailyForecast } from "./daily-forecast";

export type WeatherForecast = {
  readonly timezone: string;
  readonly currentTemperature: number | null;
  readonly days: readonly DailyForecast[];
};

export type CreateWeatherForecastInput = {
  readonly timezone: string;
  readonly currentTemperature?: number | null;
  readonly days: readonly DailyForecast[];
};

export function createWeatherForecast({
  timezone,
  currentTemperature = null,
  days,
}: CreateWeatherForecastInput): WeatherForecast {
  const normalizedTimezone = timezone.trim();

  if (!normalizedTimezone) {
    throw new Error("Timezone cannot be empty");
  }

  if (days.length === 0 || days.length > 15) {
    throw new Error(
      "Weather forecast must contain between 1 and 15 days",
    );
  }

  if (
    currentTemperature !== null &&
    (!Number.isFinite(currentTemperature) ||
      typeof currentTemperature !== "number")
  ) {
    throw new Error("Invalid current temperature");
  }

  return {
    timezone: normalizedTimezone,
    currentTemperature,
    days: [...days],
  };
}