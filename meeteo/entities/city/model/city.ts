import {
  createCoordinates,
  type Coordinates,
  type Location,
} from "@/entities/location";

export type City = Location & {
  readonly name: string;
  readonly countryCode: string;
  readonly region?: string;
  readonly isFavorite: boolean;
};

export type CreateCityInput = Omit<City, "isFavorite"> & {
  readonly coordinates: Coordinates;
  readonly isFavorite?: boolean;
};

export function createCity(input: CreateCityInput): City {
  const name = input.name.trim();

  if (!name) {
    throw new Error("City name cannot be empty");
  }

  const coordinates = createCoordinates(input.coordinates);

  return {
    ...input,
    name,
    coordinates,
    isFavorite: input.isFavorite ?? false,
  };
}

export function toggleCityFavorite(
  city: City,
): City {
  return {
    ...city,
    isFavorite: !city.isFavorite,
  };
}