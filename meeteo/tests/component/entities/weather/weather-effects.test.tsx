import { render, screen } from "@testing-library/react";

import { WeatherEffects } from "@/entities/weather";

describe("WeatherEffects", () => {
  it("renders fewer than 50 rain particles", () => {
    const { container } = render(
      <WeatherEffects
        precipitationType="rain"
        isThunderstorm={false}
        weatherCode={61}
      />,
    );

    const particles = container.querySelectorAll(
      ".weather-particle",
    );

    expect(particles).toHaveLength(40);
    expect(particles.length).toBeLessThan(50);
    expect(screen.getByTestId("weather-effects")).toHaveClass(
      "pointer-events-none",
      "fixed",
    );
  });

  it("renders snow particles, clouds and lightning conditionally", () => {
    const { container, rerender } = render(
      <WeatherEffects
        precipitationType="snow"
        isThunderstorm={false}
        weatherCode={3}
      />,
    );

    expect(container.querySelectorAll(".weather-cloud")).toHaveLength(3);
    expect(container.querySelectorAll(".weather-particle")).toHaveLength(40);

    rerender(
      <WeatherEffects
        precipitationType="rain"
        isThunderstorm
        weatherCode={95}
      />,
    );

    expect(container.querySelector(".weather-lightning")).toBeInTheDocument();
    expect(container.querySelectorAll(".weather-cloud")).toHaveLength(0);
  });

  it("renders nothing for clear weather", () => {
    const { container } = render(
      <WeatherEffects
        precipitationType="none"
        isThunderstorm={false}
        weatherCode={0}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
