export type OpenMeteoCurrentWeatherDto = {
  temperature?: number | null;
  weathercode?: number | null;
  is_day?: number;
  time?: string;
  windspeed?: number;
  winddirection?: number;
};

export type OpenMeteoForecastResponseDto = {
  timezone?: string;
  current_weather?: OpenMeteoCurrentWeatherDto;
  daily?: {
    time?: string[];
    weather_code?: Array<number | null>;
    temperature_2m_max?: Array<number | null>;
    temperature_2m_min?: Array<number | null>;
    precipitation_sum?: Array<number | null>;
    precipitation_probability_max?: Array<number | null>;
    uv_index_max?: Array<number | null>;
    sunrise?: Array<string | null>;
    sunset?: Array<string | null>;
  };
};
