"use client";

import { useTranslation } from "react-i18next";

import type { CurrentLocation } from "@/entities/location";
import { MenuSquareButton } from "@/shared/ui";

import { useLocateUser } from "../model/use-locate-user";

type LocateUserButtonProps = {
  onLocationLocated: (
    location: CurrentLocation,
  ) => void;
};

export function LocateUserButton({
  onLocationLocated,
}: LocateUserButtonProps) {
  const { t } = useTranslation();

  const { status, locateUser } = useLocateUser({
    onLocationLocated,
  });

  const isLoading = status === "loading";

  return (
    <div>
      <MenuSquareButton
        icon="location"
        label={t("location.useCurrent")}
        disabled={isLoading}
        onClick={() => void locateUser()}
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