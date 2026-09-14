import { createDailyForecast } from "@/entities/weather";

describe("createDailyForecast", () => {
  const validForecast = {
    date: "2026-09-04",
    minimumTemperature: 16,
    maximumTemperature: 28,
    precipitationProbability: 35,
    precipitationAmount: 1.5,
    precipitationType: "rain" as const,
    isThunderstorm: false,
    weatherCode: 61,
    uvIndex: 6.2,
    sunrise: "07:42",
    sunset: "20:43",
  };

  it("creates a valid daily forecast", () => {
    const forecast = createDailyForecast(validForecast);

    expect(forecast).toEqual({
      date: "2026-09-04",
      temperature: {
        minimum: {
          value: 16,
          unit: "celsius",
        },
        maximum: {
          value: 28,
          unit: "celsius",
        },
      },
      precipitation: {
        probability: 35,
        amount: 1.5,
        unit: "millimeter",
        type: "rain",
        isThunderstorm: false,
      },
      weatherCode: 61,
      uvIndex: 6.2,
      sunrise: "07:42",
      sunset: "20:43",
    });
  });

  it("rejects an invalid temperature range", () => {
    expect(() =>
      createDailyForecast({
        ...validForecast,
        minimumTemperature: 30,
        maximumTemperature: 20,
      }),
    ).toThrow(
      "Minimum temperature cannot exceed maximum temperature",
    );
  });

  it("rejects an invalid precipitation probability", () => {
    expect(() =>
      createDailyForecast({
        ...validForecast,
        precipitationProbability: 120,
      }),
    ).toThrow("Invalid precipitation probability");
  });

  it("rejects an invalid date", () => {
    expect(() =>
      createDailyForecast({
        ...validForecast,
        date: "2026-02-30",
      }),
    ).toThrow("Invalid forecast date");
  });
});