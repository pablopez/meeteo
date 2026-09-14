import { requestJson } from "../request-json";
import { OPEN_METEO_ENDPOINTS } from "./config";

const HOURLY_VARIABLES = [
  "european_aqi",
  "alder_pollen",
  "birch_pollen",
  "grass_pollen",
  "mugwort_pollen",
  "olive_pollen",
  "ragweed_pollen",
].join(",");

export type OpenMeteoHourlyAirQualityDto = {
  time?: string[];
  european_aqi?: Array<number | null>;
  alder_pollen?: Array<number | null>;
  birch_pollen?: Array<number | null>;
  grass_pollen?: Array<number | null>;
  mugwort_pollen?: Array<number | null>;
  olive_pollen?: Array<number | null>;
  ragweed_pollen?: Array<number | null>;
};

export type OpenMeteoAirQualityResponseDto = {
  latitude?: number;
  longitude?: number;
  timezone?: string;
  hourly?: OpenMeteoHourlyAirQualityDto;
};

export type GetOpenMeteoAirQualityOptions = {
  coordinates: {
    latitude: number;
    longitude: number;
  };
  signal?: AbortSignal;
};

export function getOpenMeteoAirQuality({
  coordinates,
  signal,
}: GetOpenMeteoAirQualityOptions): Promise<OpenMeteoAirQualityResponseDto> {
  const parameters = new URLSearchParams({
    latitude: String(coordinates.latitude),
    longitude: String(coordinates.longitude),
    hourly: HOURLY_VARIABLES,
    timezone: "auto",
    domains: "auto",
    forecast_days: "7",
  });

  return requestJson<OpenMeteoAirQualityResponseDto>(
    `${OPEN_METEO_ENDPOINTS.airQuality}?${parameters.toString()}`,
    {
      signal,
      cache: "no-store",
    },
  );
}
