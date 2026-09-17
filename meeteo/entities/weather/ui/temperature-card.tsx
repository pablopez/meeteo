"use client";

import { useTranslation } from "react-i18next";

import { Card } from "@/shared/ui";

import { formatWeatherMeasurement } from "../lib/format-weather-measurement";

type TemperatureCardProps = {
  min: number | null;
  max: number | null;
  className?: string;
};

export function TemperatureCard({
  min,
  max,
  className = "",
}: TemperatureCardProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? "en";
  const unavailable = t("environment.unavailable");

  return (
    <Card className={`grid grid-cols-2 gap-4 p-4 ${className}`}>
      <div className="flex flex-col items-center text-center">
        <dt className="text-sm opacity-75">
          {t("weather.minimum")}
        </dt>
        <dd className="mt-1 flex flex-col items-center gap-1 text-2xl font-semibold">
          <img
            src="/meteocons/flat/thermometer-colder.svg"
            alt=""
            loading="lazy"
            className="h-16 w-16 shrink-0 drop-shadow-sm"
          />
          {formatWeatherMeasurement(
            min,
            "celsius",
            locale,
            unavailable,
          )}
        </dd>
      </div>
      <div className="flex flex-col items-center text-center">
        <dt className="text-sm opacity-75">
          {t("weather.maximum")}
        </dt>
        <dd className="mt-1 flex flex-col items-center gap-1 text-2xl font-semibold">
          <img
            src="/meteocons/flat/thermometer-warmer.svg"
            alt=""
            loading="lazy"
            className="h-16 w-16 shrink-0 drop-shadow-sm"
          />
          {formatWeatherMeasurement(
            max,
            "celsius",
            locale,
            unavailable,
          )}
        </dd>
      </div>
    </Card>
  );
}
