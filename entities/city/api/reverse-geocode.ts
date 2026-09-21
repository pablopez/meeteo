import { requestJson } from "@/shared/api";

import { createCity, type City } from "../model/city";

type NominatimReverseResponseDto = {
  place_id?: number;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    country_code?: string;
    state?: string;
  };
};

export type ReverseGeocodeOptions = {
  latitude: number;
  longitude: number;
  signal?: AbortSignal;
};

export async function reverseGeocode({
  latitude,
  longitude,
  signal,
}: ReverseGeocodeOptions): Promise<City> {
  const parameters = new URLSearchParams({
    format: "jsonv2",
    lat: String(latitude),
    lon: String(longitude),
  });
  const response = await requestJson<NominatimReverseResponseDto>(
    `https://nominatim.openstreetmap.org/reverse?${parameters.toString()}`,
    {
      signal,
      headers: {
        Accept: "application/json",
      },
    },
  );
  const address = response.address;
  const name = address?.city ?? address?.town ?? address?.village;

  if (
    typeof response.place_id !== "number" ||
    !name ||
    !address?.country_code
  ) {
    throw new Error("Invalid reverse geocoding response");
  }

  return createCity({
    id: `nominatim-${response.place_id}`,
    name,
    countryCode: address.country_code.toUpperCase(),
    region: address.state,
    coordinates: {
      latitude,
      longitude,
    },
  });
}
