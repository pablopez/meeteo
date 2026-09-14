import { requestJson } from "../request-json";
import { OPEN_METEO_ENDPOINTS } from "./config";

export type OpenMeteoLocationDto = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country_code: string;
  admin1?: string;
};

export type OpenMeteoGeocodingResponseDto = {
  results?: OpenMeteoLocationDto[];
};

export type SearchOpenMeteoLocationsOptions = {
  query: string;
  language: string;
  signal?: AbortSignal;
};

export function searchOpenMeteoLocations({
  query,
  language,
  signal,
}: SearchOpenMeteoLocationsOptions): Promise<OpenMeteoGeocodingResponseDto> {
  const parameters = new URLSearchParams({
    name: query,
    count: "10",
    language,
    format: "json",
  });

  return requestJson<OpenMeteoGeocodingResponseDto>(
    `${OPEN_METEO_ENDPOINTS.geocoding}?${parameters.toString()}`,
    {
      signal,
      cache: "no-store",
    },
  );
}
