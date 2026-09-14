export const forecastViews = [
  "carousel",
  "table",
] as const;

export type ForecastView =
  (typeof forecastViews)[number];