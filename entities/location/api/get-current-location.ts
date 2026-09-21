import {
  createCurrentLocation,
  type CurrentLocation,
} from "../model/location";

const GEOLOCATION_OPTIONS: PositionOptions = {
  enableHighAccuracy: false,
  timeout: 10_000,
  maximumAge: 300_000,
};

export function getCurrentLocation(): Promise<CurrentLocation> {
  if (
    typeof navigator === "undefined" ||
    !navigator.geolocation
  ) {
    return Promise.reject(
      new Error("Geolocation is not supported"),
    );
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        try {
          const location = createCurrentLocation({
            latitude: coords.latitude,
            longitude: coords.longitude,
          });

          resolve(location);
        } catch (error) {
          reject(error);
        }
      },
      () => {
        reject(
          new Error("Unable to get current location"),
        );
      },
      GEOLOCATION_OPTIONS,
    );
  });
}