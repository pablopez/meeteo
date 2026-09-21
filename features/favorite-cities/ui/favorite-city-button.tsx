"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

import type { City } from "@/entities/city";
import {
  ConfirmModal,
  FavoriteButton,
} from "@/shared/ui";

import { useFavoriteCities } from "../model/use-favorite-cities";

type FavoriteCityButtonProps = {
  city: City | null;
};

export function FavoriteCityButton({
  city,
}: FavoriteCityButtonProps) {
  const { t } = useTranslation();
  const { isFavorite, addFavorite, removeFavorite } =
    useFavoriteCities();

  const [isConfirmOpen, setIsConfirmOpen] =
    useState(false);

  const favorite = city ? isFavorite(city) : false;

  const label = favorite
    ? t("favorites.remove")
    : t("favorites.add");

  function handleToggle() {
    if (!city) {
      return;
    }

    if (favorite) {
      setIsConfirmOpen(true);
    } else {
      addFavorite(city);
    }
  }

  function handleConfirmRemove() {
    if (city) {
      removeFavorite(city);
    }

    setIsConfirmOpen(false);
  }

  return (
    <>
      <FavoriteButton
        favorite={favorite}
        label={label}
        disabled={!city}
        onClick={handleToggle}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        title={t("favorites.confirmRemoveTitle")}
        body={
          city
            ? t("favorites.confirmRemoveBody", {
                city: city.name,
              })
            : ""
        }
        confirmLabel={t("common.confirm")}
        cancelLabel={t("common.cancel")}
        confirmVariant="danger"
        onConfirm={handleConfirmRemove}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </>
  );
}
