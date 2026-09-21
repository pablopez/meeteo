import { mapLocationToCity } from "@/entities/city/lib/map-location-to-city";

describe("mapLocationToCity", () => {
  it("maps an Open-Meteo location to the City entity", () => {
    const city = mapLocationToCity({
      id: 3117735,
      name: "Madrid",
      latitude: 40.4165,
      longitude: -3.7026,
      country_code: "ES",
      admin1: "Comunidad de Madrid",
    });

    expect(city).toEqual({
      id: "3117735",
      name: "Madrid",
      countryCode: "ES",
      region: "Comunidad de Madrid",
      coordinates: {
        latitude: 40.4165,
        longitude: -3.7026,
      },
      isFavorite: false,
    });
  });

  it("handles a missing region", () => {
    const city = mapLocationToCity({
      id: 1,
      name: "Localidad",
      latitude: 40,
      longitude: -3,
      country_code: "ES",
    });

    expect(city.region).toBeUndefined();
  });
});