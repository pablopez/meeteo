import { getOpenMeteoForecast } from "@/shared/api/open-meteo";

import { mapWeatherForecast } from "../lib/map-weather-forecast";
import type { WeatherForecast } from "../model/weather-forecast";

export type GetWeatherForecastOptions = {
  coordinates: {
    latitude: number;
    longitude: number;
  };
  signal?: AbortSignal;
};

export async function getWeatherForecast({
  coordinates,
  signal,
}: GetWeatherForecastOptions): Promise<WeatherForecast> {
  const response = await getOpenMeteoForecast({
    coordinates,
    signal,
  });

  return mapWeatherForecast(response);
}