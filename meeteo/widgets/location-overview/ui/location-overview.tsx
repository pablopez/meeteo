"use client";

import { useTranslation } from "react-i18next";

import type { City } from "@/entities/city";
import type { Location } from "@/entities/location";
import { FavoriteCityButton } from "@/features/favorite-cities";
import { useLiveTime } from "@/shared/lib/time/use-live-time";
import { LiveClock, Panel } from "@/shared/ui";

function isCity(
  location: Location | null,
): location is City {
  return (
    location !== null &&
    typeof (location as City).name === "string"
  );
}

type LocationOverviewProps = {
  location: Location | null;
  locationLabel: string | null;
  timezone?: string | null;
};

function LocationLiveClock({ timezone }: { timezone: string }) {
  const { i18n } = useTranslation();
  const liveTime = useLiveTime(
    timezone,
    i18n.resolvedLanguage ?? "en",
  );

  return (
    <LiveClock
      time={liveTime.time}
      timezone={timezone}
      separatorVisible={liveTime.separatorVisible}
    />
  );
}

export function LocationOverview({
  location,
  locationLabel,
  timezone = null,
}: LocationOverviewProps) {
  const { t } = useTranslation();

  if (!location || !locationLabel) {
    return null;
  }

  const city = isCity(location) ? location : null;

  return (
    <Panel
      aria-label={t("location.overviewLabel")}
      className="relative z-10"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">
            {locationLabel}
          </h2>

          {city && (
            <p className="mt-1 text-white/70">
              {city.region
                ? `${city.region}, ${city.countryCode}`
                : city.countryCode}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4">
          {timezone && <LocationLiveClock timezone={timezone} />}
          {city && <FavoriteCityButton city={city} />}
        </div>
      </div>
    </Panel>
  );
}
