import type { OpenMeteoAirQualityResponseDto } from "@/entities/environment/api/open-meteo-air-quality.types";
import { mapOpenMeteoEnvironmentForecast } from "@/entities/environment/lib/map-open-meteo-environmental-conditions";

describe("mapOpenMeteoEnvironmentForecast", () => {
  it("groups multiple hours of the same day into one entry using daily maximum", () => {
    const response: OpenMeteoAirQualityResponseDto = {
      timezone: "Europe/Madrid",
      hourly: {
        time: [
          "2026-09-03T00:00",
          "2026-09-03T06:00",
          "2026-09-03T12:00",
          "2026-09-03T18:00",
        ],
        european_aqi: [20, 35, 50, 30],
        birch_pollen: [1, 5, 3, 2],
        grass_pollen: [null, null, 10, 8],
        alder_pollen: [null, null, null, null],
        mugwort_pollen: [null, null, null, null],
        olive_pollen: [0, 4, 12, 6],
        ragweed_pollen: [null, null, null, null],
      },
    };

    const forecast =
      mapOpenMeteoEnvironmentForecast(response);

    expect(forecast.timezone).toBe("Europe/Madrid");
    expect(forecast.days).toHaveLength(1);

    const day = forecast.days[0]!;
    expect(day.date).toBe("2026-09-03");
    expect(day.airQuality).toEqual({
      europeanIndex: 50,
      level: "moderate",
    });

    expect(day.allergyMeasurements).toEqual([
      {
        allergen: "birch",
        concentration: 5,
        unit: "grains/m³",
      },
      {
        allergen: "grass",
        concentration: 10,
        unit: "grains/m³",
      },
      {
        allergen: "olive",
        concentration: 12,
        unit: "grains/m³",
      },
    ]);
  });

  it("selects the maximum AQI across hours of each day", () => {
    const response: OpenMeteoAirQualityResponseDto = {
      timezone: "Europe/Madrid",
      hourly: {
        time: [
          "2026-09-03T06:00",
          "2026-09-03T12:00",
        ],
        european_aqi: [10, 80],
      },
    };

    const day =
      mapOpenMeteoEnvironmentForecast(response)
        .days[0]!;

    expect(day.airQuality!.europeanIndex).toBe(80);
    expect(day.airQuality!.level).toBe("poor");
  });

  it("selects the maximum pollen per allergen per day", () => {
    const response: OpenMeteoAirQualityResponseDto = {
      timezone: "Europe/Madrid",
      hourly: {
        time: [
          "2026-09-03T06:00",
          "2026-09-03T12:00",
        ],
        european_aqi: [20, 20],
        olive_pollen: [3, 15],
      },
    };

    const day =
      mapOpenMeteoEnvironmentForecast(response)
        .days[0]!;

    const olive = day.allergyMeasurements.find(
      (m) => m.allergen === "olive",
    );

    expect(olive!.concentration).toBe(15);
  });

  it("preserves zero as a valid value", () => {
    const response: OpenMeteoAirQualityResponseDto = {
      timezone: "Europe/Madrid",
      hourly: {
        time: ["2026-09-03T00:00"],
        european_aqi: [0],
        grass_pollen: [0],
      },
    };

    const day =
      mapOpenMeteoEnvironmentForecast(response)
        .days[0]!;

    expect(day.airQuality!.europeanIndex).toBe(0);

    const grass = day.allergyMeasurements.find(
      (m) => m.allergen === "grass",
    );
    expect(grass!.concentration).toBe(0);
  });

  it("sets airQuality to null when all AQI hours are null", () => {
    const response: OpenMeteoAirQualityResponseDto = {
      timezone: "Europe/Madrid",
      hourly: {
        time: [
          "2026-09-03T00:00",
          "2026-09-03T06:00",
        ],
        european_aqi: [null, null],
      },
    };

    const day =
      mapOpenMeteoEnvironmentForecast(response)
        .days[0]!;

    expect(day.airQuality).toBeNull();
  });

  it("omits allergens whose pollen values are all null", () => {
    const response: OpenMeteoAirQualityResponseDto = {
      timezone: "Europe/Madrid",
      hourly: {
        time: ["2026-09-03T00:00"],
        european_aqi: [20],
        birch_pollen: [null],
        olive_pollen: [5],
      },
    };

    const day =
      mapOpenMeteoEnvironmentForecast(response)
        .days[0]!;

    expect(
      day.allergyMeasurements.map(
        (m) => m.allergen,
      ),
    ).toEqual(["olive"]);
  });

  it("produces an empty allergyMeasurements when no pollen data exists", () => {
    const response: OpenMeteoAirQualityResponseDto = {
      timezone: "Europe/Madrid",
      hourly: {
        time: ["2026-09-03T00:00"],
        european_aqi: [20],
      },
    };

    const day =
      mapOpenMeteoEnvironmentForecast(response)
        .days[0]!;

    expect(day.allergyMeasurements).toEqual([]);
  });

  it("groups hours into separate days in chronological order", () => {
    const response: OpenMeteoAirQualityResponseDto = {
      timezone: "Europe/Madrid",
      hourly: {
        time: [
          "2026-09-04T00:00",
          "2026-09-03T00:00",
          "2026-09-04T12:00",
          "2026-09-03T12:00",
        ],
        european_aqi: [10, 20, 30, 40],
      },
    };

    const forecast =
      mapOpenMeteoEnvironmentForecast(response);

    expect(forecast.days).toHaveLength(2);
    expect(forecast.days[0]!.date).toBe("2026-09-03");
    expect(forecast.days[1]!.date).toBe("2026-09-04");

    expect(
      forecast.days[0]!.airQuality!.europeanIndex,
    ).toBe(40);
    expect(
      forecast.days[1]!.airQuality!.europeanIndex,
    ).toBe(30);
  });

  it("limits output to 7 days maximum", () => {
    const times: string[] = [];
    const aqis: number[] = [];

    for (let d = 1; d <= 10; d++) {
      const date = `2026-09-${String(d).padStart(2, "0")}`;
      times.push(`${date}T00:00`);
      aqis.push(d * 10);
    }

    const response: OpenMeteoAirQualityResponseDto = {
      timezone: "Europe/Madrid",
      hourly: {
        time: times,
        european_aqi: aqis,
      },
    };

    const forecast =
      mapOpenMeteoEnvironmentForecast(response);

    expect(forecast.days.length).toBeLessThanOrEqual(7);
  });

  it("rejects a response without hourly data", () => {
    expect(() =>
      mapOpenMeteoEnvironmentForecast({
        timezone: "Europe/Madrid",
      }),
    ).toThrow(
      "Invalid environment forecast response",
    );
  });

  it("rejects a response without timezone", () => {
    expect(() =>
      mapOpenMeteoEnvironmentForecast({
        hourly: { time: [] },
      }),
    ).toThrow(
      "Invalid environment forecast response",
    );
  });

  it("rejects negative hourly values", () => {
    expect(() =>
      mapOpenMeteoEnvironmentForecast({
        timezone: "Europe/Madrid",
        hourly: {
          time: ["2026-09-03T00:00"],
          european_aqi: [-5],
        },
      }),
    ).toThrow("Invalid hourly environmental value");
  });

  it("rejects NaN hourly values", () => {
    expect(() =>
      mapOpenMeteoEnvironmentForecast({
        timezone: "Europe/Madrid",
        hourly: {
          time: ["2026-09-03T00:00"],
          grass_pollen: [Number.NaN],
        },
      }),
    ).toThrow("Invalid hourly environmental value");
  });
});