import type { CSSProperties } from "react";

import type { PrecipitationType } from "../model/precipitation";

type WeatherEffectsProps = {
  precipitationType: PrecipitationType;
  isThunderstorm: boolean;
  weatherCode: number | null;
};

type WeatherParticleStyle = CSSProperties & {
  "--weather-animation-delay": string;
  "--weather-fall-duration": string;
  "--weather-fall-drift": string;
};

type WeatherCloudStyle = CSSProperties & {
  "--weather-animation-delay": string;
  "--weather-drift-duration": string;
};

const PARTICLES = Array.from({ length: 40 }, (_, index) => ({
  id: index,
  left: (index * 37 + 11) % 100,
  duration: 1.1 + ((index * 17) % 24) / 10,
  delay: -((index * 29) % 50) / 10,
  drift: ((index * 13) % 21) - 10,
}));

const CLOUDS = [
  { id: 0, top: 5, duration: 42, delay: -8, scale: 1 },
  { id: 1, top: 14, duration: 55, delay: -31, scale: 1.35 },
  { id: 2, top: 25, duration: 48, delay: -20, scale: 0.8 },
];

const CLOUDY_CODES = new Set([1, 2, 3, 45, 48]);

function getParticleClassName(type: PrecipitationType): string {
  if (type === "snow") {
    return "h-1.5 w-1.5 rounded-full bg-white/80 shadow-[0_0_4px_white]";
  }

  if (type === "drizzle") {
    return "h-2 w-px bg-blue-100/50";
  }

  return "h-4 w-0.5 bg-blue-200/60";
}

export function WeatherEffects({
  precipitationType,
  isThunderstorm,
  weatherCode,
}: WeatherEffectsProps) {
  const hasFallingParticles =
    precipitationType === "rain" ||
    precipitationType === "drizzle" ||
    precipitationType === "snow";
  const hasClouds =
    weatherCode !== null && CLOUDY_CODES.has(weatherCode);

  if (!hasFallingParticles && !hasClouds && !isThunderstorm) {
    return null;
  }

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
      data-testid="weather-effects"
    >
      {isThunderstorm && (
        <div
          className="weather-lightning absolute inset-0 bg-white"
          style={{
            animationDelay: `-${
              (((weatherCode ?? 0) * 17) % 60) / 10
            }s`,
          }}
        />
      )}

      {hasClouds &&
        CLOUDS.map((cloud) => (
          <svg
            key={cloud.id}
            viewBox="0 0 160 80"
            className="weather-cloud absolute left-0 w-40 fill-white/30 blur-[1px]"
            style={
              {
                top: `${cloud.top}%`,
                scale: cloud.scale,
                "--weather-animation-delay": `${cloud.delay}s`,
                "--weather-drift-duration": `${cloud.duration}s`,
              } as WeatherCloudStyle
            }
          >
            <path d="M42 65h76c20 0 28-25 11-36-8-5-17-5-25-1C98 11 77 4 62 16 51 7 32 13 29 28 7 29 5 65 42 65Z" />
          </svg>
        ))}

      {hasFallingParticles &&
        PARTICLES.map((particle) => (
          <div
            key={particle.id}
            className={`weather-particle absolute top-0 ${getParticleClassName(precipitationType)}`}
            style={
              {
                left: `${particle.left}%`,
                "--weather-animation-delay": `${particle.delay}s`,
                "--weather-fall-duration": `${
                  precipitationType === "snow"
                    ? particle.duration * 2.4
                    : particle.duration
                }s`,
                "--weather-fall-drift": `${particle.drift}vw`,
              } as WeatherParticleStyle
            }
          />
        ))}
    </div>
  );
}
