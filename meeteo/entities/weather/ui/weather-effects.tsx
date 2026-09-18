type WeatherEffectsProps = {
  isDay: boolean;
};

export function WeatherEffects({ isDay }: WeatherEffectsProps) {
  return (
    <div
      className={`fixed inset-0 -z-10 transition-colors duration-1000 ease-in-out ${
        isDay ? "bg-sky-500" : "bg-[#0a0a0a]"
      }`}
      aria-hidden="true"
      data-testid="weather-effects"
    />
  );
}
