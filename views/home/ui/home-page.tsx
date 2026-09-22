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
import type { SkyState } from "@/entities/weather";
import { useFavoriteCities } from "@/features/favorite-cities";
import { useSelectedCity } from "@/features/select-city";
import { Carousel } from "@/shared/ui";
import { AppMenu, type PanelKey } from "@/widgets/app-menu";
import { CityCarouselHeader } from "@/widgets/city-carousel-header";
import { WeatherOverview } from "@/widgets/weather-overview";

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
  const [skyStateByLocation, setSkyStateByLocation] = useState<
    Record<string, SkyState>
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

  const carouselItems = useMemo<City[]>(() => {
    const items: City[] = [];

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

  function handleGoToCity(index: number) {
    const city = carouselItems[index];

    if (city) {
      setActiveLocationId(city.id);
    }
  }

  function handlePreviousCity() {
    handleGoToCity(
      (activeIndex - 1 + carouselItems.length) %
        carouselItems.length,
    );
  }

  function handleNextCity() {
    handleGoToCity(
      (activeIndex + 1) % carouselItems.length,
    );
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

  const handleSkyStateChange = useCallback(
    (locationId: string, skyState: SkyState) => {
      setSkyStateByLocation((current) =>
        current[locationId] === skyState
          ? current
          : { ...current, [locationId]: skyState },
      );
    },
    [],
  );

  const activeLocation = carouselItems[activeIndex];
  const skyState = activeLocation
    ? skyStateByLocation[activeLocation.id] ?? "day"
    : "day";

  useEffect(() => {
    document.body.dataset.skyState = skyState;

    return () => {
      delete document.body.dataset.skyState;
    };
  }, [skyState]);

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

      <main className="min-h-screen w-full max-w-full overflow-x-hidden bg-transparent pt-[calc(4rem+env(safe-area-inset-top))] text-white">
        <section className="mx-auto w-full min-w-0 max-w-full">
          <div className="sr-only">
            <p className="text-sm ">
              {t("home.description")}
            </p>
          </div>

          <div className="">
            {carouselItems.length > 0 ? (
              <section aria-label={t("location.overviewLabel")}>
                <CityCarouselHeader
                  cities={carouselItems}
                  currentIndex={activeIndex}
                  timezones={timezones}
                  onPrevious={handlePreviousCity}
                  onNext={handleNextCity}
                />

                <Carousel
                  items={carouselItems}
                  getItemId={(item) => item.id}
                  currentIndex={activeIndex}
                  onChange={handleCarouselChange}
                  paginationVariant="hidden"
                  showNavigation={false}
                  swipeEnabled={false}
                  renderItem={(location, index) => (
                    <div className="space-y-8 pt-2">
                      <WeatherOverview
                        location={location}
                        onTimezoneChange={handleTimezoneChange}
                        onSkyStateChange={handleSkyStateChange}
                        isActive={index === activeIndex}
                      />
                    </div>
                  )}
                />
              </section>
            ) : (
              <WeatherOverview location={null} />
            )}
          </div>
        </section>
      </main>
    </>
  );
}
