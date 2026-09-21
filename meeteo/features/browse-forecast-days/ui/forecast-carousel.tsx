"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

import {
  AirQualityCard,
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
import { Card, Carousel } from "@/shared/ui";

function formatShortDate(date: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

type ForecastDayView = {
  weather: DailyForecast;
  environment: DailyEnvironmentalConditions | null;
};

type ForecastCarouselProps = {
  days: readonly ForecastDayView[];
  isDay?: number | boolean;
  currentTemperature?: number | null;
  showPagination?: boolean;
};

export function ForecastCarousel({
  days,
  isDay = true,
  currentTemperature,
  showPagination = true,
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
    <section
      aria-label={t("forecastNavigation.label")}
      className="w-full min-w-0 max-w-full"
    >
      <nav
        className="grid min-w-0 grid-cols-2 items-center gap-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]"
        aria-label={t("forecastNavigation.label")}
      >
        {currentIndex > 0 ? (
          <button
            type="button"
            onClick={() => setSelectedIndex(currentIndex - 1)}
            aria-label={t("forecastNavigation.previous")}
            className="min-w-0 min-w-0 items-center justify-start px-3 py-2 backdrop-blur-md transition-colors sm:flex opacity-80 hover:opacity-100"
          >
            {formatShortDate(days[currentIndex - 1].weather.date, locale)}
          </button>
        ) : (
          <span className="min-w-0" />
        )}

        <h4 className="order-first col-span-2 min-w-0 truncate px-3 py-2 text-center text-base font-semibold capitalize backdrop-blur-md sm:order-none sm:col-span-1 sm:px-5 sm:text-2xl">
          {formattedDate}
        </h4>

        {currentIndex < days.length - 1 ? (
          <button
            type="button"
            onClick={() => setSelectedIndex(currentIndex + 1)}
            aria-label={t("forecastNavigation.next")}
            className="min-w-0 items-center justify-end px-3 py-2 backdrop-blur-md transition-colors sm:flex opacity-80 hover:opacity-100"
          >
            {formatShortDate(days[currentIndex + 1].weather.date, locale)}
          </button>
        ) : (
          <span className="min-w-0" />
        )}
      </nav>

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
                isDay={isDay}
                probability={weather.precipitation.probability}
                precipitation={weather.precipitation.amount}
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

              <AirQualityCard
                airQuality={environment?.airQuality ?? null}
              />

              <SunTimesCard
                sunrise={weather.sunrise}
                sunset={weather.sunset}
                isDay={isDay}
                className="col-span-2"
              />

              <Card className="col-span-2 p-4">
                <dt className="text-center text-sm ">
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
                            <span className="">
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
                  <dd className="mt-1 text-sm ">
                    {environment
                      ? t("environment.allergies.unavailable")
                      : unavailable}
                  </dd>
                )}
              </Card>
            </dl>
            {showPagination && (
            <p className="mt-4 text-center text-sm ">
              {t("forecastNavigation.counter", {
                current: index + 1,
                total: days.length,
              })}
            </p>)}
          </article>
        )}
      />
    </section>
  );
}
