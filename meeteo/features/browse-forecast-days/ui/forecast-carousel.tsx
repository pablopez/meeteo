"use client";

import { useState } from "react";
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
  PrecipitationCard,
  SunTimesCard,
  TemperatureCard,
  UvIndexCard,
  WeatherFlatIcon,
  type DailyForecast,
} from "@/entities/weather";
import { Card, Carousel, Icon } from "@/shared/ui";

type ForecastDayView = {
  weather: DailyForecast;
  environment: DailyEnvironmentalConditions | null;
};

type ForecastCarouselProps = {
  days: readonly ForecastDayView[];
  isDay?: number | boolean;
  currentTemperature?: number | null;
};

export function ForecastCarousel({
  days,
  isDay = true,
  currentTemperature,
}: ForecastCarouselProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? "en";
  const unavailable = t("environment.unavailable");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const currentIndex = Math.min(
    selectedIndex,
    Math.max(days.length - 1, 0),
  );
  const selectedDate = days[currentIndex]?.weather.date;
  const formattedDate = selectedDate
    ? new Intl.DateTimeFormat(locale, {
        weekday: "long",
        day: "numeric",
        month: "long",
        timeZone: "UTC",
      }).format(new Date(`${selectedDate}T00:00:00Z`))
    : "";

  const formatNumber = (value: number) =>
    new Intl.NumberFormat(locale, {
      maximumFractionDigits: 1,
    }).format(value);

  return (
    <section aria-label={t("forecastNavigation.label")}>
      <div className="flex items-center justify-between gap-4 px-2 pt-6">
        <button
          type="button"
          disabled={currentIndex === 0}
          onClick={() => setSelectedIndex(currentIndex - 1)}
          aria-label={t("forecastNavigation.previous")}
          className="rounded-full border border-white/20 bg-white/10 p-3 text-white backdrop-blur-md transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Icon name="chevron-left" />
        </button>

        <h3 className="text-center text-lg font-semibold capitalize">
          {formattedDate}
        </h3>

        <button
          type="button"
          disabled={currentIndex === days.length - 1}
          onClick={() => setSelectedIndex(currentIndex + 1)}
          aria-label={t("forecastNavigation.next")}
          className="rounded-full border border-white/20 bg-white/10 p-3 text-white backdrop-blur-md transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Icon name="chevron-right" />
        </button>
      </div>

      <Carousel
        items={days}
        currentIndex={currentIndex}
        onChange={setSelectedIndex}
        getItemId={({ weather }) => weather.date}
        paginationVariant="hidden"
        loop={false}
        showNavigation={false}
        renderItem={({ weather, environment }, index) => (
          <article
            aria-live="polite"
            className="px-2 pt-6"
          >
            <dl className="mt-4 grid grid-cols-2 gap-4">
              <Card className="flex flex-col items-center p-4 text-center">
                <dt className="text-sm opacity-75">
                  {t("weather.title")}
                </dt>
                <dd>
                  <WeatherFlatIcon
                    wmoCode={weather.weatherCode}
                    isDay={isDay}
                    className="h-32 w-32 drop-shadow-sm"
                  />
                </dd>
                {index === 0 && currentTemperature != null && (
                  <dd className="mt-1 text-2xl font-semibold">
                    {formatWeatherMeasurement(
                      currentTemperature,
                      "celsius",
                      locale,
                      unavailable,
                    )}
                  </dd>
                )}
              </Card>

              <PrecipitationCard
                probability={weather.precipitation.probability}
                amount={weather.precipitation.amount}
                type={weather.precipitation.type}
              />

              <TemperatureCard
                min={
                  weather.temperature.minimum?.value ?? null
                }
                max={
                  weather.temperature.maximum?.value ?? null
                }
                isDay={isDay}
                className="col-span-2"
              />

              <UvIndexCard value={weather.uvIndex} isDay={isDay} />

              <Card className="flex flex-col items-center p-4 text-center">
                <dt className="text-sm text-white/70">
                  {t("environment.airQuality.label")}
                </dt>
                <dd className="mt-1 flex items-center justify-center gap-2 text-2xl font-semibold">
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
                </dd>
                {environment?.airQuality && (
                  <dd className="mt-1 text-sm text-white/70">
                    {t(
                      `environment.airQuality.levels.${environment.airQuality.level}`,
                    )}
                  </dd>
                )}
              </Card>

              <SunTimesCard
                sunrise={weather.sunrise}
                sunset={weather.sunset}
                isDay={isDay}
                className="col-span-2"
              />

              <Card className="col-span-2 p-4">
                <dt className="text-center text-sm text-white/70">
                  {t("environment.allergies.label")}
                </dt>
                {environment &&
                environment.allergyMeasurements.length > 0 ? (
                  <dd className="mt-1">
                    <ul className="grid grid-cols-2 gap-3 text-sm">
                      {environment.allergyMeasurements.map(
                        (measurement) => (
                          <li
                            key={measurement.allergen}
                            className="flex flex-col items-center text-center"
                          >
                            <span className="relative">
                              <MeteoconIcon
                                name={getAllergenMeteoconName(measurement.allergen)}
                                isDay={isDay}
                                alt=""
                                className="h-16 w-16 drop-shadow-sm"
                              />
                              <MeteoconIcon
                                name={getPollenRiskMeteoconName(measurement.concentration)}
                                isDay={isDay}
                                alt=""
                                className="absolute -bottom-1 -right-2 h-8 w-8"
                              />
                            </span>
                            <span className="font-semibold">
                              {formatNumber(
                                measurement.concentration,
                              )}{" "}
                              {measurement.unit}
                            </span>
                            <span className="text-white/70">
                              {t(
                                `environment.allergies.allergens.${measurement.allergen}`,
                              )}
                            </span>
                            <span className="text-xs font-medium">
                              {t(
                                `environment.allergies.risks.${getPollenRisk(measurement.concentration)}`,
                              )}
                            </span>
                          </li>
                        ),
                      )}
                    </ul>
                  </dd>
                ) : (
                  <dd className="mt-1 text-sm text-white/70">
                    {environment
                      ? t("environment.allergies.unavailable")
                      : unavailable}
                  </dd>
                )}
              </Card>
            </dl>

            <p className="mt-4 text-center text-sm text-white/70">
              {t("forecastNavigation.counter", {
                current: index + 1,
                total: days.length,
              })}
            </p>
          </article>
        )}
      />
    </section>
  );
}
