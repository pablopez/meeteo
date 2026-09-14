import { expect, test } from "@playwright/test";

const latitude = 40.4168;
const longitude = -3.7038;

const dates = Array.from(
  { length: 15 },
  (_, index) =>
    `2026-09-${String(index + 1).padStart(2, "0")}`,
);

const forecastResponse = {
  timezone: "Europe/Madrid",
  daily: {
    time: dates,
    weather_code: Array(15).fill(1),
    temperature_2m_max: Array(15).fill(27),
    temperature_2m_min: Array(15).fill(16),
    precipitation_sum: Array(15).fill(0.5),
    precipitation_probability_max:
      Array(15).fill(20),
    uv_index_max: Array(15).fill(8),
    sunrise: Array(15).fill("2026-09-01T07:30"),
    sunset: Array(15).fill("2026-09-01T20:45"),
  },
};

const airQualityResponse = {
  timezone: "Europe/Madrid",
  hourly: {
    time: ["2026-09-01T00:00"],
    european_aqi: [25],
  },
};

test.describe("current browser location", () => {
  test.use({
    locale: "en-US",
    permissions: ["geolocation"],
    geolocation: {
      latitude,
      longitude,
    },
  });

  test("shows the weather for the current location", async ({
    page,
  }) => {
    await page.route(
      "https://api.open-meteo.com/v1/forecast**",
      async (route) => {
        const requestUrl = new URL(
          route.request().url(),
        );

        expect(
          requestUrl.searchParams.get("latitude"),
        ).toBe(String(latitude));

        expect(
          requestUrl.searchParams.get("longitude"),
        ).toBe(String(longitude));

        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(forecastResponse),
        });
      },
    );

    await page.route(
      "https://air-quality-api.open-meteo.com/v1/air-quality**",
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(airQualityResponse),
        });
      },
    );

    await page.goto("/");

    await expect(
      page.getByRole("heading", {
        name: "Current location",
      }),
    ).toBeVisible();

    await expect(
      page.getByRole("heading", {
        name: "Weather forecast",
      }),
    ).toBeVisible();

    await expect(
      page.getByText("Day 1 of 15"),
    ).toBeVisible();

    await expect(
      page.getByText("16 °C"),
    ).toBeVisible();

    await expect(
      page.getByText("27 °C"),
    ).toBeVisible();
  });
});