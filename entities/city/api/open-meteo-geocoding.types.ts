export type OpenMeteoLocationDto = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country_code: string;
  admin1?: string;
};

export type OpenMeteoGeocodingResponseDto = {
  results?: OpenMeteoLocationDto[];
};
