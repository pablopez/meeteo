import { useState } from "react";

import {
  reverseGeocode,
  type City,
} from "@/entities/city";
import { getCurrentLocation } from "@/entities/location";

type LocateCityStatus =
  | "idle"
  | "loading"
  | "success"
  | "error";

type UseLocateCityOptions = {
  onCityLocated: (city: City) => void;
};

export function useLocateCity({
  onCityLocated,
}: UseLocateCityOptions) {
  const [status, setStatus] =
    useState<LocateCityStatus>("idle");

  async function locateCity() {
    setStatus("loading");

    try {
      const location = await getCurrentLocation();
      const city = await reverseGeocode(
        location.coordinates,
      );

      onCityLocated(city);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return {
    status,
    locateCity,
  };
}
