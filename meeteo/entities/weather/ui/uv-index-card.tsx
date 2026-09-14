"use client";

import { useTranslation } from "react-i18next";

import { Card } from "@/shared/ui";

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
    <Card className={`p-4 ${className}`}>
      <dt className="text-sm opacity-75">
        {t("forecastTable.uvIndex")}
      </dt>
      <dd className="mt-1 text-2xl font-semibold">
        {value === null
          ? t("environment.unavailable")
          : new Intl.NumberFormat(locale, {
              maximumFractionDigits: 1,
            }).format(value)}
      </dd>
    </Card>
  );
}
