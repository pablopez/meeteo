import {
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  getSkyState,
  getWeatherForecast,
  type WeatherForecast,
} from "@/entities/weather";
import {
  getEnvironmentForecast,
  type EnvironmentForecast,
} from "@/entities/environment";
import type { City } from "@/entities/city";
import { WeatherOverview } from "@/widgets/weather-overview";

jest.mock("@/entities/weather", () => ({
  ...jest.requireActual("@/entities/weather"),
  getSkyState: jest.fn(),
  getWeatherForecast: jest.fn(),
}));

jest.mock("@/entities/environment", () => ({
  ...jest.requireActual("@/entities/environment"),
  getEnvironmentForecast: jest.fn(),
}));

const mockedGetSkyState = jest.mocked(getSkyState);
const mockedGetWeatherForecast =
  jest.mocked(getWeatherForecast);

const mockedGetEnvironmentForecast =
  jest.mocked(getEnvironmentForecast);

describe("WeatherOverview", () => {
  const madrid: City = {
    id: "3117735",
    name: "Madrid",
    countryCode: "ES",
    region: "Comunidad de Madrid",
    coordinates: {
      latitude: 40.4165,
      longitude: -3.7026,
    },
    isFavorite: false,
  };

  const forecast: WeatherForecast = {
    timezone: "Europe/Madrid",
    days: [
      {
        date: "2026-09-04",
        temperature: {
          minimum: {
            value: 16,
            unit: "celsius",
          },
          maximum: {
            value: 28,
            unit: "celsius",
          },
        },
        precipitation: {
          probability: 35,
          amount: 1.5,
          unit: "millimeter",
          type: "rain",
          isThunderstorm: false,
        },
        weatherCode: 61,
        uvIndex: 6.2,
        sunrise: "07:42",
        sunset: "20:43",
      },
      {
        date: "2026-09-05",
        temperature: {
          minimum: {
            value: 14,
            unit: "celsius",
          },
          maximum: {
            value: 24,
            unit: "celsius",
          },
        },
        precipitation: {
          probability: 75,
          amount: 3.5,
          unit: "millimeter",
          type: "rain",
          isThunderstorm: true,
        },
        weatherCode: 95,
        uvIndex: 5.8,
        sunrise: "07:43",
        sunset: "20:41",
      },
    ],
  };

  const environmentForecast: EnvironmentForecast = {
    timezone: "Europe/Madrid",
    days: [
      {
        date: "2026-09-04",
        airQuality: {
          europeanIndex: 35,
          level: "fair",
        },
        allergyMeasurements: [
          {
            allergen: "olive",
            concentration: 12,
            unit: "grains/m³",
          },
        ],
      },
    ],
  };

  beforeEach(() => {
    mockedGetSkyState.mockReset();
    mockedGetSkyState.mockReturnValue("day");
    mockedGetWeatherForecast.mockReset();
    mockedGetEnvironmentForecast.mockReset();
  });

  it("shows the first forecast day", async () => {
    mockedGetWeatherForecast.mockResolvedValue(forecast);
    mockedGetEnvironmentForecast.mockResolvedValue(
      environmentForecast,
    );

    render(
      <WeatherOverview
        location={madrid}
      />,
    );

    expect(
      screen.getByText("Loading weather forecast..."),
    ).toBeInTheDocument();

    const heading = await screen.findByRole("heading", {
      name: "Weather forecast",
    });

    expect(heading).toBeInTheDocument();
    expect(heading.closest("section")).toHaveAttribute(
      "data-sky-state",
      "day",
    );
    expect(mockedGetSkyState).toHaveBeenCalledWith(
      expect.any(Date),
      "2026-09-04T07:42:00Z",
      "2026-09-04T20:43:00Z",
    );
    expect(document.documentElement).toHaveAttribute(
      "data-sky-state",
      "day",
    );
    expect(document.documentElement).toHaveAttribute(
      "data-weather-state",
      "rain",
    );
    expect(screen.getByTestId("weather-effects")).toBeInTheDocument();

    expect(screen.getByText("16 °C")).toBeInTheDocument();
    expect(screen.getByText("28 °C")).toBeInTheDocument();
    expect(screen.getByText("35%")).toBeInTheDocument();
    expect(screen.getByText("1.5 mm")).toBeInTheDocument();
  });

  it("applies the solar state returned for the selected city", async () => {
    mockedGetSkyState.mockReturnValue("dusk");
    mockedGetWeatherForecast.mockResolvedValue(forecast);
    mockedGetEnvironmentForecast.mockResolvedValue(
      environmentForecast,
    );

    render(<WeatherOverview location={madrid} />);

    const heading = await screen.findByRole("heading", {
      name: "Weather forecast",
    });

    expect(heading.closest("section")).toHaveAttribute(
      "data-sky-state",
      "dusk",
    );
  });

  it("removes atmospheric effects when the selected city is clear", async () => {
    mockedGetWeatherForecast.mockResolvedValue(forecast);
    mockedGetEnvironmentForecast.mockResolvedValue(
      environmentForecast,
    );

    const { rerender } = render(
      <WeatherOverview location={madrid} />,
    );

    expect(
      await screen.findByTestId("weather-effects"),
    ).toBeInTheDocument();

    const barcelona: City = {
      ...madrid,
      id: "barcelona",
      name: "Barcelona",
      coordinates: {
        latitude: 41.3874,
        longitude: 2.1686,
      },
    };
    const sunnyForecast: WeatherForecast = {
      ...forecast,
      days: [
        {
          ...forecast.days[0]!,
          precipitation: {
            ...forecast.days[0]!.precipitation,
            type: "none",
          },
          weatherCode: 0,
        },
      ],
    };

    mockedGetWeatherForecast.mockResolvedValue(sunnyForecast);
    rerender(<WeatherOverview location={barcelona} />);

    await waitFor(() => {
      expect(
        screen.queryByTestId("weather-effects"),
      ).not.toBeInTheDocument();
      expect(document.documentElement).toHaveAttribute(
        "data-weather-state",
        "clear",
      );
    });
  });

  it("shows an error when the weather request fails", async () => {
    mockedGetWeatherForecast.mockRejectedValue(
      new Error("Network error"),
    );
    mockedGetEnvironmentForecast.mockRejectedValue(
      new Error("Network error"),
    );

    render(
      <WeatherOverview
        location={madrid}
      />,
    );

    expect(
      await screen.findByRole("alert"),
    ).toHaveTextContent(
      "The weather forecast could not be loaded.",
    );
  });

  it("shows weather even when the environment request fails", async () => {
    mockedGetWeatherForecast.mockResolvedValue(forecast);
    mockedGetEnvironmentForecast.mockRejectedValue(
      new Error("Environment error"),
    );

    render(
      <WeatherOverview
        location={madrid}
      />,
    );

    expect(
      await screen.findByRole("heading", {
        name: "Weather forecast",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("16 °C")).toBeInTheDocument();
    expect(screen.getByText("28 °C")).toBeInTheDocument();
  });

  it("switches from carousel to table view", async () => {
    const user = userEvent.setup();

    mockedGetWeatherForecast.mockResolvedValue(forecast);
    mockedGetEnvironmentForecast.mockResolvedValue(
      environmentForecast,
    );

    render(
      <WeatherOverview
        location={madrid}
      />,
    );

    await screen.findByRole("heading", {
      name: "Weather forecast",
    });

    const tableButton = screen.getByRole("button", {
      name: "Table",
    });

    await user.click(tableButton);

    expect(tableButton).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    const table = screen.getByRole("table", {
      name: "15-day weather forecast",
    });

    expect(
      within(table).getByText("16 °C"),
    ).toBeInTheDocument();

    expect(
      within(table).getByText("14 °C"),
    ).toBeInTheDocument();

    expect(
      within(table).getByText("75%"),
    ).toBeInTheDocument();

    expect(
      within(table).getByText("3.5 mm"),
    ).toBeInTheDocument();

    expect(
      within(table).getAllByText("Rain"),
    ).toHaveLength(2);

    expect(
      within(table).getAllByAltText("Weather icon"),
    ).toHaveLength(2);

    expect(
      within(table).getByText("6.2"),
    ).toBeInTheDocument();

    expect(
      within(table).getByText("07:42"),
    ).toBeInTheDocument();

    expect(
      within(table).getByText("20:43"),
    ).toBeInTheDocument();
  });

  it("shows environment data in the table for matching dates", async () => {
    const user = userEvent.setup();

    mockedGetWeatherForecast.mockResolvedValue(forecast);
    mockedGetEnvironmentForecast.mockResolvedValue(
      environmentForecast,
    );

    render(
      <WeatherOverview
        location={madrid}
      />,
    );

    await screen.findByRole("heading", {
      name: "Weather forecast",
    });

    await user.click(
      screen.getByRole("button", { name: "Table" }),
    );

    const table = screen.getByRole("table");

    expect(
      within(table).getByText("35"),
    ).toBeInTheDocument();

    expect(
      within(table).getByText("Fair"),
    ).toBeInTheDocument();

    expect(
      within(table).getAllByText("N/A").length,
    ).toBeGreaterThanOrEqual(1);
  });
});