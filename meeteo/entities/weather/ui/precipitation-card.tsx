"use client";

import { useTranslation } from "react-i18next";

import { Card } from "@/shared/ui";

import { formatWeatherMeasurement } from "../lib/format-weather-measurement";
import type { PrecipitationType } from "../model/precipitation";

type PrecipitationCardProps = {
  probability: number | null;
  amount: number | null;
  type: PrecipitationType;
  className?: string;
};

export function PrecipitationCard({
  probability,
  amount,
  type,
  className = "",
}: PrecipitationCardProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? "en";
  const unavailable = t("environment.unavailable");

  return (
    <Card className={`flex flex-col items-center p-4 text-center ${className}`}>
      <dt className="text-sm opacity-75">
        {t("weather.precipitation")}
      </dt>
      <dd className="mt-1 text-2xl font-semibold">
        {formatWeatherMeasurement(
          amount,
          "millimeter",
          locale,
          unavailable,
        )}
      </dd>
      <dd className="mt-1 text-sm opacity-75">
        <span>{t(`weather.precipitationTypes.${type}`)}</span>
        {" · "}
        <span>
          {formatWeatherMeasurement(
            probability,
            "percent",
            locale,
            unavailable,
          )}
        </span>
      </dd>
    </Card>
  );
}
