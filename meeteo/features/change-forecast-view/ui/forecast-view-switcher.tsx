"use client";

import { useTranslation } from "react-i18next";

import type { ForecastView } from "../model/forecast-view";

type ForecastViewSwitcherProps = {
  value: ForecastView;
  onChange: (view: ForecastView) => void;
};

export function ForecastViewSwitcher({
  value,
  onChange,
}: ForecastViewSwitcherProps) {
  const { t } = useTranslation();

  function getButtonClassName(view: ForecastView) {
    const commonClassName =
      "rounded-lg px-4 py-2 text-sm font-medium transition-colors";

    if (value === view) {
      return `${commonClassName} bg-primary text-primary-foreground`;
    }

    return `${commonClassName} border border-border bg-surface text-foreground`;
  }

  return (
    <div
      role="group"
      aria-label={t("forecastView.label")}
      className="flex gap-2"
    >
      <button
        type="button"
        aria-pressed={value === "carousel"}
        onClick={() => onChange("carousel")}
        className={getButtonClassName("carousel")}
      >
        {t("forecastView.carousel")}
      </button>

      <button
        type="button"
        aria-pressed={value === "table"}
        onClick={() => onChange("table")}
        className={getButtonClassName("table")}
      >
        {t("forecastView.table")}
      </button>
    </div>
  );
}