import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { createCity, type City } from "@/entities/city";
import { FavoriteCityButton } from "@/features/favorite-cities";

const madrid: City = createCity({
  id: "madrid",
  name: "Madrid",
  countryCode: "ES",
  coordinates: {
    latitude: 40.4165,
    longitude: -3.7026,
  },
});

describe("FavoriteCityButton", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("is disabled when no city is provided", () => {
    render(<FavoriteCityButton city={null} />);

    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("adds the city to favorites when clicked", async () => {
    const user = userEvent.setup();

    render(<FavoriteCityButton city={madrid} />);

    await user.click(screen.getByRole("button"));

    const stored = window.localStorage.getItem(
      "meeteo:favorite-cities",
    );

    expect(JSON.parse(stored!)).toHaveLength(1);
  });

  it("removes the city from favorites when confirmed", async () => {
    const user = userEvent.setup();

    render(<FavoriteCityButton city={madrid} />);

    const button = screen.getByRole("button", {
      name: "Add to favorites",
    });

    await user.click(button);

    await user.click(
      screen.getByRole("button", {
        name: "Remove from favorites",
      }),
    );

    await user.click(
      screen.getByRole("button", {
        name: "Confirm",
      }),
    );

    const stored = window.localStorage.getItem(
      "meeteo:favorite-cities",
    );

    expect(JSON.parse(stored!)).toHaveLength(0);
  });
});
