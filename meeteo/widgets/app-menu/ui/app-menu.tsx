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

import { AppInfoPanel } from "./app-info-panel";

const MENU_ID = "app-menu-panel";

export type PanelKey =
  | "search"
  | "map"
  | "language"
  | "favorites"
  | "info";

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
  const hasSetDefaultPanel = useRef(false);

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

  function handleToggleMenu() {
    if (isOpen) {
      closeMenu();
      return;
    }

    onOpenChange(true);
    onActivePanelChange("search");
  }

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      hasSetDefaultPanel.current = false;
      return;
    }

    if (
      activePanel === null &&
      !hasSetDefaultPanel.current
    ) {
      hasSetDefaultPanel.current = true;
      onActivePanelChange("search");
    }
  }, [isOpen, activePanel, onActivePanelChange]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

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
      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [isOpen, closeMenu]);

  const containerTransformClass = isOpen
    ? "translate-y-0"
    : "-translate-y-[calc(100%-(4rem+env(safe-area-inset-top)))]";

  const headerSafeAreaClass = isOpen
    ? "pb-[env(safe-area-inset-bottom)]"
    : "pt-[env(safe-area-inset-top)]";

  return (
    <div ref={rootRef}>
      <div
        id={MENU_ID}
        className={[
          "fixed inset-x-0 top-0 z-50 h-[100dvh] overflow-hidden",
          "bg-white/40 backdrop-blur-2xl dark:bg-black/40",
          "transform transition-transform duration-300 ease-in-out will-change-transform",
          containerTransformClass,
        ].join(" ")}
      >
        <div className="flex h-full flex-col">
          <div
            role={isOpen ? "dialog" : undefined}
            aria-modal={isOpen ? true : undefined}
            aria-labelledby={
              isOpen ? "app-menu-title" : undefined
            }
            aria-hidden={!isOpen}
            inert={!isOpen}
            className="flex-1 overflow-y-auto px-6 pt-6"
          >
            {isOpen && (
              <>
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

                    <MenuSquareButton
                      icon="info"
                      label={t("menu.info")}
                      active={activePanel === "info"}
                      onClick={() =>
                        togglePanel("info")
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

                  {activePanel === "info" && (
                    <AppInfoPanel />
                  )}
                </div>
              </>
            )}
          </div>

          <header
            className={[
              "relative flex h-16 flex-none items-center justify-center px-4",
              "transition-all duration-300 ease-in-out",
              headerSafeAreaClass,
            ].join(" ")}
          >
            <h1 className="text-2xl font-extrabold tracking-tight">
              {t("home.title")}
            </h1>

            <MenuToggleButton
              isOpen={isOpen}
              openLabel={t("menu.open")}
              closeLabel={t("menu.close")}
              controls={MENU_ID}
              onClick={handleToggleMenu}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            />
          </header>
        </div>
      </div>

    </div>
  );
}
