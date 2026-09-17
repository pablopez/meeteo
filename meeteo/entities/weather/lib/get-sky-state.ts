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

function getZonedTimestamp(currentTime: Date, timezone: string): number {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(currentTime);
  const readPart = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value);

  return Date.UTC(
    readPart("year"),
    readPart("month") - 1,
    readPart("day"),
    readPart("hour"),
    readPart("minute"),
    readPart("second"),
  );
}

export function getSkyState(
  currentTime: Date,
  timezone: string,
  sunriseIso: string,
  sunsetIso: string,
): SkyState {
  let now: number;

  try {
    now = getZonedTimestamp(currentTime, timezone);
  } catch {
    throw new Error("Invalid sky state date");
  }

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
