"use client";

import { useTranslation } from "react-i18next";

import { Card } from "@/shared/ui";

import {
  getUvMeteoconName,
  getUvRisk,
} from "../lib/get-uv-index-presentation";

type UvIndexCardProps = {
  value: number | null;
  className?: string;
};

export function UvIndexCard({
  value,
  className = "",
}: UvIndexCardProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? "en";

  return (
    <Card className={`flex flex-col items-center p-4 text-center ${className}`}>
      <img
        src={`/meteocons/flat/${getUvMeteoconName(value)}.svg`}
        alt=""
        loading="lazy"
        className="h-20 w-20 shrink-0 drop-shadow-sm"
      />
      <div className="flex flex-col items-center">
        <dt className="text-sm opacity-75">
          {t("forecastTable.uvIndex")}
        </dt>
        <dd className="text-3xl font-semibold">
          {value === null
            ? t("environment.unavailable")
            : new Intl.NumberFormat(locale, {
                maximumFractionDigits: 1,
              }).format(value)}
        </dd>
        {value !== null && (
          <dd className="text-sm font-medium opacity-75">
            {t(`weather.uvRisk.${getUvRisk(value)}`)}
          </dd>
        )}
      </div>
    </Card>
  );
}
