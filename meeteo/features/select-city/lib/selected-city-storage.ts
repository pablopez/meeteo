import { createCity, type City } from "@/entities/city";

const STORAGE_KEY = "meeteo:selected-city";
const CHANGE_EVENT = "meeteo:selected-city-changed";

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function parseStoredCity(
  serializedCity: string | null,
): City | null {
  if (!serializedCity) {
    return null;
  }

  try {
    const value: unknown = JSON.parse(serializedCity);

    if (!isRecord(value) || !isRecord(value.coordinates)) {
      return null;
    }

    if (
      typeof value.id !== "string" ||
      typeof value.name !== "string" ||
      typeof value.countryCode !== "string" ||
      typeof value.coordinates.latitude !== "number" ||
      typeof value.coordinates.longitude !== "number" ||
      typeof value.isFavorite !== "boolean"
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
      isFavorite: value.isFavorite,
    });
  } catch {
    return null;
  }
}

export function getSelectedCitySnapshot(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function getServerSelectedCitySnapshot(): null {
  return null;
}

export function saveSelectedCity(city: City): void {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(city),
    );

    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // La ciudad seguirá disponible en memoria durante la sesión.
  }
}

export function subscribeToSelectedCity(
  callback: () => void,
): () => void {
  function handleChange() {
    callback();
  }

  window.addEventListener("storage", handleChange);
  window.addEventListener(CHANGE_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(CHANGE_EVENT, handleChange);
  };
}