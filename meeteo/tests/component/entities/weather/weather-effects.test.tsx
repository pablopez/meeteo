import { render, screen } from "@testing-library/react";

import { WeatherEffects } from "@/entities/weather";

describe("WeatherEffects", () => {
  it.each([
    "deep-night",
    "pre-dawn",
    "dawn",
    "day",
    "dusk",
    "post-dusk",
  ] as const)("renders a solid background for the %s solar state", (skyState) => {
    const { container } = render(
      <WeatherEffects skyState={skyState} />,
    );

    expect(screen.getByTestId("weather-effects")).toHaveClass(
      "fixed",
      "inset-0",
      "-z-10",
      "bg-[var(--color-solar-bg)]",
      "transition-colors",
      "duration-[2000ms]",
      "ease-in-out",
    );
    expect(screen.getByTestId("weather-effects")).toHaveAttribute(
      "data-sky-state",
      skyState,
    );
    expect(container.querySelectorAll("svg, canvas")).toHaveLength(0);
    expect(screen.getByTestId("weather-effects")).toBeEmptyDOMElement();
  });
});
