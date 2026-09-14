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

const environmentDays = 4;
const hoursPerDay = 24;
const totalHours = environmentDays * hoursPerDay;

const hourlyTimes: string[] = [];

for (let d = 0; d < environmentDays; d++) {
  const date = dates[d]!;

  for (let h = 0; h < hoursPerDay; h++) {
    hourlyTimes.push(
      `${date}T${String(h).padStart(2, "0")}:00`,
    );
  }
}

const airQualityResponse = {
  timezone: "Europe/Madrid",
  hourly: {
    time: hourlyTimes,
    european_aqi: Array(totalHours)
      .fill(null)
      .map((_, i) =>
        i % hoursPerDay === 12 ? 45 : 20,
      ),
    alder_pollen: Array(totalHours).fill(null),
    birch_pollen: Array(totalHours).fill(null),
    grass_pollen: Array(totalHours)
      .fill(null)
      .map((_, i) =>
        i % hoursPerDay === 10 ? 8.5 : null,
      ),
    mugwort_pollen: Array(totalHours).fill(null),
    olive_pollen: Array(totalHours)
      .fill(null)
      .map((_, i) =>
        i % hoursPerDay === 14 ? 15 : null,
      ),
    ragweed_pollen: Array(totalHours).fill(null),
  },
};

test.describe("environment forecast integration", () => {
  test.use({
    locale: "en-US",
    permissions: ["geolocation"],
    geolocation: {
      latitude,
      longitude,
    },
  });

  test("shows AQI and pollen in carousel and table with 15 weather days", async ({
    page,
  }) => {
    await page.route(
      "https://api.open-meteo.com/v1/forecast**",
      async (route) => {
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
      page.getByText("45"),
    ).toBeVisible();

    await expect(
      page.getByText("Moderate"),
    ).toBeVisible();

    await expect(
      page.getByText("Olive"),
    ).toBeVisible();

    const tableButton = page.getByRole("button", {
      name: "Table",
    });
    await tableButton.click();

    const table = page.getByRole("table", {
      name: "15-day weather forecast",
    });

    await expect(table).toBeVisible();

    const rows = table.locator("tbody tr");
    await expect(rows).toHaveCount(15);

    const firstRow = rows.nth(0);
    await expect(
      firstRow.getByText("45"),
    ).toBeVisible();
    await expect(
      firstRow.getByText("Moderate"),
    ).toBeVisible();

    const lastRow = rows.nth(14);
    await expect(
      lastRow.getByText("N/A").first(),
    ).toBeVisible();
  });
});
