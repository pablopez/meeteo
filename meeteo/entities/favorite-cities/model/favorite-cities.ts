import type { City } from "@/entities/city";

export const MAX_FAVORITE_CITIES = 10;

export type FavoriteCities = readonly City[];

export function createFavoriteCities(
  cities: readonly City[],
): FavoriteCities {
  if (cities.length > MAX_FAVORITE_CITIES) {
    throw new Error(
      `Cannot exceed ${MAX_FAVORITE_CITIES} favorite cities`,
    );
  }

  return cities.map((city) => ({ ...city }));
}

export function addFavoriteCity(
  favorites: FavoriteCities,
  city: City,
): FavoriteCities {
  const exists = favorites.some(
    (favorite) => favorite.id === city.id,
  );

  if (exists) {
    return favorites;
  }

  if (favorites.length >= MAX_FAVORITE_CITIES) {
    throw new Error(
      `Cannot exceed ${MAX_FAVORITE_CITIES} favorite cities`,
    );
  }

  return [...favorites, { ...city, isFavorite: true }];
}

export function removeFavoriteCity(
  favorites: FavoriteCities,
  city: City,
): FavoriteCities {
  return favorites.filter(
    (favorite) => favorite.id !== city.id,
  );
}

export function reindexFavoriteCity(
  favorites: FavoriteCities,
  cityId: string,
  newIndex: number,
): FavoriteCities {
  const currentIndex = favorites.findIndex(
    (favorite) => favorite.id === cityId,
  );

  if (currentIndex === -1) {
    throw new Error("City not found in favorites");
  }

  if (
    newIndex < 0 ||
    newIndex >= favorites.length
  ) {
    throw new Error("Invalid favorite city index");
  }

  const reordered = [...favorites];
  const [moved] = reordered.splice(
    currentIndex,
    1,
  );

  reordered.splice(newIndex, 0, moved);

  return reordered;
}

export function isFavoriteCity(
  favorites: FavoriteCities,
  city: City,
): boolean {
  return favorites.some(
    (favorite) => favorite.id === city.id,
  );
}
