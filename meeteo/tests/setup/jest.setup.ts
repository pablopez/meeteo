import "@testing-library/jest-dom";
import type { ReactNode } from "react";

import { i18n } from "@/shared/config/i18n";

jest.mock("react-leaflet", () => {
  const React = jest.requireActual<typeof import("react")>("react");

  return {
    MapContainer: ({ children }: { children: ReactNode }) =>
      React.createElement("div", { "data-testid": "map" }, children),
    TileLayer: () => null,
    useMap: jest.fn(() => ({
      panBy: jest.fn(),
      zoomIn: jest.fn(),
      zoomOut: jest.fn(),
    })),
    useMapEvents: jest.fn(),
  };
});

beforeEach(async () => {
  window.localStorage.clear();
  document.documentElement.lang = "en";

  await i18n.changeLanguage("en");
});