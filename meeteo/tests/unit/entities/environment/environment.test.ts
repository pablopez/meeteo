import {
  createAirQuality,
  createAllergyMeasurement,
  createDailyEnvironmentalConditions,
  createEnvironmentForecast,
  type AirQualityLevel,
} from "@/entities/environment";

describe("environment domain", () => {
  describe("createAirQuality", () => {
    it.each<[number, AirQualityLevel]>([
      [0, "good"],
      [20, "good"],
      [40, "fair"],
      [60, "moderate"],
      [80, "poor"],
      [100, "very-poor"],
      [101, "extremely-poor"],
    ])(
      "classifies ICA %s as %s",
      (index, expectedLevel) => {
        expect(
          createAirQuality(index),
        ).toEqual({
          europeanIndex: index,
          level: expectedLevel,
        });
      },
    );

    it.each([-1, Number.NaN, Number.POSITIVE_INFINITY])(
      "rejects invalid ICA %s",
      (index) => {
        expect(() =>
          createAirQuality(index),
        ).toThrow(
          "Invalid European air quality index",
        );
      },
    );
  });

  describe("createAllergyMeasurement", () => {
    it("creates a pollen measurement", () => {
      expect(
        createAllergyMeasurement("olive", 12.5),
      ).toEqual({
        allergen: "olive",
        concentration: 12.5,
        unit: "grains/m³",
      });
    });

    it("accepts zero concentration as valid", () => {
      expect(
        createAllergyMeasurement("grass", 0),
      ).toEqual({
        allergen: "grass",
        concentration: 0,
        unit: "grains/m³",
      });
    });

    it("rejects a negative concentration", () => {
      expect(() =>
        createAllergyMeasurement("grass", -1),
      ).toThrow(
        "Invalid pollen concentration",
      );
    });

    it.each([Number.NaN, Number.POSITIVE_INFINITY])(
      "rejects non-finite concentration %s",
      (value) => {
        expect(() =>
          createAllergyMeasurement("birch", value),
        ).toThrow(
          "Invalid pollen concentration",
        );
      },
    );
  });

  describe("createDailyEnvironmentalConditions", () => {
    it("creates daily conditions with air quality and allergies", () => {
      const airQuality = createAirQuality(35);
      const olivePollen =
        createAllergyMeasurement("olive", 12.5);

      const conditions =
        createDailyEnvironmentalConditions({
          date: "2026-09-03",
          airQuality,
          allergyMeasurements: [olivePollen],
        });

      expect(conditions).toEqual({
        date: "2026-09-03",
        airQuality,
        allergyMeasurements: [olivePollen],
      });
    });

    it("accepts null airQuality for unavailable AQI", () => {
      const conditions =
        createDailyEnvironmentalConditions({
          date: "2026-09-03",
          airQuality: null,
          allergyMeasurements: [],
        });

      expect(conditions.airQuality).toBeNull();
    });

    it("accepts empty allergyMeasurements for no pollen data", () => {
      const conditions =
        createDailyEnvironmentalConditions({
          date: "2026-09-03",
          airQuality: createAirQuality(20),
          allergyMeasurements: [],
        });

      expect(
        conditions.allergyMeasurements,
      ).toEqual([]);
    });

    it("makes a defensive copy of allergyMeasurements", () => {
      const measurements = [
        createAllergyMeasurement("olive", 10),
      ];

      const conditions =
        createDailyEnvironmentalConditions({
          date: "2026-09-03",
          airQuality: null,
          allergyMeasurements: measurements,
        });

      expect(
        conditions.allergyMeasurements,
      ).not.toBe(measurements);

      expect(
        conditions.allergyMeasurements,
      ).toEqual(measurements);
    });

    it("rejects an invalid date format", () => {
      expect(() =>
        createDailyEnvironmentalConditions({
          date: "invalid-date",
          airQuality: null,
          allergyMeasurements: [],
        }),
      ).toThrow(
        "Invalid environmental conditions date",
      );
    });

    it("rejects a non-ISO date", () => {
      expect(() =>
        createDailyEnvironmentalConditions({
          date: "2026-09-03T12:00",
          airQuality: null,
          allergyMeasurements: [],
        }),
      ).toThrow(
        "Invalid environmental conditions date",
      );
    });
  });

  describe("createEnvironmentForecast", () => {
    it("creates a forecast with days", () => {
      const day = createDailyEnvironmentalConditions({
        date: "2026-09-03",
        airQuality: createAirQuality(25),
        allergyMeasurements: [],
      });

      const forecast = createEnvironmentForecast({
        timezone: "Europe/Madrid",
        days: [day],
      });

      expect(forecast).toEqual({
        timezone: "Europe/Madrid",
        days: [day],
      });
    });

    it("accepts an empty days array", () => {
      const forecast = createEnvironmentForecast({
        timezone: "Europe/Madrid",
        days: [],
      });

      expect(forecast.days).toEqual([]);
    });

    it("rejects an empty timezone", () => {
      expect(() =>
        createEnvironmentForecast({
          timezone: "  ",
          days: [],
        }),
      ).toThrow("Timezone cannot be empty");
    });

    it("rejects more than 7 days", () => {
      const days = Array.from(
        { length: 8 },
        (_, i) =>
          createDailyEnvironmentalConditions({
            date: `2026-09-0${i + 1}`,
            airQuality: null,
            allergyMeasurements: [],
          }),
      );

      expect(() =>
        createEnvironmentForecast({
          timezone: "Europe/Madrid",
          days,
        }),
      ).toThrow(
        "Environment forecast cannot exceed 7 days",
      );
    });

    it("makes a defensive copy of days", () => {
      const days = [
        createDailyEnvironmentalConditions({
          date: "2026-09-03",
          airQuality: null,
          allergyMeasurements: [],
        }),
      ];

      const forecast = createEnvironmentForecast({
        timezone: "Europe/Madrid",
        days,
      });

      expect(forecast.days).not.toBe(days);
      expect(forecast.days).toEqual(days);
    });
  });
});