import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { render as rtlRender, waitFor } from "@testing-library/react-native";
import { DefaultTheme, Theme } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WeatherContext } from "../context/WeatherContext";

const mockTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#1D3D47",
    background: "#FFFFFF",
    card: "#FFFFFF",
    text: "#000000",
    border: "#E0E0E0",
  },
};

interface CustomRenderOptions {
  initialSettings?: any;
  initialHistory?: any[];
  initialLocation?: string | null;
  renderOptions?: Parameters<typeof rtlRender>[1];
}

async function setupAsyncStorage(options: CustomRenderOptions = {}) {
  const {
    initialSettings,
    initialHistory = [],
    initialLocation = null,
  } = options;

  const defaultSettings = {
    useFahrenheit: false,
    autoRefresh: false,
    refreshInterval: 30,
    darkMode: false,
    preferredService: "openweathermap",
  };

  const settings = initialSettings || defaultSettings;

  const storageItems: [string, string][] = [
    ["weatherSettings", JSON.stringify(settings)],
    ["searchHistory", JSON.stringify(initialHistory)],
  ];

  if (initialLocation) {
    storageItems.push(["lastLocation", initialLocation]);
  }

  await AsyncStorage.multiSet(storageItems);
}



function createWrapper() {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    const mockWeatherContext = {
      currentService: {
        id: "mock-service",
        name: "Mock Weather Service",
        fetchWeather: jest.fn().mockResolvedValue(null), // Simula una respuesta vacía
        searchLocations: jest.fn().mockResolvedValue([
          { id: "1", name: "London", country: "UK" },
          { id: "2", name: "Paris", country: "France" },
        ]),
      },
      setCurrentService: jest.fn(),
      settings: {
        useFahrenheit: false,
        autoRefresh: false,
        refreshInterval: 30,
        darkMode: false,
        preferredService: "openweathermap" as "openweathermap" | "weatherapi",
      },
      updateSettings: jest.fn().mockResolvedValue(undefined),
      searchHistory: [
        { name: "Madrid", timestamp: 1234567890 },
        { name: "Berlin", timestamp: 1234567891 },
      ],
      addToHistory: jest.fn().mockResolvedValue(undefined),
      lastLocation: null,
      weatherData: null,
      fetchWeather: jest.fn().mockResolvedValue(undefined),
      isLoading: false,
      error: null,
    };

    return (
      <NavigationContainer theme={mockTheme}>
        <WeatherContext.Provider value={mockWeatherContext}>
          {children}
        </WeatherContext.Provider>
      </NavigationContainer>
    );
  };
}

async function render(
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
) {
  await AsyncStorage.clear();

  await setupAsyncStorage(options);

  const wrapper = createWrapper();
  const rendered = rtlRender(ui, {
    wrapper,
    ...options.renderOptions,
  });

  await waitFor(() => {
    expect(rendered.UNSAFE_root).toBeTruthy();
  });

  return {
    ...rendered,
    rerender: (ui: React.ReactElement) =>
      rendered.rerender(wrapper({ children: ui })),
  };
}

export * from "@testing-library/react-native";
export { render, mockTheme };
