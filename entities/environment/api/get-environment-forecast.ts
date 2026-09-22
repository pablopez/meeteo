import { requestJson } from "@/shared/api";

import { mapOpenMeteoEnvironmentForecast } from "../lib/map-open-meteo-environmental-conditions";
import type { EnvironmentForecast } from "../model/environment-forecast";
import type { OpenMeteoAirQualityResponseDto } from "./open-meteo-air-quality.types";

const HOURLY_VARIABLES = [
  "european_aqi",
  "alder_pollen",
  "birch_pollen",
  "grass_pollen",
  "mugwort_pollen",
  "olive_pollen",
  "ragweed_pollen",
].join(",");

export type GetEnvironmentForecastOptions = {
  coordinates: {
    latitude: number;
    longitude: number;
  };
  signal?: AbortSignal;
};

export async function getEnvironmentForecast({
  coordinates,
  signal,
}: GetEnvironmentForecastOptions): Promise<EnvironmentForecast> {
  const parameters = new URLSearchParams({
    latitude: String(coordinates.latitude),
    longitude: String(coordinates.longitude),
    hourly: HOURLY_VARIABLES,
    timezone: "auto",
    domains: "auto",
    forecast_days: "7",
  });
  const response = await requestJson<OpenMeteoAirQualityResponseDto>(
    `https://air-quality-api.open-meteo.com/v1/air-quality?${parameters.toString()}`,
    { signal, cache: "no-store" },
  );

  return mapOpenMeteoEnvironmentForecast(response);
}
