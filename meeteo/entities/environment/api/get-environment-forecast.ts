import { getOpenMeteoAirQuality } from "@/shared/api/open-meteo";

import { mapOpenMeteoEnvironmentForecast } from "../lib/map-open-meteo-environmental-conditions";
import type { EnvironmentForecast } from "../model/environment-forecast";

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
  const response = await getOpenMeteoAirQuality({
    coordinates,
    signal,
  });

  return mapOpenMeteoEnvironmentForecast(response);
}
