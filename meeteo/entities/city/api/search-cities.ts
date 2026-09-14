import { searchOpenMeteoLocations } from "@/shared/api/open-meteo";

import { mapLocationToCity } from "../lib/map-location-to-city";
import type { City } from "../model/city";

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

  const normalizedLanguage =
    language.toLowerCase().split("-")[0] || "en";

  const data = await searchOpenMeteoLocations({
    query: normalizedQuery,
    language: normalizedLanguage,
    signal,
  });

  return (data.results ?? []).map(mapLocationToCity);
}