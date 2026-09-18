"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import type { MapCoordinates } from "./map-selector";

const MapSelector = dynamic(
  () =>
    import("./map-selector").then((module) => module.MapSelector),
  {
    ssr: false,
  },
);

type MapModalProps = {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onLocationSelect: (coordinates: MapCoordinates) => void;
};

export function MapModal({
  isOpen,
  isLoading,
  onClose,
  onLocationSelect,
}: MapModalProps) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isLoading) {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLoading, isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t("mapSelector.dialogLabel")}
      className="fixed inset-0 z-[100] bg-black/80"
    >
      <MapSelector onLocationSelect={onLocationSelect} />

      <button
        type="button"
        onClick={onClose}
        disabled={isLoading}
        aria-label={t("mapSelector.close")}
        className="absolute right-4 top-[calc(1rem+env(safe-area-inset-top))] z-[110] rounded-full border border-white/20 bg-white/10 px-4 py-2 font-medium text-white backdrop-blur-md disabled:cursor-wait disabled:opacity-60"
      >
        {t("mapSelector.close")}
      </button>

      {isLoading && (
        <div
          role="status"
          className="absolute inset-0 z-[105] grid place-items-center bg-black/60 backdrop-blur-sm"
        >
          <span className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 font-medium text-white backdrop-blur-md">
            {t("mapSelector.loading")}
          </span>
        </div>
      )}
    </div>
  );
}
