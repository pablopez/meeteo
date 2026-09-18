"use client";

import { useTranslation } from "react-i18next";

import {
  getAirQualityColorClass,
  getAllergenMeteoconName,
  getPollenRisk,
  getPollenRiskMeteoconName,
  type DailyEnvironmentalConditions,
} from "@/entities/environment";
import {
  formatWeatherMeasurement,
  MeteoconIcon,
  WeatherFlatIcon,
  type DailyForecast,
} from "@/entities/weather";

type ForecastDayView = {
  weather: DailyForecast;
  environment: DailyEnvironmentalConditions | null;
};

type ForecastTableProps = {
  days: readonly ForecastDayView[];
  isDay?: boolean | number;
};

export function ForecastTable({
  days,
  isDay = true,
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
          <tr className="border-b border-white/20">
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
              className="border-b border-white/20 last:border-0"
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
                <div className="flex items-center gap-2">
                  <WeatherFlatIcon
                    wmoCode={weather.weatherCode}
                    isDay={isDay}
                    className="h-10 w-10"
                  />

                  <span>
                    {formatWeatherMeasurement(
                      weather.precipitation.amount,
                      "millimeter",
                      locale,
                      unavailable,
                    )}
                  </span>

                  <span className="text-sm text-white/70">
                    {t(
                      `weather.precipitationTypes.${weather.precipitation.type}`,
                    )}
                  </span>
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
                <span className="inline-flex items-center gap-2">
                  {environment?.airQuality && (
                    <span
                      className={`h-3 w-3 shrink-0 rounded-full ${getAirQualityColorClass(environment.airQuality.europeanIndex)}`}
                      aria-hidden="true"
                    />
                  )}
                  {environment?.airQuality
                    ? formatNumber(
                        environment.airQuality.europeanIndex,
                      )
                    : unavailable}
                </span>
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
                        <li
                          key={measurement.allergen}
                          className="flex items-center gap-2"
                        >
                          <span className="relative shrink-0">
                            <MeteoconIcon
                              name={getAllergenMeteoconName(measurement.allergen)}
                              isDay={isDay}
                              alt=""
                              className="h-10 w-10"
                            />
                            <MeteoconIcon
                              name={getPollenRiskMeteoconName(measurement.concentration)}
                              isDay={isDay}
                              alt=""
                              className="absolute -bottom-1 -right-1 h-5 w-5"
                            />
                          </span>
                          <span className="flex flex-col">
                            <span>
                              {t(
                                `environment.allergies.allergens.${measurement.allergen}`,
                              )}
                              :{" "}
                              {formatNumber(
                                measurement.concentration,
                              )}{" "}
                              {measurement.unit}
                            </span>
                            <span className="text-xs text-white/70">
                              {t(
                                `environment.allergies.risks.${getPollenRisk(measurement.concentration)}`,
                              )}
                            </span>
                          </span>
                        </li>
                      ),
                    )}
                  </ul>
                ) : (
                  <span className="text-white/70">
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