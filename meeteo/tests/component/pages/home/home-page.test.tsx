import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { getCurrentLocation } from "@/entities/location";
import { ToastProvider } from "@/shared/lib/toast";
import { HomePage } from "@/views/home";

jest.mock("@/entities/location", () => ({
  ...jest.requireActual("@/entities/location"),
  getCurrentLocation: jest.fn(),
}));

const mockedGetCurrentLocation =
  jest.mocked(getCurrentLocation);

jest.mock("@/entities/weather", () => ({
  ...jest.requireActual("@/entities/weather"),
  getWeatherForecast: jest.fn(
    () =>
      new Promise(() => {
        // never resolves to avoid act warnings
      }),
  ),
}));

jest.mock("@/entities/environment", () => ({
  ...jest.requireActual("@/entities/environment"),
  getEnvironmentForecast: jest.fn(
    () =>
      new Promise(() => {
        // never resolves to avoid act warnings
      }),
  ),
}));

const defaultSelectedCity = {
  id: "default-city",
  name: "Default City",
  countryCode: "DC",
  region: "Default Region",
  coordinates: { latitude: 0, longitude: 0 },
  isFavorite: false,
};

function renderHomePage(
  { withDefaultCity = true } = {},
) {
  if (withDefaultCity) {
    window.localStorage.setItem(
      "meeteo:selected-city",
      JSON.stringify(defaultSelectedCity),
    );
  }

  return render(
    <ToastProvider>
      <HomePage />
    </ToastProvider>,
  );
}

describe("HomePage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });
  it("renders the application title", () => {
    renderHomePage();

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Meeteo",
      }),
    ).toBeInTheDocument();
  });

  it("translates the page into Spanish", async () => {
    const user = userEvent.setup();

    renderHomePage();

    await user.click(
      screen.getByRole("button", {
        name: "Open menu",
      }),
    );

    await user.click(
      screen.getByRole("button", {
        name: "Language",
      }),
    );

    await user.click(
      screen.getByRole("button", {
        name: "Español",
      }),
    );

    expect(
      await screen.findByText(
        "Información meteorológica de localidades de todo el mundo.",
      ),
    ).toBeInTheDocument();
  });

  it("loads the first favorite city on startup", () => {
    const favoriteCity = {
      id: "favorite-madrid",
      name: "Madrid",
      countryCode: "ES",
      region: "Comunidad de Madrid",
      coordinates: { latitude: 40.4165, longitude: -3.7026 },
      isFavorite: true,
    };

    window.localStorage.setItem(
      "meeteo:favorite-cities",
      JSON.stringify([favoriteCity]),
    );

    renderHomePage();

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Madrid",
      }),
    ).toBeInTheDocument();
  });

  it("shows the favorites section in the menu", async () => {
    const user = userEvent.setup();

    renderHomePage();

    await user.click(
      screen.getByRole("button", { name: "Open menu" }),
    );

    expect(
      screen.getByRole("button", { name: "Favorites" }),
    ).toBeInTheDocument();
  });

  it("opens the search panel when location is denied and no city is selected", async () => {
    mockedGetCurrentLocation.mockRejectedValue(
      new Error("Geolocation denied"),
    );

    renderHomePage({ withDefaultCity: false });

    expect(
      await screen.findByLabelText(
        "Search for a city or town",
      ),
    ).toBeInTheDocument();
  });
});