import {
  render,
  screen,
} from "@testing-library/react";
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
    currentTemperature: null,
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
    const handleDaytimeChange = jest.fn();

    mockedGetWeatherForecast.mockResolvedValue(forecast);
    mockedGetEnvironmentForecast.mockResolvedValue(
      environmentForecast,
    );

    render(
      <WeatherOverview
        location={madrid}
        onDaytimeChange={handleDaytimeChange}
      />,
    );

    expect(
      screen.getByText("Loading weather forecast..."),
    ).toBeInTheDocument();

    const heading = await screen.findByRole("heading", {
      name: "Friday, September 4",
    });

    expect(heading).toBeInTheDocument();
    expect(mockedGetSkyState).toHaveBeenCalledWith(
      expect.any(Date),
      "Europe/Madrid",
      "2026-09-04T07:42:00Z",
      "2026-09-04T20:43:00Z",
    );
    expect(handleDaytimeChange).toHaveBeenCalledWith(
      madrid.id,
      true,
    );

    expect(screen.getByText("16 °C")).toBeInTheDocument();
    expect(screen.getByText("28 °C")).toBeInTheDocument();
    expect(screen.getByText(/35%/)).toHaveTextContent("35% - Rain");
    expect(screen.getByText("1.5 mm")).toBeInTheDocument();
  });

  it("reports the night time state to the parent", async () => {
    const handleDaytimeChange = jest.fn();

    mockedGetSkyState.mockReturnValue("deep-night");
    mockedGetWeatherForecast.mockResolvedValue(forecast);
    mockedGetEnvironmentForecast.mockResolvedValue(
      environmentForecast,
    );

    render(
      <WeatherOverview
        location={madrid}
        onDaytimeChange={handleDaytimeChange}
      />,
    );

    await screen.findByRole("heading", {
      name: "Friday, September 4",
    });

    expect(handleDaytimeChange).toHaveBeenCalledWith(
      madrid.id,
      false,
    );
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
        name: "Friday, September 4",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("16 °C")).toBeInTheDocument();
    expect(screen.getByText("28 °C")).toBeInTheDocument();
  });
});
