import { requestJson } from "@/shared/api";

import { mapLocationToCity } from "../lib/map-location-to-city";
import type { City } from "../model/city";
import type { OpenMeteoGeocodingResponseDto } from "./open-meteo-geocoding.types";

export type SearchCitiesOptions = {
  query: string;
  language: string;
  signal?: AbortSignal;
};

export async function searchCities({
  query,
  language,
  signal,
}: SearchCitiesOptions): Promise<City[]> {
  const normalizedQuery = query.trim();

  if (normalizedQuery.length < 2) {
    return [];
  }

  const normalizedLanguage = language.toLowerCase().split("-")[0] || "en";
  const parameters = new URLSearchParams({
    name: normalizedQuery,
    count: "10",
    language: normalizedLanguage,
    format: "json",
  });
  const data = await requestJson<OpenMeteoGeocodingResponseDto>(
    `https://geocoding-api.open-meteo.com/v1/search?${parameters.toString()}`,
    { signal, cache: "no-store" },
  );

  return (data.results ?? []).map(mapLocationToCity);
}
