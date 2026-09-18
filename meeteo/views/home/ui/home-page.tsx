"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

import { reverseGeocode } from "@/entities/city";
import type { City } from "@/entities/city";
import { getCurrentLocation } from "@/entities/location";
import type { Location } from "@/entities/location";
import { useFavoriteCities } from "@/features/favorite-cities";
import { useSelectedCity } from "@/features/select-city";
import { Carousel } from "@/shared/ui";
import { AppMenu, type PanelKey } from "@/widgets/app-menu";
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

  const [activeLocationId, setActiveLocationId] =
    useState<string | null>(null);
  const [timezones, setTimezones] = useState<
    Record<string, string>
  >({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenuPanel, setActiveMenuPanel] =
    useState<PanelKey | null>(null);
  const hasAttemptedLocation = useRef(false);

  useEffect(() => {
    if (
      favorites.length > 0 ||
      selectedCity ||
      hasAttemptedLocation.current
    ) {
      return;
    }

    hasAttemptedLocation.current = true;

    void getCurrentLocation()
      .then((location) =>
        reverseGeocode(location.coordinates),
      )
      .then((city) => {
        selectCity(city);
        setActiveLocationId(city.id);
      })
      .catch(() => {
        setActiveMenuPanel("search");
        setIsMenuOpen(true);
      });
  }, [favorites, selectedCity, selectCity]);

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

    return items;
  }, [favorites, selectedCity]);

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

  function handleCityLocated(city: City) {
    selectCity(city);
    setActiveLocationId(city.id);
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
        isOpen={isMenuOpen}
        activePanel={activeMenuPanel}
        onOpenChange={setIsMenuOpen}
        onActivePanelChange={setActiveMenuPanel}
        onCitySelect={handleCitySelect}
        onCityLocated={handleCityLocated}
      />

      <main className="min-h-screen w-full bg-transparent text-white">
        <section className="mx-auto">
          <header className="sr-only">
            <h1 className="text-3xl font-bold">
              {t("home.title")}
            </h1>

            <p className="mt-2 text-sm text-white/70">
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
