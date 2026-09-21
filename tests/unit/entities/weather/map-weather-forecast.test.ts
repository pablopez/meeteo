import { mapWeatherForecast } from "@/entities/weather/lib/map-weather-forecast";

describe("mapWeatherForecast", () => {
  it("maps Open-Meteo daily arrays to the domain", () => {
    const forecast = mapWeatherForecast({
      timezone: "Europe/Madrid",
      daily: {
        time: ["2026-09-04", "2026-09-05"],
        weather_code: [1, 61],
        temperature_2m_max: [28, 24],
        temperature_2m_min: [16, 14],
        precipitation_sum: [0, 3.5],
        precipitation_probability_max: [10, 75],
        uv_index_max: [6.2, 5.8],
        sunrise: [
          "2026-09-04T07:42",
          "2026-09-05T07:43",
        ],
        sunset: [
          "2026-09-04T20:43",
          "2026-09-05T20:41",
        ],
      },
    });

    expect(forecast.timezone).toBe("Europe/Madrid");
    expect(forecast.currentTemperature).toBeNull();
    expect(forecast.days).toHaveLength(2);

    expect(forecast.days[0]).toEqual({
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
        probability: 10,
        amount: 0,
        unit: "millimeter",
        type: "none",
        isThunderstorm: false,
      },
      weatherCode: 1,
      uvIndex: 6.2,
      sunrise: "07:42",
      sunset: "20:43",
    });
  });

  it("preserves unavailable external values as null", () => {
  const forecast = mapWeatherForecast({
    timezone: "Europe/London",
    daily: {
      time: ["2026-09-04"],
      weather_code: [1],
      temperature_2m_max: [18],
      temperature_2m_min: [null],
      precipitation_sum: [0],
      precipitation_probability_max: [null],
      uv_index_max: [null],
      sunrise: [null],
      sunset: [null],
    },
  });

  expect(forecast.currentTemperature).toBeNull();

  expect(forecast.days[0]).toEqual({
    date: "2026-09-04",
    temperature: {
      minimum: null,
      maximum: {
        value: 18,
        unit: "celsius",
      },
    },
    precipitation: {
      probability: null,
      amount: 0,
      unit: "millimeter",
      type: "none",
      isThunderstorm: false,
    },
    weatherCode: 1,
    uvIndex: null,
    sunrise: null,
    sunset: null,
  });
});
});