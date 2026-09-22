import { requestJson } from "@/shared/api";

import { mapWeatherForecast } from "../lib/map-weather-forecast";
import type { WeatherForecast } from "../model/weather-forecast";
import type { OpenMeteoForecastResponseDto } from "./open-meteo-forecast.types";

const DAILY_VARIABLES = [
  "weather_code",
  "temperature_2m_max",
  "temperature_2m_min",
  "precipitation_sum",
  "precipitation_probability_max",
  "uv_index_max",
  "sunrise",
  "sunset",
].join(",");

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
  const parameters = new URLSearchParams({
    latitude: String(coordinates.latitude),
    longitude: String(coordinates.longitude),
    daily: DAILY_VARIABLES,
    current_weather: "true",
    timezone: "auto",
    forecast_days: "15",
    temperature_unit: "celsius",
    precipitation_unit: "mm",
  });
  const response = await requestJson<OpenMeteoForecastResponseDto>(
    `https://api.open-meteo.com/v1/forecast?${parameters.toString()}`,
    { signal, cache: "no-store" },
  );

  return mapWeatherForecast(response);
}
