import { createCity } from "@/entities/city";

describe("createCity", () => {
  const validCity = {
    id: "madrid",
    name: "Madrid",
    countryCode: "ES",
    region: "Comunidad de Madrid",
    coordinates: {
      latitude: 40.4168,
      longitude: -3.7038,
    },
  };

  it("creates a city as not favorite by default", () => {
    const city = createCity(validCity);

    expect(city).toEqual({
      ...validCity,
      isFavorite: false,
    });
  });

  it("preserves the favorite state", () => {
    const city = createCity({
      ...validCity,
      isFavorite: true,
    });

    expect(city.isFavorite).toBe(true);
  });

  it("removes surrounding spaces from the name", () => {
    const city = createCity({
      ...validCity,
      name: "  Madrid  ",
    });

    expect(city.name).toBe("Madrid");
  });

  it("rejects invalid coordinates", () => {
    expect(() =>
      createCity({
        ...validCity,
        coordinates: {
          latitude: 100,
          longitude: -3.7038,
        },
      }),
    ).toThrow("Invalid latitude");
  });
});