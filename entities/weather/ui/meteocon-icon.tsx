import Image from "next/image";

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
    <Image
      src={getMeteoconSrc(name, isDay)}
      alt={alt}
      width={80}
      height={80}
      loading={loading}
      className={[className, isNight ? "invert" : ""]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
