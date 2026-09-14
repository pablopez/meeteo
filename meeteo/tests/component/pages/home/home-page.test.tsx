import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ToastProvider } from "@/shared/lib/toast";
import { HomePage } from "@/views/home";

jest.mock("@/features/locate-user", () => ({
  ...jest.requireActual("@/features/locate-user"),
  useLocateUser: jest.fn(() => ({ locateUser: jest.fn() })),
}));

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

function renderHomePage() {
  return render(
    <ToastProvider>
      <HomePage />
    </ToastProvider>,
  );
}

describe("HomePage", () => {
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
});