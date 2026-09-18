"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { reverseGeocode, type City } from "@/entities/city";
import { useSelectedCity } from "@/features/select-city";
import { useToast } from "@/shared/lib/toast";
import { Icon, Panel } from "@/shared/ui";

import type { MapCoordinates } from "./map-selector";

const MapSelector = dynamic(
  () =>
    import("./map-selector").then(
      (module) => module.MapSelector,
    ),
  { ssr: false },
);

type MapPanelProps = {
  onCitySelected?: (city: City) => void;
};

export function MapPanel({
  onCitySelected,
}: MapPanelProps) {
  const { t } = useTranslation();
  const toast = useToast();
  const { selectCity } = useSelectedCity();
  const [isLoading, setIsLoading] = useState(false);
  const [cursorPosition, setCursorPosition] =
    useState<{ x: number; y: number } | null>(null);

  async function handleLocationSelect({
    latitude,
    longitude,
  }: MapCoordinates) {
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      const city = await reverseGeocode({
        latitude,
        longitude,
      });

      selectCity(city);
      onCitySelected?.(city);
      toast.success(t("mapSelector.success"));
    } catch {
      toast.error(t("mapSelector.error"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Panel
      aria-label={t("mapSelector.dialogLabel")}
      className="relative overflow-hidden !p-0"
    >
      <div
        className="map-cursor-none relative h-96 w-full"
        onPointerMove={(event) => {
          const target = event.target;

          if (
            target instanceof Element &&
            target.closest("[data-viewport-control]")
          ) {
            setCursorPosition(null);
            return;
          }

          const rect =
            event.currentTarget.getBoundingClientRect();

          setCursorPosition({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
          });
        }}
        onPointerLeave={() => setCursorPosition(null)}
      >
        <MapSelector
          onLocationSelect={handleLocationSelect}
        />

        {cursorPosition && (
          <div
            data-testid="map-cursor"
            className="pointer-events-none absolute z-[1001] -translate-x-1/2 -translate-y-full text-danger"
            style={{
              left: cursorPosition.x,
              top: cursorPosition.y,
            }}
          >
            <Icon
              name="location"
              className="h-6 w-6"
            />
          </div>
        )}
      </div>

      {isLoading && (
        <div
          role="status"
          className="absolute inset-0 z-50 grid place-items-center bg-background/60"
        >
          <span className="rounded-xl border border-border bg-surface px-5 py-3 font-medium">
            {t("mapSelector.loading")}
          </span>
        </div>
      )}
    </Panel>
  );
}
