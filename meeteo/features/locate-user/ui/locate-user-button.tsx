"use client";

import { useTranslation } from "react-i18next";

import type { City } from "@/entities/city";
import { MenuSquareButton } from "@/shared/ui";

import { useLocateCity } from "../model/use-locate-city";

type LocateUserButtonProps = {
  onCityLocated: (city: City) => void;
};

export function LocateUserButton({
  onCityLocated,
}: LocateUserButtonProps) {
  const { t } = useTranslation();

  const { status, locateCity } = useLocateCity({
    onCityLocated,
  });

  const isLoading = status === "loading";

  return (
    <div>
      <MenuSquareButton
        icon="location"
        label={t("location.useCurrent")}
        disabled={isLoading}
        onClick={() => void locateCity()}
      />

      {status === "error" && (
        <p
          role="alert"
          className="mt-2 text-sm text-danger"
        >
          {t("location.error")}
        </p>
      )}
    </div>
  );
}