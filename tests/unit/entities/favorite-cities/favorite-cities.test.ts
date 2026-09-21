import { createCity, type City } from "@/entities/city";
import {
  addFavoriteCity,
  createFavoriteCities,
  MAX_FAVORITE_CITIES,
  reindexFavoriteCity,
  removeFavoriteCity,
} from "@/entities/favorite-cities";

function makeCity(name: string): City {
  return createCity({
    id: name.toLowerCase(),
    name,
    countryCode: "ES",
    coordinates: {
      latitude: 40.4165,
      longitude: -3.7026,
    },
  });
}

describe("favorite-cities", () => {
  describe("createFavoriteCities", () => {
    it("creates an empty list", () => {
      const favorites = createFavoriteCities([]);

      expect(favorites).toEqual([]);
    });

    it("copies the given cities", () => {
      const city = makeCity("Madrid");
      const favorites = createFavoriteCities([city]);

      expect(favorites).toHaveLength(1);
      expect(favorites[0]).not.toBe(city);
      expect(favorites[0]).toEqual(city);
    });

    it("throws when exceeding the maximum", () => {
      const cities = Array.from(
        { length: MAX_FAVORITE_CITIES + 1 },
        (_, index) => makeCity(`City ${index}`),
      );

      expect(() =>
        createFavoriteCities(cities),
      ).toThrow();
    });
  });

  describe("addFavoriteCity", () => {
    it("adds a new city", () => {
      const favorites = createFavoriteCities([]);
      const city = makeCity("Madrid");

      const result = addFavoriteCity(favorites, city);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Madrid");
      expect(result[0].isFavorite).toBe(true);
    });

    it("does not duplicate an existing city", () => {
      const city = makeCity("Madrid");
      const favorites = createFavoriteCities([city]);

      const result = addFavoriteCity(favorites, city);

      expect(result).toHaveLength(1);
    });

    it("throws when adding beyond the maximum", () => {
      const cities = Array.from(
        { length: MAX_FAVORITE_CITIES },
        (_, index) => makeCity(`City ${index}`),
      );
      const favorites = createFavoriteCities(cities);

      expect(() =>
        addFavoriteCity(favorites, makeCity("New")),
      ).toThrow();
    });
  });

  describe("removeFavoriteCity", () => {
    it("removes an existing city", () => {
      const city = makeCity("Madrid");
      const favorites = createFavoriteCities([city]);

      const result = removeFavoriteCity(favorites, city);

      expect(result).toHaveLength(0);
    });

    it("returns the same list when city is not present", () => {
      const madrid = makeCity("Madrid");
      const barcelona = makeCity("Barcelona");
      const favorites = createFavoriteCities([madrid]);

      const result = removeFavoriteCity(favorites, barcelona);

      expect(result).toEqual(favorites);
    });
  });

  describe("reindexFavoriteCity", () => {
    it("moves a city to the target index", () => {
      const madrid = makeCity("Madrid");
      const barcelona = makeCity("Barcelona");
      const valencia = makeCity("Valencia");
      const favorites = createFavoriteCities([
        madrid,
        barcelona,
        valencia,
      ]);

      const result = reindexFavoriteCity(
        favorites,
        madrid.id,
        2,
      );

      expect(result.map((city) => city.name)).toEqual([
        "Barcelona",
        "Valencia",
        "Madrid",
      ]);
    });

    it("throws for an unknown city", () => {
      const favorites = createFavoriteCities([makeCity("Madrid")]);

      expect(() =>
        reindexFavoriteCity(favorites, "unknown", 0),
      ).toThrow("City not found in favorites");
    });

    it("throws for an invalid index", () => {
      const city = makeCity("Madrid");
      const favorites = createFavoriteCities([city]);

      expect(() =>
        reindexFavoriteCity(favorites, city.id, 5),
      ).toThrow("Invalid favorite city index");
    });
  });
});
