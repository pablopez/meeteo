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
      <div className="flex flex-col items-center text-center">
        <dt className="text-sm opacity-75">
          {t("forecastTable.sunrise")}
        </dt>
        <dd className="mt-1 flex flex-col items-center gap-1 text-2xl font-semibold">
          <img
            src="/meteocons/flat/sunrise.svg"
            alt=""
            loading="lazy"
            className="h-16 w-16 drop-shadow-sm"
          />
          {sunrise ?? unavailable}
        </dd>
      </div>
      <div className="flex flex-col items-center text-center">
        <dt className="text-sm opacity-75">
          {t("forecastTable.sunset")}
        </dt>
        <dd className="mt-1 flex flex-col items-center gap-1 text-2xl font-semibold">
          <img
            src="/meteocons/flat/moonrise.svg"
            alt=""
            loading="lazy"
            className="h-16 w-16 drop-shadow-sm"
          />
          {sunset ?? unavailable}
        </dd>
      </div>
    </Card>
  );
}
