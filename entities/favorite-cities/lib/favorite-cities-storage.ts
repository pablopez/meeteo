import {
  createCity,
  type City,
} from "@/entities/city";
import {
  createFavoriteCities,
  type FavoriteCities,
} from "@/entities/favorite-cities/model/favorite-cities";

const STORAGE_KEY = "meeteo:favorite-cities";
const CHANGE_EVENT = "meeteo:favorite-cities-changed";

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseCity(value: unknown): City | null {
  if (!isRecord(value) || !isRecord(value.coordinates)) {
    return null;
  }

  if (
    typeof value.id !== "string" ||
    typeof value.name !== "string" ||
    typeof value.countryCode !== "string" ||
    typeof value.coordinates.latitude !== "number" ||
    typeof value.coordinates.longitude !== "number"
  ) {
    return null;
  }

  if (
    value.region !== undefined &&
    typeof value.region !== "string"
  ) {
    return null;
  }

  return createCity({
    id: value.id,
    name: value.name,
    countryCode: value.countryCode,
    region: value.region,
    coordinates: {
      latitude: value.coordinates.latitude,
      longitude: value.coordinates.longitude,
    },
    isFavorite:
      typeof value.isFavorite === "boolean"
        ? value.isFavorite
        : true,
  });
}

export function parseStoredFavoriteCities(
  serialized: string | null,
): FavoriteCities {
  if (!serialized) {
    return createFavoriteCities([]);
  }

  try {
    const value: unknown = JSON.parse(serialized);

    if (!Array.isArray(value)) {
      return createFavoriteCities([]);
    }

    const cities = value
      .map(parseCity)
      .filter((city): city is City => city !== null);

    return createFavoriteCities(cities);
  } catch {
    return createFavoriteCities([]);
  }
}

export function getFavoriteCitiesSnapshot(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function getServerFavoriteCitiesSnapshot(): null {
  return null;
}

export function saveFavoriteCities(
  favorites: FavoriteCities,
): void {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(favorites),
    );

    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // Los favoritos seguirán disponibles en memoria durante la sesión.
  }
}

export function subscribeToFavoriteCities(
  callback: () => void,
): () => void {
  function handleChange() {
    callback();
  }

  window.addEventListener("storage", handleChange);
  window.addEventListener(CHANGE_EVENT, handleChange);

  return () => {
    window.removeEventListener(
      "storage",
      handleChange,
    );
    window.removeEventListener(
      CHANGE_EVENT,
      handleChange,
    );
  };
}
