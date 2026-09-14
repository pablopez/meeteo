import { requestJson } from "../request-json";
import { OPEN_METEO_ENDPOINTS } from "./config";

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

export type OpenMeteoForecastResponseDto = {
  timezone?: string;
  daily?: {
    time?: string[];
    weather_code?: Array<number | null>;
    temperature_2m_max?: Array<number | null>;
    temperature_2m_min?: Array<number | null>;
    precipitation_sum?: Array<number | null>;
    precipitation_probability_max?: Array<number | null>;
    uv_index_max?: Array<number | null>;
    sunrise?: Array<string | null>;
    sunset?: Array<string | null>;
  };
};

export type GetOpenMeteoForecastOptions = {
  coordinates: {
    latitude: number;
    longitude: number;
  };
  signal?: AbortSignal;
};

export function getOpenMeteoForecast({
  coordinates,
  signal,
}: GetOpenMeteoForecastOptions): Promise<OpenMeteoForecastResponseDto> {
  const parameters = new URLSearchParams({
    latitude: String(coordinates.latitude),
    longitude: String(coordinates.longitude),
    daily: DAILY_VARIABLES,
    timezone: "auto",
    forecast_days: "15",
    temperature_unit: "celsius",
    precipitation_unit: "mm",
  });

  return requestJson<OpenMeteoForecastResponseDto>(
    `${OPEN_METEO_ENDPOINTS.forecast}?${parameters.toString()}`,
    {
      signal,
      cache: "no-store",
    },
  );
}
