// services/weatherServices.ts
import axios from "axios";
import { WeatherData, WeatherService } from "@/types/weather";
import { OPENWEATHER_API_KEY, WEATHERAPI_KEY } from "@/config/keys";

export class OpenWeatherMapService implements WeatherService {
  id = "openweathermap";
  name = "OpenWeather";

  async fetchWeather(location: string): Promise<WeatherData> {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${OPENWEATHER_API_KEY}`
      );
      return {
        temperature: Math.round(response.data.main.temp),
        conditions: response.data.weather[0].main,
        humidity: response.data.main.humidity,
        windSpeed: Math.round(response.data.wind.speed * 3.6),
        location: response.data.name,
      };
    } catch (error: any) {
      console.error(
        "OpenWeatherMap error:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message ||
          "Failed to fetch weather from OpenWeatherMap"
      );
    }
  }

  async searchLocations(query: string) {
    if (!query.trim()) return [];

    try {
      const response = await axios.get(
        `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${OPENWEATHER_API_KEY}`
      );

      return response.data.map((item: any) => ({
        id: `${item.lat},${item.lon}`,
        name: item.name,
        country: item.country,
        state: item.state,
      }));
    } catch (error: any) {
      console.error(
        "Location search error:",
        error.response?.data || error.message
      );
      throw new Error("Failed to fetch locations");
    }
  }
}

export class WeatherAPIService implements WeatherService {
  id = "weatherapi";
  name = "WeatherAPI";

  async fetchWeather(location: string): Promise<WeatherData> {
    try {
      const response = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=${WEATHERAPI_KEY}&q=${location}`
      );
      return {
        temperature: Math.round(response.data.current.temp_c),
        conditions: response.data.current.condition.text,
        humidity: response.data.current.humidity,
        windSpeed: Math.round(response.data.current.wind_kph),
        location: `${response.data.location.name}, ${response.data.location.country}`,
      };
    } catch (error: any) {
      console.error("WeatherAPI error:", error.response?.data || error.message);
      throw new Error(
        error.response?.data?.error?.message ||
          "Failed to fetch weather from WeatherAPI"
      );
    }
  }

  async searchLocations(query: string) {
    if (!query.trim()) return [];

    try {
      const response = await axios.get(
        `https://api.weatherapi.com/v1/search.json?key=${WEATHERAPI_KEY}&q=${query}`
      );

      return response.data.map((item: any) => ({
        id: item.id.toString(),
        name: item.name,
        country: item.country,
        region: item.region,
      }));
    } catch (error: any) {
      console.error(
        "Location search error:",
        error.response?.data || error.message
      );
      throw new Error("Failed to fetch locations");
    }
  }
}
