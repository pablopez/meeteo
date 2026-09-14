export type SkyState =
  | "deep-night"
  | "pre-dawn"
  | "dawn"
  | "day"
  | "dusk"
  | "post-dusk";

const MINUTE_IN_MILLISECONDS = 60000;
const NINETY_MINUTES = 90 * MINUTE_IN_MILLISECONDS;
const THIRTY_MINUTES = 30 * MINUTE_IN_MILLISECONDS;

export function getSkyState(
  currentTime: Date,
  sunriseIso: string,
  sunsetIso: string,
): SkyState {
  const now = currentTime.getTime();
  const sunrise = new Date(sunriseIso).getTime();
  const sunset = new Date(sunsetIso).getTime();

  if (
    !Number.isFinite(now) ||
    !Number.isFinite(sunrise) ||
    !Number.isFinite(sunset) ||
    sunrise >= sunset
  ) {
    throw new Error("Invalid sky state date");
  }

  if (now < sunrise - NINETY_MINUTES) {
    return "deep-night";
  }

  if (now < sunrise - THIRTY_MINUTES) {
    return "pre-dawn";
  }

  if (now < sunrise + THIRTY_MINUTES) {
    return "dawn";
  }

  if (now < sunset - THIRTY_MINUTES) {
    return "day";
  }

  if (now < sunset + THIRTY_MINUTES) {
    return "dusk";
  }

  if (now < sunset + NINETY_MINUTES) {
    return "post-dusk";
  }

  return "deep-night";
}
