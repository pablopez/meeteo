import { render, screen } from "@testing-library/react";

import { createCity, type City } from "@/entities/city";
import { createCurrentLocation } from "@/entities/location";
import { LocationOverview } from "@/widgets/location-overview";

const madrid: City = createCity({
  id: "madrid",
  name: "Madrid",
  countryCode: "ES",
  region: "Comunidad de Madrid",
  coordinates: {
    latitude: 40.4165,
    longitude: -3.7026,
  },
});

const currentLocation = createCurrentLocation({
  latitude: 40.4165,
  longitude: -3.7026,
});

describe("LocationOverview", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders nothing when location is null", () => {
    const { container } = render(
      <LocationOverview
        location={null}
        locationLabel={null}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("renders city name and region", () => {
    render(
      <LocationOverview
        location={madrid}
        locationLabel={madrid.name}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Madrid" }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Comunidad de Madrid, ES"),
    ).toBeInTheDocument();
  });

  it("renders the live local time and timezone", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-09-04T12:00:00Z"));

    render(
      <LocationOverview
        location={madrid}
        locationLabel={madrid.name}
        timezone="Asia/Tokyo"
      />,
    );

    expect(screen.getByText("Asia/Tokyo")).toBeInTheDocument();
    expect(
      screen.getByLabelText("21:00:00, Asia/Tokyo"),
    ).toBeInTheDocument();

    jest.useRealTimers();
  });

  it("renders current location label", () => {
    render(
      <LocationOverview
        location={currentLocation}
        locationLabel="Current location"
      />,
    );

    expect(
      screen.getByRole("heading", {
        name: "Current location",
      }),
    ).toBeInTheDocument();
  });
});
