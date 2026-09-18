import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import type { City } from "@/entities/city";
import {
  getCurrentLocation,
  type CurrentLocation,
} from "@/entities/location";
import { LocateUserButton } from "@/features/locate-user";

jest.mock("@/entities/location", () => ({
  getCurrentLocation: jest.fn(),
}));

jest.mock("@/entities/city", () => ({
  ...jest.requireActual("@/entities/city"),
  reverseGeocode: jest.fn(),
}));

const mockedGetCurrentLocation =
  jest.mocked(getCurrentLocation);

const currentLocation: CurrentLocation = {
  id: "current-location",
  coordinates: {
    latitude: 40.4168,
    longitude: -3.7038,
  },
};

const locatedCity: City = {
  id: "nominatim-123",
  name: "Madrid",
  countryCode: "ES",
  region: "Madrid",
  coordinates: {
    latitude: 40.4168,
    longitude: -3.7038,
  },
  isFavorite: false,
};

describe("LocateUserButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns the located city", async () => {
    mockedGetCurrentLocation.mockResolvedValue(
      currentLocation,
    );

    const reverseGeocode = jest.requireMock(
      "@/entities/city",
    ).reverseGeocode as jest.Mock;
    reverseGeocode.mockResolvedValue(locatedCity);

    const onCityLocated = jest.fn();

    render(
      <LocateUserButton
        onCityLocated={onCityLocated}
      />,
    );

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(onCityLocated).toHaveBeenCalledWith(
        locatedCity,
      );
    });

    expect(onCityLocated).toHaveBeenCalledTimes(1);
  });

  it("disables the button while locating", () => {
    mockedGetCurrentLocation.mockImplementation(
      () => new Promise(() => undefined),
    );

    render(
      <LocateUserButton
        onCityLocated={jest.fn()}
      />,
    );

    const button = screen.getByRole("button");

    fireEvent.click(button);

    expect(button).toBeDisabled();
  });

  it("shows an error when location fails", async () => {
    mockedGetCurrentLocation.mockRejectedValue(
      new Error("Geolocation failed"),
    );

    const onCityLocated = jest.fn();

    render(
      <LocateUserButton
        onCityLocated={onCityLocated}
      />,
    );

    fireEvent.click(screen.getByRole("button"));

    expect(
      await screen.findByRole("alert"),
    ).toBeInTheDocument();

    expect(onCityLocated).not.toHaveBeenCalled();
  });
});