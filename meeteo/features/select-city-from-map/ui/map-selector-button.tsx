"use client";

import { useTranslation } from "react-i18next";

import { MenuSquareButton } from "@/shared/ui";

type MapSelectorButtonProps = {
  active?: boolean;
  onClick?: () => void;
};

export function MapSelectorButton({
  active,
  onClick,
}: MapSelectorButtonProps) {
  const { t } = useTranslation();

  return (
    <MenuSquareButton
      icon="map"
      label={t("mapSelector.open")}
      active={active}
      onClick={onClick}
    />
  );
}
