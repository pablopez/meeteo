"use client";

import { useId } from "react";
import { useTranslation } from "react-i18next";

import { Card } from "@/shared/ui";

import { formatWeatherMeasurement } from "../lib/format-weather-measurement";
import type { PrecipitationType } from "../model/precipitation";

type PrecipitationCardProps = {
  probability: number | null;
  precipitation: number | null;
  type: PrecipitationType;
  isDay?: boolean | number;
  className?: string;
};

const DROP_PATH = "M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0L12 2.69z";

function PrecipitationDrop({
  probability,
  isDay,
}: {
  probability: number | null;
  isDay: boolean;
}) {
  const clipId = `precipitation-drop-${useId()}`;
  const fillPercentage = Math.min(100, Math.max(0, probability ?? 0));
  const fillHeight = (fillPercentage / 100) * 24;
  const fillY = 24 - fillHeight;
  const fillClass = isDay ? "fill-blue-800" : "fill-white";

  return (
    <svg
      viewBox="0 0 24 24"
      className="h-16 w-16"
      aria-hidden="true"
    >
      <defs>
        <clipPath id={clipId}>
          <path d={DROP_PATH} />
        </clipPath>
      </defs>
      <path
        d={DROP_PATH}
        className="fill-transparent stroke-white/70 stroke-[1.5px]"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="3 3"
      />
      <rect
        x="0"
        y={fillY}
        width="24"
        height={fillHeight}
        clipPath={`url(#${clipId})`}
        className={fillClass}
      />
    </svg>
  );
}

export function PrecipitationCard({
  probability,
  precipitation,
  type,
  isDay = true,
  className = "",
}: PrecipitationCardProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? "en";
  const unavailable = t("environment.unavailable");
  const isDaytime = !(isDay === false || isDay === 0);

  return (
    <Card className={`flex flex-col items-center p-4 text-center ${className}`}>
      <dt className="text-sm opacity-75">{t("weather.precipitation")}</dt>      
      <dd className="mt-2">
        <PrecipitationDrop probability={probability} isDay={isDaytime} />
      </dd>
      <dd className="mt-1 text-2xl font-semibold">
        {formatWeatherMeasurement(
          precipitation,
          "millimeter",
          locale,
          unavailable,
        )}
      </dd>
      <dd className="mt-1 text-sm opacity-75">
        {formatWeatherMeasurement(
          probability,
          "percent",
          locale,
          unavailable,
        )} - {t(`weather.precipitationTypes.${type}`)}
      </dd>
    </Card>
  );
}
