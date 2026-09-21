import { getFlatMeteoconName } from "../lib/wmo-mapper";
import { MeteoconIcon } from "./meteocon-icon";

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
    <MeteoconIcon
      name={iconName}
      isDay={isDay}
      alt="Weather icon"
      className={className}
    />
  );
}
