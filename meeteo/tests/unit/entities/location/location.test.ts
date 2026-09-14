import {
  createCoordinates,
  createCurrentLocation,
} from "@/entities/location";

describe("location model", () => {
  describe("createCoordinates", () => {
    it("creates valid coordinates", () => {
      const coordinates = createCoordinates({
        latitude: 40.4168,
        longitude: -3.7038,
      });

      expect(coordinates).toEqual({
        latitude: 40.4168,
        longitude: -3.7038,
      });
    });

    it("rejects an invalid latitude", () => {
      expect(() =>
        createCoordinates({
          latitude: 91,
          longitude: -3.7038,
        }),
      ).toThrow("Invalid latitude");
    });

    it("rejects an invalid longitude", () => {
      expect(() =>
        createCoordinates({
          latitude: 40.4168,
          longitude: 181,
        }),
      ).toThrow("Invalid longitude");
    });
  });

  describe("createCurrentLocation", () => {
    it("creates the current browser location", () => {
      const location = createCurrentLocation({
        latitude: 40.4168,
        longitude: -3.7038,
      });

      expect(location).toEqual({
        id: "current-location",
        coordinates: {
          latitude: 40.4168,
          longitude: -3.7038,
        },
      });
    });
  });
});