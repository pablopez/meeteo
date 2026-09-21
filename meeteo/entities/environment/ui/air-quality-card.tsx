"use client";

import { useTranslation } from "react-i18next";

import { Card } from "@/shared/ui";

import { getAirQualityColorClass } from "../lib/get-air-quality-color-class";
import type { AirQuality } from "../model/air-quality";

type AirQualityCardProps = {
  airQuality: AirQuality | null;
  className?: string;
};

export function AirQualityCard({
  airQuality,
  className = "",
}: AirQualityCardProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? "en";

  return (
    <Card className={`flex flex-col items-center p-4 text-center ${className}`}>
      <dt className="text-sm opacity-75">
        {t("environment.airQuality.label")}
      </dt>
      <dd className="mt-2">
        <span
          className={`block h-16 w-16 rounded-full ${
            airQuality
              ? getAirQualityColorClass(airQuality.europeanIndex)
              : "bg-white/20"
          }`}
          aria-hidden="true"
        />
      </dd>
      <dd className="mt-1 text-2xl font-semibold">
        {airQuality
          ? new Intl.NumberFormat(locale, {
              maximumFractionDigits: 1,
            }).format(airQuality.europeanIndex)
          : t("environment.unavailable")}
      </dd>
      {airQuality && (
        <dd className="mt-1 text-sm opacity-75">
          {t(`environment.airQuality.levels.${airQuality.level}`)}
        </dd>
      )}
    </Card>
  );
}
