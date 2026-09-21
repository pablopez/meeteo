import { getUvMeteoconName, getUvRisk } from "@/entities/weather";
import {
  getFlatMeteoconName,
  mapWmoWeather,
} from "@/entities/weather/lib/wmo-mapper";

describe("mapWmoWeather", () => {
  it.each([71, 73, 75, 77, 85, 86])(
    "maps WMO code %i to snow",
    (weatherCode) => {
      expect(mapWmoWeather(weatherCode)).toEqual({
        type: "snow",
        isThunderstorm: false,
      });
    },
  );

  it.each([61, 63, 65, 80, 81, 82])(
    "maps WMO code %i to rain",
    (weatherCode) => {
      expect(mapWmoWeather(weatherCode)).toEqual({
        type: "rain",
        isThunderstorm: false,
      });
    },
  );

  it.each([95, 96, 99])(
    "maps WMO code %i to a rain thunderstorm",
    (weatherCode) => {
      expect(mapWmoWeather(weatherCode)).toEqual({
        type: "rain",
        isThunderstorm: true,
      });
    },
  );

  it.each([51, 53, 55, 56, 57])(
    "maps WMO code %i to drizzle",
    (weatherCode) => {
      expect(mapWmoWeather(weatherCode)).toEqual({
        type: "drizzle",
        isThunderstorm: false,
      });
    },
  );

  it.each([0, 1, 2, 3, 45, 48, null])(
    "maps WMO code %s to no precipitation",
    (weatherCode) => {
      expect(mapWmoWeather(weatherCode)).toEqual({
        type: "none",
        isThunderstorm: false,
      });
    },
  );
});

describe("getFlatMeteoconName", () => {
  it("maps clear weather to clear-day and clear-night", () => {
    expect(getFlatMeteoconName(0, true)).toBe("clear-day");
    expect(getFlatMeteoconName(0, false)).toBe("clear-night");
  });

  it.each([
    [3, "overcast-day", "overcast-night"],
    [51, "overcast-day-drizzle", "overcast-night-drizzle"],
    [56, "overcast-day-sleet", "overcast-night-sleet"],
    [61, "overcast-day-rain", "overcast-night-rain"],
    [71, "overcast-day-snow", "overcast-night-snow"],
  ] as const)(
    "maps WMO code %s to day and night variants",
    (weatherCode, dayIcon, nightIcon) => {
      expect(getFlatMeteoconName(weatherCode, 1)).toBe(dayIcon);
      expect(getFlatMeteoconName(weatherCode, 0)).toBe(nightIcon);
    },
  );

  it("maps thunderstorms with hail to day and night variants", () => {
    expect(getFlatMeteoconName(96, true)).toBe(
      "thunderstorms-day-hail",
    );
    expect(getFlatMeteoconName(99, false)).toBe(
      "thunderstorms-night-hail",
    );
  });

  it("falls back to not-available for unknown codes", () => {
    expect(getFlatMeteoconName(9999, true)).toBe(
      "not-available",
    );
  });
});

describe("UV index presentation", () => {
  it.each([
    [0, "uv-index-1", "low"],
    [3, "uv-index-3", "moderate"],
    [6.2, "uv-index-6", "high"],
    [8, "uv-index-8", "very-high"],
    [11, "uv-index-11", "extreme"],
    [12, "uv-index-11-plus", "extreme"],
  ] as const)("maps UV %s to its icon and risk", (value, icon, risk) => {
    expect(getUvMeteoconName(value)).toBe(icon);
    expect(getUvRisk(value)).toBe(risk);
  });

  it("uses the generic UV icon when data is unavailable", () => {
    expect(getUvMeteoconName(null)).toBe("uv-index");
  });
});
