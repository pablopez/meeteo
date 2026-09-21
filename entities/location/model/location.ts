export type Coordinates = {
  readonly latitude: number;
  readonly longitude: number;
};

export type Location = {
  readonly id: string;
  readonly coordinates: Coordinates;
};

export type CurrentLocation = Location & {
  readonly id: "current-location";
};

export function createCoordinates(
  coordinates: Coordinates,
): Coordinates {
  if (
    !Number.isFinite(coordinates.latitude) ||
    coordinates.latitude < -90 ||
    coordinates.latitude > 90
  ) {
    throw new Error("Invalid latitude");
  }

  if (
    !Number.isFinite(coordinates.longitude) ||
    coordinates.longitude < -180 ||
    coordinates.longitude > 180
  ) {
    throw new Error("Invalid longitude");
  }

  return {
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
  };
}

export function createCurrentLocation(
  coordinates: Coordinates,
): CurrentLocation {
  return {
    id: "current-location",
    coordinates: createCoordinates(coordinates),
  };
}