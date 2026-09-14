import {
  getFavoriteCitiesSnapshot,
  parseStoredFavoriteCities,
  saveFavoriteCities,
  subscribeToFavoriteCities,
} from "@/entities/favorite-cities/lib/favorite-cities-storage";

function validCity() {
  return {
    id: "madrid",
    name: "Madrid",
    countryCode: "ES",
    region: "Comunidad de Madrid",
    coordinates: { latitude: 40.4165, longitude: -3.7026 },
    isFavorite: true,
  };
}

describe("favorite-cities-storage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  describe("parseStoredFavoriteCities", () => {
    it("returns an empty list for null input", () => {
      const result = parseStoredFavoriteCities(null);

      expect(result).toEqual([]);
    });

    it("returns an empty list for invalid JSON", () => {
      const result = parseStoredFavoriteCities("not-json");

      expect(result).toEqual([]);
    });

    it("returns an empty list for non-array JSON", () => {
      const result = parseStoredFavoriteCities('{"foo":"bar"}');

      expect(result).toEqual([]);
    });

    it("parses valid cities", () => {
      const result = parseStoredFavoriteCities(
        JSON.stringify([validCity()]),
      );

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Madrid");
      expect(result[0].isFavorite).toBe(true);
    });

    it("filters out invalid entries", () => {
      const result = parseStoredFavoriteCities(
        JSON.stringify([validCity(), { invalid: true }]),
      );

      expect(result).toHaveLength(1);
    });
  });

  describe("saveFavoriteCities", () => {
    it("persists the favorites in localStorage", () => {
      const cities = [validCity()];

      saveFavoriteCities(cities);

      const stored = window.localStorage.getItem(
        "meeteo:favorite-cities",
      );

      expect(JSON.parse(stored!)).toEqual(cities);
    });
  });

  describe("getFavoriteCitiesSnapshot", () => {
    it("returns the stored value", () => {
      window.localStorage.setItem(
        "meeteo:favorite-cities",
        JSON.stringify([validCity()]),
      );

      const result = getFavoriteCitiesSnapshot();

      expect(JSON.parse(result!)).toEqual([validCity()]);
    });
  });

  describe("subscribeToFavoriteCities", () => {
    it("calls the callback on custom change event", () => {
      const callback = jest.fn();
      const unsubscribe = subscribeToFavoriteCities(callback);

      window.dispatchEvent(
        new Event("meeteo:favorite-cities-changed"),
      );

      expect(callback).toHaveBeenCalledTimes(1);

      unsubscribe();
    });

    it("calls the callback on storage event", () => {
      const callback = jest.fn();
      const unsubscribe = subscribeToFavoriteCities(callback);

      window.dispatchEvent(new Event("storage"));

      expect(callback).toHaveBeenCalledTimes(1);

      unsubscribe();
    });
  });
});
