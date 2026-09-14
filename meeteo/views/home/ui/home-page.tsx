"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

import type { City } from "@/entities/city";
import type {
  CurrentLocation,
  Location,
} from "@/entities/location";
import { useFavoriteCities } from "@/features/favorite-cities";
import { useLocateUser } from "@/features/locate-user";
import { useSelectedCity } from "@/features/select-city";
import { Carousel } from "@/shared/ui";
import { AppMenu } from "@/widgets/app-menu";
import { LocationOverview } from "@/widgets/location-overview";
import { WeatherOverview } from "@/widgets/weather-overview";

function isCity(
  location: Location | null,
): location is City {
  return (
    location !== null &&
    typeof (location as City).name === "string"
  );
}

export function HomePage() {
  const { t } = useTranslation();
  const { selectedCity, selectCity } =
    useSelectedCity();
  const { favorites } = useFavoriteCities();

  const [currentLocation, setCurrentLocation] =
    useState<CurrentLocation | null>(null);
  const [activeLocationId, setActiveLocationId] =
    useState<string | null>(null);
  const [timezones, setTimezones] = useState<
    Record<string, string>
  >({});

  const { locateUser } = useLocateUser({
    onLocationLocated: (location: CurrentLocation) => {
      setCurrentLocation(location);
    },
  });

  useEffect(() => {
    if (
      favorites.length === 0 &&
      !selectedCity &&
      !currentLocation
    ) {
      void locateUser();
    }
  }, [favorites, selectedCity, currentLocation, locateUser]);

  const carouselItems = useMemo<Location[]>(() => {
    const items: Location[] = [];

    if (favorites.length > 0) {
      items.push(...favorites);
    }

    if (
      selectedCity &&
      !favorites.some(
        (favorite) => favorite.id === selectedCity.id,
      )
    ) {
      items.push(selectedCity);
    }

    if (items.length === 0 && currentLocation) {
      items.push(currentLocation);
    }

    return items;
  }, [favorites, selectedCity, currentLocation]);

  const activeIndex = useMemo(() => {
    if (carouselItems.length === 0) {
      return -1;
    }

    const index = carouselItems.findIndex(
      (item) => item.id === activeLocationId,
    );

    return index === -1 ? 0 : index;
  }, [carouselItems, activeLocationId]);

  function handleCitySelect(city: City) {
    selectCity(city);
    setActiveLocationId(city.id);
  }

  function handleLocationLocated(
    location: CurrentLocation,
  ) {
    setCurrentLocation(location);
    setActiveLocationId(location.id);
  }

  function handleCarouselChange(index: number) {
    const item = carouselItems[index];

    if (item) {
      setActiveLocationId(item.id);
    }
  }

  const handleTimezoneChange = useCallback(
    (locationId: string, timezone: string) => {
      setTimezones((current) =>
        current[locationId] === timezone
          ? current
          : { ...current, [locationId]: timezone },
      );
    },
    [],
  );

  function getLocationLabel(
    location: Location | null,
  ): string | null {
    if (!location) {
      return null;
    }

    return isCity(location)
      ? location.name
      : t("location.current");
  }

  return (
    <>
      <AppMenu
        onCitySelect={handleCitySelect}
        onLocationLocated={handleLocationLocated}
      />

      <main className="min-h-screen bg-transparent px-6 py-8 text-solar-text transition-colors duration-[800ms] ease-in-out">
        <section className="mx-auto max-w-5xl">
          <header className="mb-6 text-center">
            <h1 className="text-3xl font-bold">
              {t("home.title")}
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              {t("home.description")}
            </p>
          </header>

          <div className="mt-8">
            {carouselItems.length > 0 ? (
              <Carousel
                items={carouselItems}
                getItemId={(item) => item.id}
                currentIndex={activeIndex}
                onChange={handleCarouselChange}
                paginationVariant="dots"
                renderItem={(location, index) => (
                  <div className="space-y-8">
                    <LocationOverview
                      location={location}
                      locationLabel={getLocationLabel(
                        location,
                      )}
                      timezone={timezones[location.id] ?? null}
                    />

                    <WeatherOverview
                      location={location}
                      onTimezoneChange={handleTimezoneChange}
                      isActive={index === activeIndex}
                    />
                  </div>
                )}
              />
            ) : (
              <WeatherOverview location={null} />
            )}
          </div>
        </section>
      </main>
    </>
  );
}
