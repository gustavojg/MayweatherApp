import * as React from "react";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { WeatherData, WeatherService } from "@/types/weather";
import {
  OpenWeatherMapService,
  WeatherAPIService,
} from "@/services/weatherServices";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface WeatherSettings {
  useFahrenheit: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
  darkMode: boolean;
  preferredService: "openweathermap" | "weatherapi";
}

interface SearchHistoryItem {
  name: string;
  timestamp: number;
}

interface WeatherContextType {
  currentService: WeatherService;
  setCurrentService: (service: "openweathermap" | "weatherapi") => void;
  settings: WeatherSettings;
  updateSettings: (newSettings: Partial<WeatherSettings>) => Promise<void>;
  searchHistory: SearchHistoryItem[];
  addToHistory: (location: string) => Promise<void>;
  lastLocation: string | null;
  weatherData: WeatherData | null;
  fetchWeather: (location: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const DEFAULT_SETTINGS: WeatherSettings = {
  useFahrenheit: false,
  autoRefresh: false,
  refreshInterval: 30,
  darkMode: false,
  preferredService: "openweathermap",
};

export const WeatherContext = createContext<WeatherContextType | undefined>(
  undefined
);

export function WeatherProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState({
    initialized: false,
    settings: DEFAULT_SETTINGS,
    currentService: new OpenWeatherMapService(),
    searchHistory: [] as SearchHistoryItem[],
    lastLocation: null as string | null,
    weatherData: null as WeatherData | null,
    isLoading: false,
    error: null as string | null,
  });

  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const [savedSettings, savedHistory, savedLocation] = await Promise.all([
          AsyncStorage.getItem("weatherSettings"),
          AsyncStorage.getItem("searchHistory"),
          AsyncStorage.getItem("lastLocation"),
        ]);

        setState((current) => ({
          ...current,
          initialized: true,
          settings: savedSettings
            ? JSON.parse(savedSettings)
            : current.settings,
          searchHistory: savedHistory
            ? JSON.parse(savedHistory)
            : current.searchHistory,
          lastLocation: savedLocation || current.lastLocation,
        }));
      } catch (error) {
        console.error("Error loading saved data:", error);
        setState((current) => ({ ...current, initialized: true }));
      }
    };

    loadSavedData();
  }, []);

  const handleServiceChange = useCallback(
    async (serviceId: "openweathermap" | "weatherapi") => {
      const newService =
        serviceId === "openweathermap"
          ? new OpenWeatherMapService()
          : new WeatherAPIService();

      setState((current) => ({
        ...current,
        currentService: newService,
        settings: {
          ...current.settings,
          preferredService: serviceId,
        },
      }));

      await AsyncStorage.setItem(
        "weatherSettings",
        JSON.stringify({
          ...state.settings,
          preferredService: serviceId,
        })
      );

      if (state.lastLocation && state.initialized) {
        await fetchWeather(state.lastLocation);
      }
    },
    [state.lastLocation, state.initialized, state.settings]
  );

  const updateSettings = async (newSettings: Partial<WeatherSettings>) => {
    const updatedSettings = { ...state.settings, ...newSettings };
    setState((current) => ({ ...current, settings: updatedSettings }));
    await AsyncStorage.setItem(
      "weatherSettings",
      JSON.stringify(updatedSettings)
    );
  };

  const addToHistory = async (location: string) => {
    const newHistoryItem = {
      name: location,
      timestamp: Date.now(),
    };

    const updatedHistory = [
      newHistoryItem,
      ...state.searchHistory.filter((item) => item.name !== location),
    ].slice(0, 5);

    setState((current) => ({
      ...current,
      searchHistory: updatedHistory,
      lastLocation: location,
    }));

    await Promise.all([
      AsyncStorage.setItem("searchHistory", JSON.stringify(updatedHistory)),
      AsyncStorage.setItem("lastLocation", location),
    ]);
  };

  const fetchWeather = async (location: string) => {
    setState((current) => ({ ...current, isLoading: true, error: null }));

    try {
      const data = await state.currentService.fetchWeather(location);
      setState((current) => ({ ...current, weatherData: data }));
      await addToHistory(location);
    } catch (error) {
      setState((current) => ({
        ...current,
        error: "Failed to fetch weather data",
      }));
      console.error("Error fetching weather:", error);
    } finally {
      setState((current) => ({ ...current, isLoading: false }));
    }
  };

  const value: WeatherContextType = {
    currentService: state.currentService,
    setCurrentService: handleServiceChange,
    settings: state.settings,
    updateSettings,
    searchHistory: state.searchHistory,
    addToHistory,
    lastLocation: state.lastLocation,
    weatherData: state.weatherData,
    fetchWeather,
    isLoading: state.isLoading,
    error: state.error,
  };

  if (!state.initialized) {
    return null;
  }

  return (
    <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>
  );
}

export function useWeather() {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error("useWeather must be used within a WeatherProvider");
  }
  return context;
}
