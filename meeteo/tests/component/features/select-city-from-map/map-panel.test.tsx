import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useMap, useMapEvents } from "react-leaflet";

import { reverseGeocode, type City } from "@/entities/city";
import { MapPanel } from "@/features/select-city-from-map";
import { ToastProvider } from "@/shared/lib/toast";

jest.mock("@/entities/city", () => ({
  ...jest.requireActual("@/entities/city"),
  reverseGeocode: jest.fn(),
}));

const mockedReverseGeocode = jest.mocked(reverseGeocode);
const mockedUseMap = jest.mocked(useMap);
const mockedUseMapEvents = jest.mocked(useMapEvents);

const madrid: City = {
  id: "nominatim-123",
  name: "Madrid",
  countryCode: "ES",
  region: "Comunidad de Madrid",
  coordinates: {
    latitude: 40.4168,
    longitude: -3.7038,
  },
  isFavorite: false,
};

describe("MapPanel", () => {
  beforeEach(() => {
    mockedUseMap.mockReturnValue({
      panBy: jest.fn(),
      zoomIn: jest.fn(),
      zoomOut: jest.fn(),
    } as unknown as ReturnType<typeof useMap>);
  });

  it("selects a location when the map is clicked", async () => {
    const onCitySelected = jest.fn();

    mockedReverseGeocode.mockResolvedValue(madrid);

    render(
      <ToastProvider>
        <MapPanel
          onCitySelected={onCitySelected}
        />
      </ToastProvider>,
    );

    await screen.findByTestId("map");

    const mapEvents =
      mockedUseMapEvents.mock.calls.at(-1)?.[0];

    expect(mapEvents?.click).toBeDefined();

    act(() => {
      mapEvents?.click?.({
        latlng: { lat: 40.4168, lng: -3.7038 },
      } as Parameters<
        NonNullable<typeof mapEvents.click>
      >[0]);
    });

    expect(
      await screen.findByText(
        "City added to favorites",
      ),
    ).toBeInTheDocument();

    expect(onCitySelected).toHaveBeenCalledWith(madrid);
  });

  it("shows a custom pin cursor on hover", async () => {
    render(
      <ToastProvider>
        <MapPanel />
      </ToastProvider>,
    );

    const map = await screen.findByTestId("map");
    const container = map.parentElement;

    expect(container).not.toBeNull();
    expect(
      screen.queryByTestId("map-cursor"),
    ).not.toBeInTheDocument();

    const moveEvent = new MouseEvent("pointermove", {
      bubbles: true,
      clientX: 100,
      clientY: 100,
    });

    fireEvent(container!, moveEvent);

    expect(
      screen.getByTestId("map-cursor"),
    ).toBeInTheDocument();

    fireEvent.pointerLeave(container!);

    await waitFor(() => {
      expect(
        screen.queryByTestId("map-cursor"),
      ).not.toBeInTheDocument();
    });
  });

  it("zooms in and out using map controls", async () => {
    const user = userEvent.setup();
    const map = {
      panBy: jest.fn(),
      zoomIn: jest.fn(),
      zoomOut: jest.fn(),
    };

    mockedUseMap.mockReturnValue(
      map as unknown as ReturnType<typeof useMap>,
    );

    render(
      <ToastProvider>
        <MapPanel />
      </ToastProvider>,
    );

    await screen.findByTestId("map");

    await user.click(
      screen.getByRole("button", { name: "Zoom in" }),
    );

    expect(map.zoomIn).toHaveBeenCalledTimes(1);

    await user.click(
      screen.getByRole("button", {
        name: "Zoom out",
      }),
    );

    expect(map.zoomOut).toHaveBeenCalledTimes(1);
  });

  it("pans the map using chevron controls", async () => {
    const user = userEvent.setup();
    const map = {
      panBy: jest.fn(),
      zoomIn: jest.fn(),
      zoomOut: jest.fn(),
    };

    mockedUseMap.mockReturnValue(
      map as unknown as ReturnType<typeof useMap>,
    );

    render(
      <ToastProvider>
        <MapPanel />
      </ToastProvider>,
    );

    await screen.findByTestId("map");

    await user.click(
      screen.getByRole("button", { name: "Pan right" }),
    );

    expect(map.panBy).toHaveBeenCalledWith([
      -120, 0,
    ]);

    await user.click(
      screen.getByRole("button", { name: "Pan up" }),
    );

    expect(map.panBy).toHaveBeenCalledWith([0, 120]);
  });
});
