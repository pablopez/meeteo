"use client";

import { useTranslation } from "react-i18next";

import type { City } from "@/entities/city";
import { Button } from "@/shared/ui";

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

  const favorite = city ? isFavorite(city) : false;

  const label = favorite
    ? t("favorites.remove")
    : t("favorites.add");

  function handleClick() {
    if (!city) {
      return;
    }

    if (favorite) {
      removeFavorite(city);
    } else {
      addFavorite(city);
    }
  }

  return (
    <Button
      label={label}
      icon={favorite ? "star-filled" : "star"}
      display="icon"
      size="lg"
      variant={favorite ? "primary" : "secondary"}
      disabled={!city}
      aria-pressed={favorite}
      onClick={handleClick}
    />
  );
}
