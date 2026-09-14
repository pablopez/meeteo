import { render, screen } from "@testing-library/react";

import {
  PrecipitationCard,
  SunTimesCard,
  TemperatureCard,
  UvIndexCard,
} from "@/entities/weather";

describe("weather cards", () => {
  it("renders temperature values and accepts a class name", () => {
    render(
      <dl>
        <TemperatureCard
          min={16}
          max={28}
          className="custom-class"
        />
      </dl>,
    );

    expect(screen.getByText("16 °C")).toBeInTheDocument();
    expect(screen.getByText("28 °C")).toBeInTheDocument();
    expect(
      screen.getByText("Minimum").parentElement?.parentElement,
    ).toHaveClass(
      "custom-class",
      "bg-surface/60",
      "border-border",
      "backdrop-blur-md",
      "duration-700",
    );
  });

  it("renders precipitation amount, probability and type", () => {
    render(
      <dl>
        <PrecipitationCard
          probability={75}
          amount={3.5}
          type="rain"
        />
      </dl>,
    );

    expect(screen.getByText("3.5 mm")).toBeInTheDocument();
    expect(screen.getByText("Rain")).toBeInTheDocument();
    expect(screen.getByText("75%")).toBeInTheDocument();
  });

  it("renders the UV index", () => {
    render(
      <dl>
        <UvIndexCard value={6.2} />
      </dl>,
    );

    expect(screen.getByText("UV index")).toBeInTheDocument();
    expect(screen.getByText("6.2")).toBeInTheDocument();
  });

  it("renders sunrise and sunset", () => {
    render(
      <dl>
        <SunTimesCard sunrise="07:42" sunset="20:43" />
      </dl>,
    );

    expect(screen.getByText("07:42")).toBeInTheDocument();
    expect(screen.getByText("20:43")).toBeInTheDocument();
  });
});
