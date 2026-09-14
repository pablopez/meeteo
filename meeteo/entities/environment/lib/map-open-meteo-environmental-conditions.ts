import type {
  OpenMeteoAirQualityResponseDto,
  OpenMeteoHourlyAirQualityDto,
} from "@/shared/api/open-meteo";
import {
  createAirQuality,
} from "../model/air-quality";
import {
  createAllergyMeasurement,
  type AllergyMeasurement,
  type PollenAllergen,
} from "../model/allergy";
import {
  createDailyEnvironmentalConditions,
  type DailyEnvironmentalConditions,
} from "../model/daily-environmental-conditions";
import {
  createEnvironmentForecast,
  type EnvironmentForecast,
} from "../model/environment-forecast";

type PollenField =
  keyof Pick<
    OpenMeteoHourlyAirQualityDto,
    | "alder_pollen"
    | "birch_pollen"
    | "grass_pollen"
    | "mugwort_pollen"
    | "olive_pollen"
    | "ragweed_pollen"
  >;

type PollenFieldDefinition = {
  allergen: PollenAllergen;
  field: PollenField;
};

const POLLEN_FIELDS: readonly PollenFieldDefinition[] = [
  {
    allergen: "alder",
    field: "alder_pollen",
  },
  {
    allergen: "birch",
    field: "birch_pollen",
  },
  {
    allergen: "grass",
    field: "grass_pollen",
  },
  {
    allergen: "mugwort",
    field: "mugwort_pollen",
  },
  {
    allergen: "olive",
    field: "olive_pollen",
  },
  {
    allergen: "ragweed",
    field: "ragweed_pollen",
  },
];

const MAX_FORECAST_DAYS = 7;

function isValidValue(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0
  );
}

/**
 * For each day, the daily value is the maximum hourly
 * value available. This represents the worst-case forecast
 * for that day.
 */
function dailyMaximum(
  values: Array<number | null> | undefined,
  indices: number[],
): number | null {
  if (!values) {
    return null;
  }

  let max: number | null = null;

  for (const index of indices) {
    const value = values[index];

    if (value === null || value === undefined) {
      continue;
    }

    if (!isValidValue(value)) {
      throw new Error(
        "Invalid hourly environmental value",
      );
    }

    if (max === null || value > max) {
      max = value;
    }
  }

  return max;
}

function extractDatePart(
  timestamp: string,
): string {
  return timestamp.slice(0, 10);
}

type DayGroup = {
  date: string;
  indices: number[];
};

function groupHoursByDay(
  times: string[],
): DayGroup[] {
  const groupMap = new Map<string, number[]>();

  for (let i = 0; i < times.length; i++) {
    const date = extractDatePart(times[i]!);
    let indices = groupMap.get(date);

    if (!indices) {
      indices = [];
      groupMap.set(date, indices);
    }

    indices.push(i);
  }

  return Array.from(groupMap.entries())
    .map(([date, indices]) => ({ date, indices }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, MAX_FORECAST_DAYS);
}

function mapDayAllergyMeasurements(
  hourly: OpenMeteoHourlyAirQualityDto,
  indices: number[],
): AllergyMeasurement[] {
  return POLLEN_FIELDS.flatMap(
    ({ allergen, field }) => {
      const max = dailyMaximum(
        hourly[field],
        indices,
      );

      if (max === null) {
        return [];
      }

      return [
        createAllergyMeasurement(allergen, max),
      ];
    },
  );
}

function mapDay(
  hourly: OpenMeteoHourlyAirQualityDto,
  group: DayGroup,
): DailyEnvironmentalConditions {
  const maxAqi = dailyMaximum(
    hourly.european_aqi,
    group.indices,
  );

  return createDailyEnvironmentalConditions({
    date: group.date,
    airQuality:
      maxAqi !== null
        ? createAirQuality(maxAqi)
        : null,
    allergyMeasurements: mapDayAllergyMeasurements(
      hourly,
      group.indices,
    ),
  });
}

export function mapOpenMeteoEnvironmentForecast(
  response: OpenMeteoAirQualityResponseDto,
): EnvironmentForecast {
  const hourly = response.hourly;

  if (
    typeof response.timezone !== "string" ||
    !hourly ||
    !Array.isArray(hourly.time)
  ) {
    throw new Error(
      "Invalid environment forecast response",
    );
  }

  const dayGroups = groupHoursByDay(hourly.time);
  const days = dayGroups.map((group) =>
    mapDay(hourly, group),
  );

  return createEnvironmentForecast({
    timezone: response.timezone,
    days,
  });
}