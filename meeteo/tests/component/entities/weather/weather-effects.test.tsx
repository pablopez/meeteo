import { render, screen } from "@testing-library/react";

import { WeatherEffects } from "@/entities/weather";

describe("WeatherEffects", () => {
  it.each([true, false])(
    "renders a solid background when isDay is %s",
    (isDay) => {
      const { container } = render(
        <WeatherEffects isDay={isDay} />,
      );

      expect(screen.getByTestId("weather-effects")).toHaveClass(
        "fixed",
        "inset-0",
        "-z-10",
        "transition-colors",
        "duration-1000",
        "ease-in-out",
      );
      expect(
        screen.getByTestId("weather-effects"),
      ).toHaveClass(isDay ? "bg-sky-500" : "bg-[#0a0a0a]");
      expect(container.querySelectorAll("svg, canvas")).toHaveLength(0);
      expect(screen.getByTestId("weather-effects")).toBeEmptyDOMElement();
    },
  );
});
