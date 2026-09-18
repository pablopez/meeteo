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
      return `${commonClassName} bg-white/30 text-white`;
    }

    return `${commonClassName} border border-white/20 bg-white/10 text-white hover:bg-white/20`;
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