"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

import type { City } from "@/entities/city";
import { useFavoriteCities } from "@/features/favorite-cities";
import {
  ConfirmModal,
  Icon,
  Panel,
  SortableList,
} from "@/shared/ui";

export function FavoritesPanel() {
  const { t } = useTranslation();
  const { favorites, removeFavorite, reindexFavorite } =
    useFavoriteCities();

  const [cityToRemove, setCityToRemove] =
    useState<City | null>(null);

  function handleMoveUp(city: City) {
    const index = favorites.findIndex(
      (favorite) => favorite.id === city.id,
    );

    if (index > 0) {
      reindexFavorite(city.id, index - 1);
    }
  }

  function handleMoveDown(city: City) {
    const index = favorites.findIndex(
      (favorite) => favorite.id === city.id,
    );

    if (
      index !== -1 &&
      index < favorites.length - 1
    ) {
      reindexFavorite(city.id, index + 1);
    }
  }

  function handleReorder(reordered: City[]) {
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
  }

  if (favorites.length === 0) {
    return (
      <Panel aria-label={t("favorites.section")}>
        <p className="text-sm ">
          {t("favorites.empty")}
        </p>
      </Panel>
    );
  }

  return (
    <Panel aria-label={t("favorites.section")}>
      <h3 className="mb-3 text-sm font-medium text-white">
        {t("favorites.title")}
      </h3>

      <SortableList
        items={favorites}
        getItemId={(city) => city.id}
        showDragHandle={false}
        itemClassName="bg-transparent backdrop-blur-none"
        aria-label={t("favorites.section")}
        renderLeftAccessory={(city, index) => (
          <div className="flex flex-col">
            <button
              type="button"
              disabled={index === 0}
              aria-label={t("favorites.moveUp", {
                city: city.name,
              })}
              onClick={() =>
                handleMoveUp(city)
              }
              className="rounded-lg p-1 transition-colors hover:bg-white/10 disabled:opacity-40"
            >
              <Icon name="arrow-up" size="sm" />
            </button>

            <button
              type="button"
              disabled={
                index === favorites.length - 1
              }
              aria-label={t(
                "favorites.moveDown",
                {
                  city: city.name,
                },
              )}
              onClick={() =>
                handleMoveDown(city)
              }
              className="rounded-lg p-1 transition-colors hover:bg-white/10 disabled:opacity-40"
            >
              <Icon name="arrow-down" size="sm" />
            </button>
          </div>
        )}
        renderItem={(city) => (
          <div className="flex items-center gap-2">
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">
                {city.name}
              </p>

              <p className="truncate text-sm ">
                {[city.region, city.countryCode]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>

            <button
              type="button"
              aria-label={t("favorites.remove", {
                city: city.name,
              })}
              onClick={() =>
                setCityToRemove(city)
              }
              className="rounded-lg p-2 text-white transition-colors hover:bg-white/10"
            >
              <Icon name="trash" />
            </button>
          </div>
        )}
        onReorder={handleReorder}
      />

      <ConfirmModal
        isOpen={cityToRemove !== null}
        title={t("favorites.confirmRemoveTitle")}
        body={
          cityToRemove
            ? t("favorites.confirmRemoveBody", {
                city: cityToRemove.name,
              })
            : ""
        }
        confirmLabel={t("common.confirm")}
        cancelLabel={t("common.cancel")}
        confirmVariant="danger"
        onConfirm={() => {
          if (cityToRemove) {
            removeFavorite(cityToRemove);
          }

          setCityToRemove(null);
        }}
        onCancel={() => setCityToRemove(null)}
      />
    </Panel>
  );
}
