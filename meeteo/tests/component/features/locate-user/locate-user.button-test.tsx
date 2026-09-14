import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import {
  getCurrentLocation,
  type CurrentLocation,
} from "@/entities/location";
import { LocateUserButton } from "@/features/locate-user";

jest.mock("@/entities/location", () => ({
  getCurrentLocation: jest.fn(),
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

describe("LocateUserButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns the current location", async () => {
    mockedGetCurrentLocation.mockResolvedValue(
      currentLocation,
    );

    const onLocationLocated = jest.fn();

    render(
      <LocateUserButton
        onLocationLocated={onLocationLocated}
      />,
    );

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(onLocationLocated).toHaveBeenCalledWith(
        currentLocation,
      );
    });

    expect(onLocationLocated).toHaveBeenCalledTimes(1);
  });

  it("disables the button while locating", () => {
    mockedGetCurrentLocation.mockImplementation(
      () => new Promise(() => undefined),
    );

    render(
      <LocateUserButton
        onLocationLocated={jest.fn()}
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

    const onLocationLocated = jest.fn();

    render(
      <LocateUserButton
        onLocationLocated={onLocationLocated}
      />,
    );

    fireEvent.click(screen.getByRole("button"));

    expect(
      await screen.findByRole("alert"),
    ).toBeInTheDocument();

    expect(onLocationLocated).not.toHaveBeenCalled();
  });
});