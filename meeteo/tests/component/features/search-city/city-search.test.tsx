import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { City } from "@/entities/city";
import { searchCities } from "@/entities/city";
import { CitySearch } from "@/features/search-city";

jest.mock("@/entities/city", () => ({
  searchCities: jest.fn(),
}));

const mockedSearchCities = jest.mocked(searchCities);

describe("CitySearch", () => {
  beforeEach(() => {
    mockedSearchCities.mockReset();
  });

  it("searches and selects a city", async () => {
    const user = userEvent.setup();
    const onCitySelect = jest.fn();

    const madrid: City = {
      id: "3117735",
      name: "Madrid",
      countryCode: "ES",
      region: "Comunidad de Madrid",
      coordinates: {
        latitude: 40.4165,
        longitude: -3.7026,
      },
      isFavorite: false,
    };

    mockedSearchCities.mockResolvedValue([madrid]);

    render(
      <CitySearch onCitySelect={onCitySelect} />,
    );

    await user.type(
      screen.getByRole("combobox", {
        name: "Search for a city or town",
      }),
      "Madrid",
    );

    const result = await screen.findByRole(
      "option",
      { name: /Madrid/ },
      { timeout: 1500 },
    );

    expect(mockedSearchCities).toHaveBeenCalledWith(
      expect.objectContaining({
        query: "Madrid",
        language: "en",
      }),
    );

    await user.click(result);

    expect(onCitySelect).toHaveBeenCalledWith(madrid);
  });
});