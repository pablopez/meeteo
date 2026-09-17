"use client";

import { useTranslation } from "react-i18next";
import {
  MapContainer,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

import { Icon } from "@/shared/ui";

export type MapCoordinates = {
  latitude: number;
  longitude: number;
};

type MapSelectorProps = {
  onLocationSelect: (coordinates: MapCoordinates) => void;
};

const PAN_OFFSET = 120;

function MapClickHandler({
  onLocationSelect,
}: MapSelectorProps) {
  useMapEvents({
    click: ({ latlng }) => {
      onLocationSelect({
        latitude: latlng.lat,
        longitude: latlng.lng,
      });
    },
  });

  return null;
}

function MapControls() {
  const { t } = useTranslation();
  const map = useMap();

  const buttonClassName =
    "z-[1000] flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface text-foreground transition-colors hover:bg-surface-muted";

  function handleButtonClick(
    event: React.MouseEvent<HTMLButtonElement>,
    action: () => void,
  ) {
    event.stopPropagation();
    action();
  }

  return (
    <>
      <button
        type="button"
        aria-label={t("mapSelector.zoomIn")}
        onClick={(event) =>
          handleButtonClick(event, () => map.zoomIn())
        }
        className={`${buttonClassName} absolute right-14 top-4`}
      >
        <span className="text-lg font-bold leading-none">
          +
        </span>
      </button>

      <button
        type="button"
        aria-label={t("mapSelector.zoomOut")}
        onClick={(event) =>
          handleButtonClick(event, () => map.zoomOut())
        }
        className={`${buttonClassName} absolute right-4 top-4`}
      >
        <span className="text-lg font-bold leading-none">
          -
        </span>
      </button>

      <button
        type="button"
        aria-label={t("mapSelector.panUp")}
        onClick={(event) =>
          handleButtonClick(event, () =>
            map.panBy([0, PAN_OFFSET]),
          )
        }
        className={`${buttonClassName} absolute left-1/2 top-4 -translate-x-1/2`}
      >
        <Icon name="chevron-up" />
      </button>

      <button
        type="button"
        aria-label={t("mapSelector.panDown")}
        onClick={(event) =>
          handleButtonClick(event, () =>
            map.panBy([0, -PAN_OFFSET]),
          )
        }
        className={`${buttonClassName} absolute bottom-4 left-1/2 -translate-x-1/2`}
      >
        <Icon name="chevron-down" />
      </button>

      <button
        type="button"
        aria-label={t("mapSelector.panLeft")}
        onClick={(event) =>
          handleButtonClick(event, () =>
            map.panBy([PAN_OFFSET, 0]),
          )
        }
        className={`${buttonClassName} absolute left-4 top-1/2 -translate-y-1/2`}
      >
        <Icon name="chevron-left" />
      </button>

      <button
        type="button"
        aria-label={t("mapSelector.panRight")}
        onClick={(event) =>
          handleButtonClick(event, () =>
            map.panBy([-PAN_OFFSET, 0]),
          )
        }
        className={`${buttonClassName} absolute right-4 top-1/2 -translate-y-1/2`}
      >
        <Icon name="chevron-right" />
      </button>
    </>
  );
}

export function MapSelector({
  onLocationSelect,
}: MapSelectorProps) {
  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      minZoom={2}
      className="h-full w-full"
      worldCopyJump
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapClickHandler onLocationSelect={onLocationSelect} />
      <MapControls />
    </MapContainer>
  );
}
