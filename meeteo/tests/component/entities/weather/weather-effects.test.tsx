import { render, screen } from "@testing-library/react";

import { WeatherEffects } from "@/entities/weather";

describe("WeatherEffects", () => {
  it("renders a transparent container for future effects", () => {
    const { container } = render(<WeatherEffects />);

    expect(screen.getByTestId("weather-effects")).toHaveClass(
      "pointer-events-none",
      "fixed",
      "inset-0",
      "-z-10",
    );
    expect(container.querySelectorAll("svg, canvas")).toHaveLength(0);
    expect(screen.getByTestId("weather-effects")).toBeEmptyDOMElement();
  });
});
