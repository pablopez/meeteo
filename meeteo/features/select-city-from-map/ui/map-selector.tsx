"use client";

import { useTranslation } from "react-i18next";
import {
  MapContainer,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

import { ViewportControls } from "@/shared/ui";

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
    click: (event) => {
      const target = event.originalEvent?.target;

      if (
        target instanceof Element &&
        target.closest(
          ".leaflet-control, [data-viewport-control]",
        )
      ) {
        return;
      }

      onLocationSelect({
        latitude: event.latlng.lat,
        longitude: event.latlng.lng,
      });
    },
  });

  return null;
}

function MapNavigationControls({
  onLocationSelect,
}: MapSelectorProps) {
  const { t } = useTranslation();
  const map = useMap();

  return (
    <ViewportControls
      className="h-full w-full"
      controlClassName="leaflet-control"
      zoomInLabel={t("mapSelector.zoomIn")}
      zoomOutLabel={t("mapSelector.zoomOut")}
      panUpLabel={t("mapSelector.panUp")}
      panDownLabel={t("mapSelector.panDown")}
      panLeftLabel={t("mapSelector.panLeft")}
      panRightLabel={t("mapSelector.panRight")}
      onZoomIn={() => map.zoomIn()}
      onZoomOut={() => map.zoomOut()}
      onPanUp={() => map.panBy([0, -PAN_OFFSET])}
      onPanDown={() => map.panBy([0, PAN_OFFSET])}
      onPanLeft={() => map.panBy([-PAN_OFFSET, 0])}
      onPanRight={() => map.panBy([PAN_OFFSET, 0])}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapClickHandler onLocationSelect={onLocationSelect} />
    </ViewportControls>
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
      <MapNavigationControls
        onLocationSelect={onLocationSelect}
      />
    </MapContainer>
  );
}
