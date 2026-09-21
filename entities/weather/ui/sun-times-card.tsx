"use client";

import { useTranslation } from "react-i18next";

import { Card } from "@/shared/ui";

import { MeteoconIcon } from "./meteocon-icon";

type SunTimesCardProps = {
  sunrise: string | null;
  sunset: string | null;
  isDay?: boolean | number;
  className?: string;
};

export function SunTimesCard({
  sunrise,
  sunset,
  isDay = true,
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
          <MeteoconIcon
            name="sunrise"
            isDay={isDay}
            alt=""
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
          <MeteoconIcon
            name="moonrise"
            isDay={isDay}
            alt=""
            className="h-16 w-16 drop-shadow-sm"
          />
          {sunset ?? unavailable}
        </dd>
      </div>
    </Card>
  );
}
