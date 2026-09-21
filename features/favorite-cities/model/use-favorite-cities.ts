"use client";

import {
  useCallback,
  useMemo,
  useSyncExternalStore,
} from "react";

import type { City } from "@/entities/city";
import {
  addFavoriteCity,
  isFavoriteCity,
  reindexFavoriteCity,
  removeFavoriteCity,
  type FavoriteCities,
} from "@/entities/favorite-cities";
import {
  getFavoriteCitiesSnapshot,
  getServerFavoriteCitiesSnapshot,
  parseStoredFavoriteCities,
  saveFavoriteCities,
  subscribeToFavoriteCities,
} from "@/entities/favorite-cities/lib/favorite-cities-storage";

type UseFavoriteCitiesResult = {
  favorites: FavoriteCities;
  addFavorite: (city: City) => void;
  removeFavorite: (city: City) => void;
  reindexFavorite: (cityId: string, newIndex: number) => void;
  isFavorite: (city: City) => boolean;
};

export function useFavoriteCities(): UseFavoriteCitiesResult {
  const serialized = useSyncExternalStore(
    subscribeToFavoriteCities,
    getFavoriteCitiesSnapshot,
    getServerFavoriteCitiesSnapshot,
  );

  const favorites = useMemo(
    () => parseStoredFavoriteCities(serialized),
    [serialized],
  );

  const addFavorite = useCallback(
    (city: City) => {
      saveFavoriteCities(
        addFavoriteCity(favorites, city),
      );
    },
    [favorites],
  );

  const removeFavorite = useCallback(
    (city: City) => {
      saveFavoriteCities(
        removeFavoriteCity(favorites, city),
      );
    },
    [favorites],
  );

  const reindexFavorite = useCallback(
    (cityId: string, newIndex: number) => {
      saveFavoriteCities(
        reindexFavoriteCity(
          favorites,
          cityId,
          newIndex,
        ),
      );
    },
    [favorites],
  );

  const isFavorite = useCallback(
    (city: City) => isFavoriteCity(favorites, city),
    [favorites],
  );

  return {
    favorites,
    addFavorite,
    removeFavorite,
    reindexFavorite,
    isFavorite,
  };
}
