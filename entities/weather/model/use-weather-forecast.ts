import { useEffect, useState } from "react";

import { getWeatherForecast } from "../api/get-weather-forecast";
import type { WeatherForecast } from "./weather-forecast";

type ForecastLocation = {
  id: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
};

type WeatherStatus = "idle" | "loading" | "success" | "error";

type WeatherResult = {
  locationId: string;
  latitude: number;
  longitude: number;
  forecast: WeatherForecast | null;
  hasError: boolean;
};

export function useWeatherForecast(location: ForecastLocation | null) {
  const [result, setResult] = useState<WeatherResult | null>(null);
  const locationId = location?.id;
  const latitude = location?.coordinates.latitude;
  const longitude = location?.coordinates.longitude;

  useEffect(() => {
    if (
      locationId === undefined ||
      latitude === undefined ||
      longitude === undefined
    ) {
      return;
    }

    const controller = new AbortController();

    void getWeatherForecast({
      coordinates: { latitude, longitude },
      signal: controller.signal,
    })
      .then((forecast) => {
        if (!controller.signal.aborted) {
          setResult({
            locationId,
            latitude,
            longitude,
            forecast,
            hasError: false,
          });
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setResult({
            locationId,
            latitude,
            longitude,
            forecast: null,
            hasError: true,
          });
        }
      });

    return () => controller.abort();
  }, [locationId, latitude, longitude]);

  const isCurrentResult =
    result?.locationId === locationId &&
    result?.latitude === latitude &&
    result?.longitude === longitude;
  const status: WeatherStatus =
    location === null
      ? "idle"
      : !isCurrentResult
        ? "loading"
        : result?.hasError
          ? "error"
          : "success";

  return {
    status,
    forecast: status === "success" ? result?.forecast ?? null : null,
  };
}
