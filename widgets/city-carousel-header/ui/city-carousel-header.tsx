"use client";

import { useRef } from "react";
import { useTranslation } from "react-i18next";

import type { City } from "@/entities/city";
import { FavoriteCityButton } from "@/features/favorite-cities";
import { useLiveTime } from "@/shared/lib/time/use-live-time";
import { Icon } from "@/shared/ui";

type CityLiveClockProps = {
  timezone: string;
  locale: string;
};

function CityLiveClock({ timezone, locale }: CityLiveClockProps) {
  const liveTime = useLiveTime(timezone, locale);
  const time = new Intl.DateTimeFormat(locale, {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(liveTime.currentTime);

  return (
    <time
      dateTime={time}
      className="font-mono text-2xl font-semibold tabular-nums sm:text-3xl"
    >
      {time}
    </time>
  );
}

type CityCarouselHeaderProps = {
  cities: readonly City[];
  currentIndex: number;
  timezones: Record<string, string>;
  onPrevious: () => void;
  onNext: () => void;
};

export function CityCarouselHeader({
  cities,
  currentIndex,
  timezones,
  onPrevious,
  onNext,
}: CityCarouselHeaderProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? "en";
  const pointerStartX = useRef<number | null>(null);

  function handlePointerDown(event: React.PointerEvent<HTMLElement>) {
    pointerStartX.current = event.clientX;
  }

  function handlePointerUp(event: React.PointerEvent<HTMLElement>) {
    if (pointerStartX.current === null) {
      return;
    }

    const deltaX = event.clientX - pointerStartX.current;
    pointerStartX.current = null;

    if (deltaX > 40) {
      onPrevious();
    } else if (deltaX < -40) {
      onNext();
    }
  }

  if (cities.length === 0) {
    return null;
  }

  const currentCity = cities[currentIndex];

  if (!currentCity) {
    return null;
  }

  const previousIndex =
    (currentIndex - 1 + cities.length) % cities.length;
  const nextIndex = (currentIndex + 1) % cities.length;
  const previousCity = cities[previousIndex];
  const nextCity = cities[nextIndex];
  const currentTimezone = timezones[currentCity.id] ?? null;

  return (
    <nav
      aria-label={t("location.carouselLabel")}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      className="city-carousel-header grid touch-pan-y w-full min-w-0 max-w-full grid-cols-[auto_minmax(0,1fr)_auto] items-stretch gap-2 px-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,3fr)_minmax(0,1fr)] sm:gap-3 sm:px-0"
    >
      <button
        type="button"
        onClick={onPrevious}
        aria-label={t("location.previousCity", {
          city: previousCity.name,
        })}
        className="city-navigation-button flex min-w-11 items-center justify-center px-3 py-2 backdrop-blur-md transition-colors opacity-80 hover:opacity-100 sm:min-w-0 sm:justify-start"
      >
        <Icon name="chevron-left" className="sm:hidden" />
        <span className="hidden max-w-full truncate font-medium sm:inline">
          {previousCity.name}
        </span>
      </button>

      <div className="city-information-panel flex w-full min-w-0 max-w-full flex-row items-center justify-center gap-2 px-2 py-5 text-center backdrop-blur-md sm:gap-10 sm:px-4">
        <FavoriteCityButton city={currentCity} />
        <div className="min-w-0 text-center">
          <h2 className="truncate text-2xl font-bold sm:text-4xl">
            {currentCity.name}
          </h2>

          <p className="truncate text-sm">
            {currentCity.region
              ? `${currentCity.region}, ${currentCity.countryCode}`
              : currentCity.countryCode}
          </p>
        </div>

        <div className="flex flex-col items-center justify-center">
          {currentTimezone ? (
            <>
              <CityLiveClock
                timezone={currentTimezone}
                locale={locale}
              />
              <span className="text-xs">
                {currentTimezone}
              </span>
            </>
          ) : (
            <span className="text-xs text-white/40">--:--</span>
          )}
        </div>        
      </div>

      <button
        type="button"
        onClick={onNext}
        aria-label={t("location.nextCity", {
          city: nextCity.name,
        })}
        className="city-navigation-button flex min-w-11 items-center justify-center px-3 py-2 backdrop-blur-md transition-colors opacity-80 hover:opacity-100 sm:min-w-0 sm:justify-end"
      >
        <Icon name="chevron-right" className="sm:hidden" />
        <span className="hidden max-w-full truncate font-medium sm:inline">
          {nextCity.name}
        </span>
      </button>
    </nav>
  );
}
