export type WeatherMeasurementUnit =
  | "celsius"
  | "millimeter"
  | "percent";

const UNIT_SUFFIXES: Record<
  WeatherMeasurementUnit,
  string
> = {
  celsius: " °C",
  millimeter: " mm",
  percent: "%",
};

export function formatWeatherMeasurement(
  value: number | null,
  unit: WeatherMeasurementUnit,
  locale: string,
  unavailable: string,
): string {
  if (value === null) {
    return unavailable;
  }

  const formattedValue = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 1,
  }).format(value);

  return `${formattedValue}${UNIT_SUFFIXES[unit]}`;
}