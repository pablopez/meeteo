"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

import type { DailyEnvironmentalConditions } from "@/entities/environment";
import {
  PrecipitationCard,
  SunTimesCard,
  TemperatureCard,
  UvIndexCard,
  type DailyForecast,
} from "@/entities/weather";
import { Carousel, Icon } from "@/shared/ui";

type ForecastDayView = {
  weather: DailyForecast;
  environment: DailyEnvironmentalConditions | null;
};

type ForecastCarouselProps = {
  days: readonly ForecastDayView[];
};

export function ForecastCarousel({
  days,
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
          className="rounded-full border border-solar-accent bg-solar-surface p-3 text-solar-text transition-colors disabled:cursor-not-allowed disabled:opacity-40"
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
          className="rounded-full border border-solar-accent bg-solar-surface p-3 text-solar-text transition-colors disabled:cursor-not-allowed disabled:opacity-40"
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
              <TemperatureCard
                min={
                  weather.temperature.minimum?.value ?? null
                }
                max={
                  weather.temperature.maximum?.value ?? null
                }
                className="col-span-2"
              />

              <PrecipitationCard
                probability={weather.precipitation.probability}
                amount={weather.precipitation.amount}
                type={weather.precipitation.type}
              />

              <UvIndexCard value={weather.uvIndex} />

              <SunTimesCard
                sunrise={weather.sunrise}
                sunset={weather.sunset}
                className="col-span-2"
              />

              <div className="rounded-xl border border-border bg-white/10 p-4 backdrop-blur-md">
                <dt className="text-sm text-muted-foreground">
                  {t("environment.airQuality.label")}
                </dt>
                <dd className="mt-1 text-2xl font-semibold">
                  {environment?.airQuality
                    ? formatNumber(
                        environment.airQuality.europeanIndex,
                      )
                    : unavailable}
                </dd>
                {environment?.airQuality && (
                  <dd className="mt-1 text-sm text-muted-foreground">
                    {t(
                      `environment.airQuality.levels.${environment.airQuality.level}`,
                    )}
                  </dd>
                )}
              </div>

              <div className="rounded-xl border border-border bg-white/10 p-4 backdrop-blur-md">
                <dt className="text-sm text-muted-foreground">
                  {t("environment.allergies.label")}
                </dt>
                {environment &&
                environment.allergyMeasurements.length > 0 ? (
                  <dd className="mt-1">
                    <ul className="space-y-1 text-sm">
                      {environment.allergyMeasurements.map(
                        (measurement) => (
                          <li
                            key={measurement.allergen}
                            className="flex justify-between gap-2"
                          >
                            <span>
                              {t(
                                `environment.allergies.allergens.${measurement.allergen}`,
                              )}
                            </span>
                            <span className="font-semibold">
                              {formatNumber(
                                measurement.concentration,
                              )}{" "}
                              {measurement.unit}
                            </span>
                          </li>
                        ),
                      )}
                    </ul>
                  </dd>
                ) : (
                  <dd className="mt-1 text-sm text-muted-foreground">
                    {environment
                      ? t("environment.allergies.unavailable")
                      : unavailable}
                  </dd>
                )}
              </div>
            </dl>

            <p className="mt-4 text-center text-sm text-muted-foreground">
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
