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
      <div>
        <dt className="text-sm opacity-75">
          {t("weather.minimum")}
        </dt>
        <dd className="mt-1 text-2xl font-semibold">
          {formatWeatherMeasurement(
            min,
            "celsius",
            locale,
            unavailable,
          )}
        </dd>
      </div>
      <div>
        <dt className="text-sm opacity-75">
          {t("weather.maximum")}
        </dt>
        <dd className="mt-1 text-2xl font-semibold">
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
