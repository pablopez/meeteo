import type { OpenMeteoLocationDto } from "@/shared/api/open-meteo";
import { createCity, type City } from "../model/city";

export function mapLocationToCity(
  location: OpenMeteoLocationDto,
): City {
  return createCity({
    id: String(location.id),
    name: location.name,
    countryCode: location.country_code,
    region: location.admin1 || undefined,
    coordinates: {
      latitude: location.latitude,
      longitude: location.longitude,
    },
  });
}