import { getFlatMeteoconName } from "../lib/wmo-mapper";

type WeatherFlatIconProps = {
  wmoCode: number | null;
  isDay?: number | boolean;
  className?: string;
};

export function WeatherFlatIcon({
  wmoCode,
  isDay = true,
  className,
}: WeatherFlatIconProps) {
  const iconName = getFlatMeteoconName(wmoCode, isDay);

  return (
    <img
      src={`/meteocons/flat/${iconName}.svg`}
      alt="Weather icon"
      loading="lazy"
      className={className}
    />
  );
}
