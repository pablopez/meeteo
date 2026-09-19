"use client";

import { useTranslation } from "react-i18next";

import type { City } from "@/entities/city";
import { FavoriteCityButton } from "@/features/favorite-cities";
import { useLiveTime } from "@/shared/lib/time/use-live-time";

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
      className="font-mono text-2xl font-semibold tabular-nums"
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
      className="city-carousel-header grid w-full min-w-0 max-w-full grid-cols-2 items-stretch gap-3 px-2 pt-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,3fr)_minmax(0,1fr)] sm:px-0"
    >
      <button
        type="button"
        onClick={onPrevious}
        aria-label={t("location.previousCity", {
          city: previousCity.name,
        })}
        className="city-navigation-button min-w-0 items-center justify-center rounded-full border border-white/20 px-3 py-2 text-center text-sm text-white/70 backdrop-blur-md transition-colors hover:bg-white/10 sm:flex"
      >
        <span className="truncate max-w-full font-medium">
          {previousCity.name}
        </span>
      </button>

      <div className="city-information-panel order-first col-span-2 grid w-full min-w-0 max-w-full grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 rounded-3xl border border-white/40 px-4 py-5 text-center backdrop-blur-md sm:order-none sm:col-span-1 sm:gap-4 sm:px-8">
        <div className="min-w-0 text-left">
          <h2 className="truncate text-xl font-bold sm:text-2xl">
            {currentCity.name}
          </h2>

          <p className="truncate text-sm text-white/70">
            {currentCity.region
              ? `${currentCity.region}, ${currentCity.countryCode}`
              : currentCity.countryCode}
          </p>
        </div>

        <div className="flex flex-col items-center justify-center border-x border-white/20 px-4">
          {currentTimezone ? (
            <>
              <CityLiveClock
                timezone={currentTimezone}
                locale={locale}
              />
              <span className="text-xs text-white/60">
                {currentTimezone}
              </span>
            </>
          ) : (
            <span className="text-xs text-white/40">--:--</span>
          )}
        </div>

        <div className="flex justify-end">
          <FavoriteCityButton city={currentCity} />
        </div>
      </div>

      <button
        type="button"
        onClick={onNext}
        aria-label={t("location.nextCity", {
          city: nextCity.name,
        })}
        className="city-navigation-button min-w-0 items-center justify-center rounded-full border border-white/20 px-3 py-2 text-center text-sm text-white/70 backdrop-blur-md transition-colors hover:bg-white/10 sm:flex"
      >
        <span className="truncate max-w-full font-medium">
          {nextCity.name}
        </span>
      </button>
    </nav>
  );
}
