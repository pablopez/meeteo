import {
  createDailyForecast,
  createWeatherForecast,
} from "@/entities/weather";

describe("createWeatherForecast", () => {
  it("creates a forecast containing daily predictions", () => {
    const day = createDailyForecast({
      date: "2026-09-04",
      minimumTemperature: 16,
      maximumTemperature: 28,
      precipitationProbability: 35,
      precipitationAmount: 1.5,
      precipitationType: "rain",
      isThunderstorm: false,
      weatherCode: 61,
      uvIndex: 6.2,
      sunrise: "07:42",
      sunset: "20:43",
    });

    const forecast = createWeatherForecast({
      timezone: "Europe/Madrid",
      days: [day],
    });

    expect(forecast.timezone).toBe("Europe/Madrid");
    expect(forecast.days).toHaveLength(1);
  });

  it("rejects an empty forecast", () => {
    expect(() =>
      createWeatherForecast({
        timezone: "Europe/Madrid",
        days: [],
      }),
    ).toThrow(
      "Weather forecast must contain between 1 and 15 days",
    );
  });
});