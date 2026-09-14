import {
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { createCity } from "@/entities/city";
import { createFavoriteCities } from "@/entities/favorite-cities";
import { saveFavoriteCities } from "@/entities/favorite-cities/lib/favorite-cities-storage";
import { FavoritesPanel } from "@/features/manage-favorites";

const madrid = createCity({
  id: "madrid",
  name: "Madrid",
  countryCode: "ES",
  region: "Comunidad de Madrid",
  coordinates: {
    latitude: 40.4165,
    longitude: -3.7026,
  },
});

const barcelona = createCity({
  id: "barcelona",
  name: "Barcelona",
  countryCode: "ES",
  region: "Catalonia",
  coordinates: {
    latitude: 41.3874,
    longitude: 2.1686,
  },
});

describe("FavoritesPanel", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("shows an empty state when there are no favorites", () => {
    render(<FavoritesPanel />);

    expect(
      screen.getByText("No favorite cities yet."),
    ).toBeInTheDocument();
  });

  it("lists favorite cities", () => {
    saveFavoriteCities(
      createFavoriteCities([madrid, barcelona]),
    );

    render(<FavoritesPanel />);

    expect(
      screen.getByText("Madrid"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Barcelona"),
    ).toBeInTheDocument();
  });

  it("removes a city from favorites", async () => {
    const user = userEvent.setup();

    saveFavoriteCities(createFavoriteCities([madrid]));

    render(<FavoritesPanel />);

    await user.click(
      screen.getByRole("button", {
        name: "Remove from favorites",
      }),
    );

    await waitFor(() => {
      expect(
        screen.queryByText("Madrid"),
      ).not.toBeInTheDocument();
    });
  });

  it("reorders a city down", async () => {
    const user = userEvent.setup();

    saveFavoriteCities(
      createFavoriteCities([madrid, barcelona]),
    );

    render(<FavoritesPanel />);

    const buttons = screen.getAllByRole("button", {
      name: "Move Madrid down",
    });

    await user.click(buttons[0]);

    await waitFor(() => {
      const cities = screen.getAllByText(
        /Madrid|Barcelona/,
      );

      expect(cities[0]).toHaveTextContent(
        "Barcelona",
      );

      expect(cities[1]).toHaveTextContent("Madrid");
    });
  });

  it("disables the up button on the first item", () => {
    saveFavoriteCities(
      createFavoriteCities([madrid, barcelona]),
    );

    render(<FavoritesPanel />);

    expect(
      screen.getByRole("button", {
        name: "Move Madrid up",
      }),
    ).toBeDisabled();
  });
});
