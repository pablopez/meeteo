import type { DailyEnvironmentalConditions } from "@/entities/environment";
import type { DailyForecast } from "@/entities/weather";

export type ForecastDayView = {
  weather: DailyForecast;
  environment: DailyEnvironmentalConditions | null;
};
