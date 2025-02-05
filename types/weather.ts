// types/weather.ts
export interface WeatherData {
  temperature: number;
  conditions: string;
  humidity: number;
  windSpeed: number;
  location: string;
}

export interface Location {
  id: string;
  name: string;
  country: string;
  state?: string;
  region?: string;
}

export interface WeatherService {
  id: string;
  name: string;
  fetchWeather: (location: string) => Promise<WeatherData>;
  searchLocations: (query: string) => Promise<Location[]>;
}

export interface ThemeColors {
  light: string;
  dark: string;
}