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

  it("maps rain to rain", () => {
    expect(getFlatMeteoconName(61, true)).toBe("rain");
  });

  it("maps thunderstorms with hail to day and night variants", () => {
    expect(getFlatMeteoconName(96, true)).toBe(
      "thunderstorms-hail-day",
    );
    expect(getFlatMeteoconName(99, false)).toBe(
      "thunderstorms-hail-night",
    );
  });

  it("falls back to not-available for unknown codes", () => {
    expect(getFlatMeteoconName(9999, true)).toBe(
      "not-available",
    );
  });
});
