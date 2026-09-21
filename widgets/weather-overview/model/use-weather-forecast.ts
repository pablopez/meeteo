import { useEffect, useState } from "react";

import type { Location } from "@/entities/location";
import {
  getWeatherForecast,
  type WeatherForecast,
} from "@/entities/weather";

type WeatherStatus =
  | "idle"
  | "loading"
  | "success"
  | "error";

type WeatherResult = {
  locationId: string;
  latitude: number;
  longitude: number;
  forecast: WeatherForecast | null;
  hasError: boolean;
};

export function useWeatherForecast(
  location: Location | null,
) {
  const [result, setResult] =
    useState<WeatherResult | null>(null);

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
      coordinates: {
        latitude,
        longitude,
      },
      signal: controller.signal,
    })
      .then((forecast) => {
        if (controller.signal.aborted) {
          return;
        }

        setResult({
          locationId,
          latitude,
          longitude,
          forecast,
          hasError: false,
        });
      })
      .catch(() => {
        if (controller.signal.aborted) {
          return;
        }

        setResult({
          locationId,
          latitude,
          longitude,
          forecast: null,
          hasError: true,
        });
      });

    return () => {
      controller.abort();
    };
  }, [locationId, latitude, longitude]);

  const isCurrentResult =
    result?.locationId === locationId &&
    result?.latitude === latitude &&
    result?.longitude === longitude;

  let status: WeatherStatus;

  if (location === null) {
    status = "idle";
  } else if (!isCurrentResult) {
    status = "loading";
  } else if (result?.hasError) {
    status = "error";
  } else {
    status = "success";
  }

  return {
    status,
    forecast:
      status === "success"
        ? result?.forecast ?? null
        : null,
  };
}