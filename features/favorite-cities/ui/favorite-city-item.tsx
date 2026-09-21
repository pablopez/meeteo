"use client";

import { useTranslation } from "react-i18next";

import type { City } from "@/entities/city";
import { Button } from "@/shared/ui";

type FavoriteCityItemProps = {
  city: City;
  onSelect: (city: City) => void;
  onRemove: (city: City) => void;
};

export function FavoriteCityItem({
  city,
  onSelect,
  onRemove,
}: FavoriteCityItemProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-white/20 bg-white/10 p-3 backdrop-blur-md">
      <button
        type="button"
        onClick={() => onSelect(city)}
        className="min-w-0 flex-1 text-left"
      >
        <span className="block truncate font-medium">
          {city.name}
        </span>

        {city.region && (
          <span className="block truncate text-sm">
            {city.region}, {city.countryCode}
          </span>
        )}

        {!city.region && (
          <span className="block truncate text-sm">
            {city.countryCode}
          </span>
        )}
      </button>

      <Button
        label={t("favorites.remove")}
        icon="close"
        display="icon"
        size="sm"
        variant="ghost"
        onClick={() => onRemove(city)}
      />
    </div>
  );
}
