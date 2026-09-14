import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  createAirQuality,
  createAllergyMeasurement,
  createDailyEnvironmentalConditions,
} from "@/entities/environment";
import { createDailyForecast } from "@/entities/weather";
import { ForecastCarousel } from "@/features/browse-forecast-days";

describe("ForecastCarousel", () => {
  const weatherDay1 = createDailyForecast({
    date: "2026-09-04",
    minimumTemperature: 16,
    maximumTemperature: 28,
    precipitationProbability: 10,
    precipitationAmount: 0,
    precipitationType: "none",
    isThunderstorm: false,
    weatherCode: 1,
    uvIndex: 6.2,
    sunrise: "07:42",
    sunset: "20:43",
  });

  const weatherDay2 = createDailyForecast({
    date: "2026-09-05",
    minimumTemperature: 14,
    maximumTemperature: 24,
    precipitationProbability: 75,
    precipitationAmount: 3.5,
    precipitationType: "rain",
    isThunderstorm: false,
    weatherCode: 61,
    uvIndex: 5.8,
    sunrise: "07:43",
    sunset: "20:41",
  });

  const envDay1 = createDailyEnvironmentalConditions({
    date: "2026-09-04",
    airQuality: createAirQuality(35),
    allergyMeasurements: [
      createAllergyMeasurement("olive", 12),
    ],
  });

  const days = [
    { weather: weatherDay1, environment: envDay1 },
    { weather: weatherDay2, environment: null },
  ];

  it("navigates between forecast days", async () => {
    const user = userEvent.setup();

    render(<ForecastCarousel days={days} />);

    const previousButton = screen.getByRole("button", {
      name: "Previous day",
    });

    const nextButton = screen.getByRole("button", {
      name: "Next day",
    });

    expect(previousButton).toBeDisabled();
    expect(
      screen.getByRole("heading", {
        name: "Friday, September 4",
      }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
    expect(screen.getByText("Day 1 of 2")).toBeInTheDocument();
    expect(screen.getByText("16 °C")).toBeInTheDocument();
    expect(screen.getByText("28 °C")).toBeInTheDocument();

    await user.click(nextButton);

    expect(screen.getByText("Day 2 of 2")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Saturday, September 5",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("14 °C")).toBeInTheDocument();
    expect(screen.getByText("24 °C")).toBeInTheDocument();
    expect(nextButton).toBeDisabled();

    await user.click(previousButton);

    expect(screen.getByText("Day 1 of 2")).toBeInTheDocument();
  });

  it("shows AQI and pollen when environment data is available", () => {
    render(<ForecastCarousel days={days} />);

    expect(screen.getByText("35")).toBeInTheDocument();
    expect(screen.getByText("Fair")).toBeInTheDocument();
    expect(screen.getByText("Olive")).toBeInTheDocument();
    expect(screen.getByText("12 grains/m³")).toBeInTheDocument();
  });

  it("shows unavailable when environment data is null", async () => {
    const user = userEvent.setup();

    render(<ForecastCarousel days={days} />);

    await user.click(
      screen.getByRole("button", { name: "Next day" }),
    );

    expect(
      screen.getAllByText("N/A").length,
    ).toBeGreaterThanOrEqual(1);
  });
});