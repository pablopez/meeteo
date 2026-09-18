import { getMeteoconSrc } from "../lib/meteocon-src";

type MeteoconIconProps = {
  name: string;
  isDay?: boolean | number;
  alt?: string;
  className?: string;
  loading?: "lazy" | "eager";
};

export function MeteoconIcon({
  name,
  isDay = true,
  alt = "",
  className = "",
  loading = "lazy",
}: MeteoconIconProps) {
  const isNight = isDay === false || isDay === 0;

  return (
    <img
      src={getMeteoconSrc(name, isDay)}
      alt={alt}
      loading={loading}
      className={[className, isNight ? "invert" : ""]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
