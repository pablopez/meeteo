"use client";

import {
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useTranslation } from "react-i18next";

import type { City } from "@/entities/city";
import { LanguagePanel } from "@/features/change-language";
import { useFavoriteCities } from "@/features/favorite-cities";
import { LocateUserButton } from "@/features/locate-user";
import { CitySearch } from "@/features/search-city";
import {
  MapPanel,
  MapSelectorButton,
} from "@/features/select-city-from-map";
import { FavoritesPanel } from "@/features/manage-favorites";
import {
  MenuSquareButton,
  MenuToggleButton,
  Panel,
} from "@/shared/ui";

const MENU_ID = "app-menu-panel";

export type PanelKey =
  | "search"
  | "map"
  | "language"
  | "favorites";

type AppMenuProps = {
  isOpen: boolean;
  activePanel: PanelKey | null;
  onOpenChange: (isOpen: boolean) => void;
  onActivePanelChange: (
    activePanel: PanelKey | null,
  ) => void;
  onCitySelect: (city: City) => void;
  onCityLocated: (city: City) => void;
};

export function AppMenu({
  isOpen,
  activePanel,
  onOpenChange,
  onActivePanelChange,
  onCitySelect,
  onCityLocated,
}: AppMenuProps) {
  const { t } = useTranslation();
  const { favorites } = useFavoriteCities();
  const rootRef = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback(() => {
    onOpenChange(false);
    onActivePanelChange(null);
  }, [onOpenChange, onActivePanelChange]);

  const togglePanel = useCallback(
    (panel: PanelKey) => {
      onActivePanelChange(
        activePanel === panel ? null : panel,
      );
    },
    [activePanel, onActivePanelChange],
  );

  function handleCitySelect(city: City) {
    onCitySelect(city);
    closeMenu();
  }

  function handleCityLocated(city: City) {
    onCityLocated(city);
    closeMenu();
  }

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeMenu();
        return;
      }

      if (
        event.key !== "Tab" ||
        !rootRef.current
      ) {
        return;
      }

      const focusableElements = Array.from(
        rootRef.current.querySelectorAll<HTMLElement>(
          [
            "button:not([disabled])",
            "input:not([disabled])",
            "select:not([disabled])",
            "a[href]",
          ].join(","),
        ),
      );

      const firstElement = focusableElements[0];
      const lastElement =
        focusableElements[
          focusableElements.length - 1
        ];

      if (!firstElement || !lastElement) {
        return;
      }

      if (
        event.shiftKey &&
        document.activeElement === firstElement
      ) {
        event.preventDefault();
        lastElement.focus();
      }

      if (
        !event.shiftKey &&
        document.activeElement === lastElement
      ) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [isOpen, closeMenu]);

  return (
    <div ref={rootRef}>
      <MenuToggleButton
        isOpen={isOpen}
        openLabel={t("menu.open")}
        closeLabel={t("menu.close")}
        controls={MENU_ID}
        onClick={() => onOpenChange(!isOpen)}
        className="fixed right-4 top-4 z-50"
      />

      {isOpen && (
        <div
          id={MENU_ID}
          role="dialog"
          aria-modal="true"
          aria-labelledby="app-menu-title"
          className="fixed inset-0 z-40 overflow-y-auto bg-black/80 backdrop-blur-xl"
        >
          <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-6 pb-6 pt-24">
            <h2
              id="app-menu-title"
              className="sr-only"
            >
              {t("menu.title")}
            </h2>

            <div className="space-y-8">
              <section
                aria-label={t(
                  "menu.locationSection",
                )}
                className="flex flex-wrap justify-center gap-4"
              >
                <MenuSquareButton
                  icon="search"
                  label={t("menu.search")}
                  active={activePanel === "search"}
                  onClick={() =>
                    togglePanel("search")
                  }
                />

                <MapSelectorButton
                  active={activePanel === "map"}
                  onClick={() =>
                    togglePanel("map")
                  }
                />

                <LocateUserButton
                  onCityLocated={handleCityLocated}
                />

                <MenuSquareButton
                  icon="language"
                  label={t("menu.language")}
                  active={activePanel === "language"}
                  onClick={() =>
                    togglePanel("language")
                  }
                />

                <MenuSquareButton
                  icon="star"
                  label={t("menu.favorites")}
                  badge={
                    favorites.length > 0
                      ? favorites.length
                      : undefined
                  }
                  active={activePanel === "favorites"}
                  onClick={() =>
                    togglePanel("favorites")
                  }
                />
              </section>

              {activePanel === "search" && (
                <Panel aria-label={t("menu.search")}>
                  <CitySearch
                    onCitySelect={handleCitySelect}
                  />
                </Panel>
              )}

              {activePanel === "map" && (
                <MapPanel
                  onCitySelected={handleCitySelect}
                />
              )}

              {activePanel === "language" && (
                <LanguagePanel />
              )}

              {activePanel === "favorites" && (
                <FavoritesPanel />
              )}
            </div>

            <footer className="mt-auto border-t border-white/20 pt-6 text-sm text-white/70">
              <h3 className="mb-3 font-semibold text-white">
                {t("menu.dataSources")}
              </h3>

              <div className="space-y-2">
                <p>
                  {t("menu.weatherData")}:{" "}
                  <a
                    href="https://open-meteo.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    Open-Meteo
                  </a>
                </p>

                <p>
                  {t("menu.environmentData")}:{" "}
                  <a
                    href="https://atmosphere.copernicus.eu/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    CAMS
                  </a>
                </p>

                <p>
                  {t("menu.mapData")}:{" "}
                  <a
                    href="https://www.openstreetmap.org/copyright"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    OpenStreetMap
                  </a>
                </p>
              </div>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
