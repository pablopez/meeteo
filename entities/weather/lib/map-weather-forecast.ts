import type { OpenMeteoForecastResponseDto } from "../api/open-meteo-forecast.types";
import { mapWmoWeather } from "./wmo-mapper";
import { createDailyForecast } from "../model/daily-forecast";
import {
  createWeatherForecast,
  type WeatherForecast,
} from "../model/weather-forecast";

const MAX_FORECAST_DAYS = 15;

function readNullableNumber(
  values: readonly (number | null)[],
  index: number,
): number | null {
  const value = values[index];

  if (value === null || value === undefined) {
    return null;
  }

  if (
    typeof value !== "number" ||
    !Number.isFinite(value)
  ) {
    throw new Error("Invalid weather forecast response");
  }

  return value;
}

function readTime(
  values: readonly (string | null)[],
  index: number,
): string | null {
  const value = values[index];

  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value !== "string") {
    throw new Error("Invalid weather forecast response");
  }

  const match = value.match(/T(\d{2}:\d{2})(?::\d{2})?$/);

  if (!match?.[1]) {
    throw new Error("Invalid weather forecast response");
  }

  return match[1];
}

function readCurrentTemperature(
  response: OpenMeteoForecastResponseDto,
): number | null {
  const temperature = response.current_weather?.temperature;

  if (temperature === null || temperature === undefined) {
    return null;
  }

  if (typeof temperature !== "number" || !Number.isFinite(temperature)) {
    throw new Error("Invalid weather forecast response");
  }

  return temperature;
}

export function mapWeatherForecast(
  response: OpenMeteoForecastResponseDto,
): WeatherForecast {
  const daily = response.daily;

  if (
    typeof response.timezone !== "string" ||
    !daily ||
    !Array.isArray(daily.time) ||
    !Array.isArray(daily.weather_code) ||
    !Array.isArray(daily.temperature_2m_max) ||
    !Array.isArray(daily.temperature_2m_min) ||
    !Array.isArray(daily.precipitation_sum) ||
    !Array.isArray(daily.precipitation_probability_max) ||
    !Array.isArray(daily.uv_index_max) ||
    !Array.isArray(daily.sunrise) ||
    !Array.isArray(daily.sunset)
  ) {
    throw new Error("Invalid weather forecast response");
  }

  const days = daily.time
    .slice(0, MAX_FORECAST_DAYS)
    .map((date, index) => {
      const weatherCode = readNullableNumber(
        daily.weather_code!,
        index,
      );
      const precipitation = mapWmoWeather(weatherCode);

      return createDailyForecast({
        date,
        minimumTemperature: readNullableNumber(
          daily.temperature_2m_min!,
          index,
        ),
        maximumTemperature: readNullableNumber(
          daily.temperature_2m_max!,
          index,
        ),
        precipitationProbability: readNullableNumber(
          daily.precipitation_probability_max!,
          index,
        ),
        precipitationAmount: readNullableNumber(
          daily.precipitation_sum!,
          index,
        ),
        precipitationType: precipitation.type,
        isThunderstorm: precipitation.isThunderstorm,
        weatherCode,
        uvIndex: readNullableNumber(
          daily.uv_index_max!,
          index,
        ),
        sunrise: readTime(daily.sunrise!, index),
        sunset: readTime(daily.sunset!, index),
      });
    });

  return createWeatherForecast({
    timezone: response.timezone,
    currentTemperature: readCurrentTemperature(response),
    days,
  });
}