import type { DailyEnvironmentalConditions } from "./daily-environmental-conditions";

export type EnvironmentForecast = {
  readonly timezone: string;
  readonly days:
    readonly DailyEnvironmentalConditions[];
};

export type CreateEnvironmentForecastInput = {
  readonly timezone: string;
  readonly days:
    readonly DailyEnvironmentalConditions[];
};

const MAX_ENVIRONMENT_FORECAST_DAYS = 7;

export function createEnvironmentForecast({
  timezone,
  days,
}: CreateEnvironmentForecastInput): EnvironmentForecast {
  const normalizedTimezone = timezone.trim();

  if (!normalizedTimezone) {
    throw new Error("Timezone cannot be empty");
  }

  if (days.length > MAX_ENVIRONMENT_FORECAST_DAYS) {
    throw new Error(
      "Environment forecast cannot exceed 7 days",
    );
  }

  return {
    timezone: normalizedTimezone,
    days: [...days],
  };
}
