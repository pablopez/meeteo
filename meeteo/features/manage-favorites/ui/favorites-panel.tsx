"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

import type { City } from "@/entities/city";
import { useFavoriteCities } from "@/features/favorite-cities";
import { Card, ConfirmModal, Icon, Panel } from "@/shared/ui";

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

  if (favorites.length === 0) {
    return (
      <Panel aria-label={t("favorites.section")}>
        <p className="text-sm text-muted-foreground">
          {t("favorites.empty")}
        </p>
      </Panel>
    );
  }

  return (
    <Panel aria-label={t("favorites.section")}>
      <h3 className="mb-3 text-sm font-medium">
        {t("favorites.title")}
      </h3>

      <ul
        role="list"
        aria-label={t("favorites.section")}
        className="space-y-2"
      >
        {favorites.map((city, index) => (
          <li key={city.id}>
            <Card className="flex items-center gap-2 p-3">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">
                  {city.name}
                </p>

                <p className="truncate text-sm text-muted-foreground">
                  {[city.region, city.countryCode]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={index === 0}
                  aria-label={t("favorites.moveUp", {
                    city: city.name,
                  })}
                  onClick={() =>
                    handleMoveUp(city)
                  }
                  className="rounded-lg p-2 text-foreground transition-colors hover:bg-surface-muted disabled:opacity-40"
                >
                  <Icon name="arrow-up" />
                </button>

                <button
                  type="button"
                  disabled={
                    index === favorites.length - 1
                  }
                  aria-label={t("favorites.moveDown", {
                    city: city.name,
                  })}
                  onClick={() =>
                    handleMoveDown(city)
                  }
                  className="rounded-lg p-2 text-foreground transition-colors hover:bg-surface-muted disabled:opacity-40"
                >
                  <Icon name="arrow-down" />
                </button>

                <button
                  type="button"
                  aria-label={t("favorites.remove", {
                    city: city.name,
                  })}
                  onClick={() =>
                    setCityToRemove(city)
                  }
                  className="rounded-lg p-2 text-danger transition-colors hover:text-danger/80"
                >
                  <Icon name="trash" />
                </button>
              </div>
            </Card>
          </li>
        ))}
      </ul>

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
