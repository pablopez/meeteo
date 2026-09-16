"use client";

import { useEffect, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";

import type { DailyEnvironmentalConditions } from "@/entities/environment";
import type { Location } from "@/entities/location";
import {
  getSkyState,
  WeatherEffects,
  WeatherFlatIcon,
  type DailyForecast,
} from "@/entities/weather";
import { ForecastCarousel } from "@/features/browse-forecast-days";
import { useLiveTime } from "@/shared/lib/time/use-live-time";
import { Panel } from "@/shared/ui";
import {
  ForecastViewSwitcher,
  type ForecastView,
} from "@/features/change-forecast-view";

import type { ForecastDayView } from "../model/forecast-day-view";
import { useEnvironmentForecast } from "../model/use-environment-forecast";
import { useWeatherForecast } from "../model/use-weather-forecast";
import { ForecastTable } from "./forecast-table";

type WeatherOverviewProps = {
  location: Location | null;
  onTimezoneChange?: (
    locationId: string,
    timezone: string,
  ) => void;
  isActive?: boolean;
};

const CLOUDY_WEATHER_CODES = new Set([1, 2, 3, 45, 48]);

function getWeatherState(day: DailyForecast): string {
  if (day.precipitation.isThunderstorm) {
    return "thunderstorm";
  }

  if (day.precipitation.type === "snow") {
    return "snow";
  }

  if (
    day.precipitation.type === "rain" ||
    day.precipitation.type === "drizzle" ||
    day.precipitation.type === "hail"
  ) {
    return "rain";
  }

  if (
    day.weatherCode !== null &&
    CLOUDY_WEATHER_CODES.has(day.weatherCode)
  ) {
    return "cloudy";
  }

  return "clear";
}

function composeForecastDays(
  weatherDays: readonly DailyForecast[],
  environmentDays: readonly DailyEnvironmentalConditions[] | null,
): ForecastDayView[] {
  const environmentByDate = new Map<
    string,
    DailyEnvironmentalConditions
  >();

  if (environmentDays) {
    for (const day of environmentDays) {
      environmentByDate.set(day.date, day);
    }
  }

  return weatherDays.map((weather) => ({
    weather,
    environment:
      environmentByDate.get(weather.date) ?? null,
  }));
}

export function WeatherOverview({
  location,
  onTimezoneChange,
  isActive = true,
}: WeatherOverviewProps) {
  const { t, i18n } = useTranslation();
  const [forecastView, setForecastView] =
    useState<ForecastView>("carousel");

  const { status: weatherStatus, forecast: weatherForecast } =
    useWeatherForecast(location);

  const {
    status: environmentStatus,
    forecast: environmentForecast,
  } = useEnvironmentForecast(location);

  useEffect(() => {
    if (location && weatherForecast) {
      onTimezoneChange?.(location.id, weatherForecast.timezone);
    }
  }, [location, onTimezoneChange, weatherForecast]);

  const composedDays = useMemo(() => {
    if (!weatherForecast) {
      return [];
    }

    return composeForecastDays(
      weatherForecast.days,
      environmentForecast?.days ?? null,
    );
  }, [weatherForecast, environmentForecast]);

  const currentDay = weatherForecast?.days[0];
  const timezone = weatherForecast?.timezone;
  const sunrise = currentDay?.sunrise;
  const sunset = currentDay?.sunset;
  const sunriseIso =
    currentDay && sunrise
      ? `${currentDay.date}T${sunrise}:00Z`
      : null;
  const sunsetIso =
    currentDay && sunset
      ? `${currentDay.date}T${sunset}:00Z`
      : null;
  const weatherState = currentDay
    ? getWeatherState(currentDay)
    : "clear";
  const liveTime = useLiveTime(
    timezone ?? "UTC",
    i18n.resolvedLanguage ?? "en",
  );
  const skyState =
    sunriseIso && sunsetIso
      ? getSkyState(
          liveTime.currentTime,
          sunriseIso,
          sunsetIso,
        )
      : "deep-night";

  const isDaytime =
    skyState === "dawn" ||
    skyState === "day" ||
    skyState === "dusk";

  useEffect(() => {
    if (!isActive || !timezone || !sunriseIso || !sunsetIso) {
      return;
    }

    const root = document.documentElement;
    const nextSkyState = getSkyState(
      liveTime.currentTime,
      sunriseIso,
      sunsetIso,
    );

    root.dataset.skyState = nextSkyState;
    root.dataset.weatherState = weatherState;

    return () => {
      delete root.dataset.skyState;
      delete root.dataset.weatherState;
    };
  }, [
    isActive,
    liveTime.currentTime,
    sunriseIso,
    sunsetIso,
    timezone,
    weatherState,
  ]);

  if (weatherStatus === "idle") {
    return (
      <p className="text-sm text-muted-foreground">
        {t("weather.empty")}
      </p>
    );
  }

  if (weatherStatus === "loading") {
    return (
      <p
        role="status"
        className="text-sm text-muted-foreground"
      >
        {t("weather.loading")}
      </p>
    );
  }

  if (
    weatherStatus === "error" ||
    !weatherForecast ||
    !location
  ) {
    return (
      <p role="alert" className="text-sm text-danger">
        {t("weather.error")}
      </p>
    );
  }

  const locationKey = [
    location.id,
    location.coordinates.latitude,
    location.coordinates.longitude,
  ].join(":");

  return (
    <>
      {isActive && currentDay && (
        <WeatherEffects
          key={`${location.id}:${currentDay.date}`}
          precipitationType={currentDay.precipitation.type}
          isThunderstorm={currentDay.precipitation.isThunderstorm}
          weatherCode={currentDay.weatherCode}
        />
      )}

      <Panel
        aria-labelledby="weather-title"
        data-sky-state={skyState}
        className="relative z-10"
      >
        <div className="flex items-center gap-4">
          <h2
            id="weather-title"
            className="text-2xl font-bold"
          >
            {t("weather.title")}
          </h2>

          {currentDay && (
            <WeatherFlatIcon
              wmoCode={currentDay.weatherCode}
              isDay={isDaytime}
              className="h-12 w-12 md:h-16 md:w-16"
            />
          )}
        </div>

        {environmentStatus === "loading" && (
        <p className="mt-2 text-xs text-muted-foreground">
          {t("environment.loading")}
        </p>
      )}

      {environmentStatus === "error" && (
        <p className="mt-2 text-xs text-danger">
          {t("environment.error")}
        </p>
      )}

      <div className="mt-4 flex justify-end">
        <ForecastViewSwitcher
          value={forecastView}
          onChange={setForecastView}
        />
      </div>

      {forecastView === "carousel" ? (
        <ForecastCarousel
          key={locationKey}
          days={composedDays}
        />
      ) : (
        <ForecastTable days={composedDays} />
      )}

      <p className="mt-6 text-xs text-muted-foreground">
        <Trans
          i18nKey="environment.attribution"
          components={{
            openMeteo: (
              <a
                href="https://open-meteo.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              />
            ),
            cams: (
              <a
                href="https://atmosphere.copernicus.eu/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              />
            ),
          }}
        />
        </p>
      </Panel>
    </>
  );
}