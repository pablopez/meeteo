export type OpenMeteoHourlyAirQualityDto = {
  time?: string[];
  european_aqi?: Array<number | null>;
  alder_pollen?: Array<number | null>;
  birch_pollen?: Array<number | null>;
  grass_pollen?: Array<number | null>;
  mugwort_pollen?: Array<number | null>;
  olive_pollen?: Array<number | null>;
  ragweed_pollen?: Array<number | null>;
};

export type OpenMeteoAirQualityResponseDto = {
  latitude?: number;
  longitude?: number;
  timezone?: string;
  hourly?: OpenMeteoHourlyAirQualityDto;
};
