"use client";

import { useTranslation } from "react-i18next";

import { Card } from "@/shared/ui";

type SunTimesCardProps = {
  sunrise: string | null;
  sunset: string | null;
  className?: string;
};

export function SunTimesCard({
  sunrise,
  sunset,
  className = "",
}: SunTimesCardProps) {
  const { t } = useTranslation();
  const unavailable = t("environment.unavailable");

  return (
    <Card className={`grid grid-cols-2 gap-4 p-4 ${className}`}>
      <div>
        <dt className="text-sm opacity-75">
          {t("forecastTable.sunrise")}
        </dt>
        <dd className="mt-1 text-2xl font-semibold">
          {sunrise ?? unavailable}
        </dd>
      </div>
      <div>
        <dt className="text-sm opacity-75">
          {t("forecastTable.sunset")}
        </dt>
        <dd className="mt-1 text-2xl font-semibold">
          {sunset ?? unavailable}
        </dd>
      </div>
    </Card>
  );
}
