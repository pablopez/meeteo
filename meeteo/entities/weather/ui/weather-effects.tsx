import type { SkyState } from "../lib/get-sky-state";

type WeatherEffectsProps = {
  skyState: SkyState;
};

export function WeatherEffects({ skyState }: WeatherEffectsProps) {
  return (
    <div
      className="fixed inset-0 -z-10 bg-[var(--color-solar-bg)] transition-colors duration-[2000ms] ease-in-out"
      aria-hidden="true"
      data-testid="weather-effects"
      data-sky-state={skyState}
    />
  );
}
