"use client";

import { useTranslation } from "react-i18next";

import type { DailyEnvironmentalConditions } from "@/entities/environment";
import { formatWeatherMeasurement, type DailyForecast } from "@/entities/weather";

type ForecastDayView = {
  weather: DailyForecast;
  environment: DailyEnvironmentalConditions | null;
};

type ForecastTableProps = {
  days: readonly ForecastDayView[];
};

export function ForecastTable({
  days,
}: ForecastTableProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? "en";

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat(locale, {
      weekday: "short",
      day: "numeric",
      month: "short",
      timeZone: "UTC",
    }).format(new Date(`${date}T00:00:00Z`));

  const formatNumber = (value: number) =>
    new Intl.NumberFormat(locale, {
      maximumFractionDigits: 1,
    }).format(value);

  const unavailable = t("environment.unavailable");

  return (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">
          {t("forecastTable.label")}
        </caption>

        <thead>
          <tr className="border-b border-border">
            <th scope="col" className="px-3 py-3">
              {t("forecastTable.date")}
            </th>
            <th scope="col" className="px-3 py-3">
              {t("weather.minimum")}
            </th>
            <th scope="col" className="px-3 py-3">
              {t("weather.maximum")}
            </th>
            <th scope="col" className="px-3 py-3">
              {t("weather.rainProbability")}
            </th>
            <th scope="col" className="px-3 py-3">
              {t("weather.precipitation")}
            </th>
            <th scope="col" className="px-3 py-3">
              {t("forecastTable.uvIndex")}
            </th>
            <th scope="col" className="px-3 py-3">
              {t("forecastTable.sunrise")}
            </th>
            <th scope="col" className="px-3 py-3">
              {t("forecastTable.sunset")}
            </th>
            <th scope="col" className="px-3 py-3">
              {t("environment.airQuality.label")}
            </th>
            <th scope="col" className="px-3 py-3">
              {t("environment.airQuality.level")}
            </th>
            <th scope="col" className="px-3 py-3">
              {t("environment.allergies.label")}
            </th>
          </tr>
        </thead>

        <tbody>
          {days.map(({ weather, environment }) => (
            <tr
              key={weather.date}
              className="border-b border-border last:border-0"
            >
              <th
                scope="row"
                className="whitespace-nowrap px-3 py-3 font-medium"
              >
                {formatDate(weather.date)}
              </th>

              <td className="whitespace-nowrap px-3 py-3">
                {formatWeatherMeasurement(
                  weather.temperature.minimum?.value ?? null,
                  "celsius",
                  locale,
                  unavailable,
                )}
              </td>

              <td className="whitespace-nowrap px-3 py-3">
                {formatWeatherMeasurement(
                  weather.temperature.maximum?.value ?? null,
                  "celsius",
                  locale,
                  unavailable,
                )}
              </td>

              <td className="whitespace-nowrap px-3 py-3">
                {formatWeatherMeasurement(
                  weather.precipitation.probability ,
                  "percent",
                  locale,
                  unavailable,
                )}
              </td>

              <td className="whitespace-nowrap px-3 py-3">
                <div>
                  <span>
                    {formatWeatherMeasurement(
                      weather.precipitation.amount,
                      "millimeter",
                      locale,
                      unavailable,
                    )}
                  </span>
                  <span className="ml-2 text-sm text-muted-foreground">
                    {t(
                      `weather.precipitationTypes.${weather.precipitation.type}`,
                    )}
                  </span>
                  {weather.precipitation.isThunderstorm && (
                    <span
                      className="ml-1"
                      aria-label={t("weather.thunderstorm")}
                      title={t("weather.thunderstorm")}
                    >
                      ⚡
                    </span>
                  )}
                </div>
              </td>

              <td className="whitespace-nowrap px-3 py-3">
                {weather.uvIndex === null
                  ? unavailable
                  : formatNumber(weather.uvIndex)}
              </td>

              <td className="whitespace-nowrap px-3 py-3">
                {weather.sunrise ?? unavailable}
              </td>

              <td className="whitespace-nowrap px-3 py-3">
                {weather.sunset ?? unavailable}
              </td>

              <td className="whitespace-nowrap px-3 py-3">
                {environment?.airQuality
                  ? formatNumber(
                      environment.airQuality.europeanIndex,
                    )
                  : unavailable}
              </td>

              <td className="whitespace-nowrap px-3 py-3">
                {environment?.airQuality
                  ? t(
                      `environment.airQuality.levels.${environment.airQuality.level}`,
                    )
                  : unavailable}
              </td>

              <td className="px-3 py-3">
                {environment &&
                environment.allergyMeasurements.length >
                  0 ? (
                  <ul className="space-y-0.5 text-sm">
                    {environment.allergyMeasurements.map(
                      (measurement) => (
                        <li key={measurement.allergen}>
                          {t(
                            `environment.allergies.allergens.${measurement.allergen}`,
                          )}
                          :{" "}
                          {formatNumber(
                            measurement.concentration,
                          )}{" "}
                          {measurement.unit}
                        </li>
                      ),
                    )}
                  </ul>
                ) : (
                  <span className="text-muted-foreground">
                    {unavailable}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}