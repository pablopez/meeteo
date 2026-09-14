import { useState } from "react";

import {
  getCurrentLocation,
  type CurrentLocation,
} from "@/entities/location";

type LocateUserStatus =
  | "idle"
  | "loading"
  | "success"
  | "error";

type UseLocateUserOptions = {
  onLocationLocated: (
    location: CurrentLocation,
  ) => void;
};

export function useLocateUser({
  onLocationLocated,
}: UseLocateUserOptions) {
  const [status, setStatus] =
    useState<LocateUserStatus>("idle");

  async function locateUser() {
    setStatus("loading");

    try {
      const location = await getCurrentLocation();

      onLocationLocated(location);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return {
    status,
    locateUser,
  };
}