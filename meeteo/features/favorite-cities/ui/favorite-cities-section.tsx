"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

import type { City } from "@/entities/city";
import { SortableList } from "@/shared/ui";

import { useFavoriteCities } from "../model/use-favorite-cities";
import { FavoriteCityItem } from "./favorite-city-item";

type FavoriteCitiesSectionProps = {
  onCitySelect: (city: City) => void;
};

export function FavoriteCitiesSection({
  onCitySelect,
}: FavoriteCitiesSectionProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const {
    favorites,
    removeFavorite,
    reindexFavorite,
  } = useFavoriteCities();

  const isEmpty = favorites.length === 0;

  return (
    <section aria-label={t("favorites.section")}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex w-full items-center justify-between rounded-lg border border-border bg-surface p-4 text-left font-medium"
        aria-expanded={isOpen}
      >
        <span>
          {t("favorites.title")}
          {!isEmpty && (
            <span className="ml-2 text-sm text-muted-foreground">
              ({favorites.length})
            </span>
          )}
        </span>

        <span
          className={`transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        >
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="mt-2">
          {isEmpty ? (
            <p className="rounded-lg border border-border border-dashed p-4 text-center text-sm text-muted-foreground">
              {t("favorites.empty")}
            </p>
          ) : (
            <SortableList
              items={favorites}
              getItemId={(city) => city.id}
              renderItem={(city, { onRemove }) => (
                <FavoriteCityItem
                  city={city}
                  onSelect={onCitySelect}
                  onRemove={onRemove}
                />
              )}
              onReorder={(reordered) => {
                const movedIndex = reordered.findIndex(
                  (city, index) => {
                    const previousIndex =
                      favorites.findIndex(
                        (favorite) =>
                          favorite.id === city.id,
                      );

                    return (
                      previousIndex !== -1 &&
                      previousIndex !== index
                    );
                  },
                );

                if (movedIndex !== -1) {
                  reindexFavorite(
                    reordered[movedIndex]!.id,
                    movedIndex,
                  );
                }
              }}
              onRemove={(city) => removeFavorite(city)}
              add={() => {}}
            />
          )}
        </div>
      )}
    </section>
  );
}
