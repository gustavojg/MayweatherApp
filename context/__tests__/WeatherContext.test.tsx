import * as React from "react";
import { render, waitFor, act } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WeatherProvider, useWeather } from "../WeatherContext";

const mockOpenWeatherService = {
  id: "openweathermap",
  name: "OpenWeatherMap",
  fetchWeather: jest.fn().mockResolvedValue({
    temperature: 20,
    conditions: "Clear",
    humidity: 50,
    windSpeed: 10,
    location: "Madrid",
  }),
  searchLocations: jest.fn(),
};

const mockWeatherAPIService = {
  id: "weatherapi",
  name: "WeatherAPI",
  fetchWeather: jest.fn().mockResolvedValue({
    temperature: 22,
    conditions: "Rain",
    humidity: 60,
    windSpeed: 15,
    location: "Madrid",
  }),
  searchLocations: jest.fn(),
};

// Reset mocks antes de cada test
beforeEach(() => {
  mockOpenWeatherService.fetchWeather.mockClear();
  mockWeatherAPIService.fetchWeather.mockClear();
  mockOpenWeatherService.searchLocations.mockClear();
  mockWeatherAPIService.searchLocations.mockClear();
});

jest.mock("@/services/weatherServices", () => ({
  OpenWeatherMapService: jest
    .fn()
    .mockImplementation(() => mockOpenWeatherService),
  WeatherAPIService: jest.fn().mockImplementation(() => mockWeatherAPIService),
}));

jest.mock("@/services/weatherServices", () => ({
  OpenWeatherMapService: jest
    .fn()
    .mockImplementation(() => mockOpenWeatherService),
  WeatherAPIService: jest.fn().mockImplementation(() => mockWeatherAPIService),
}));

// Mock de AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  multiSet: jest.fn(),
  multiGet: jest.fn().mockResolvedValue([]),
  clear: jest.fn(),
}));

// Silenciar console.error en tests
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

const TestComponent = ({
  onMount,
}: {
  onMount?: (weather: ReturnType<typeof useWeather>) => void;
}) => {
  const weather = useWeather();
  React.useEffect(() => {
    onMount?.(weather);
  }, [weather, onMount]);
  return null;
};

describe("WeatherContext", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await AsyncStorage.clear();
  });

  it("loads settings and history from AsyncStorage", async () => {
    const mockSettings = {
      useFahrenheit: true,
      darkMode: true,
      autoRefresh: false,
      refreshInterval: 30,
      preferredService: "openweathermap" as const,
    };
    const mockHistory = [{ name: "Madrid", timestamp: 1234567890 }];

    AsyncStorage.getItem.mockImplementation(async (key) => {
      switch (key) {
        case "weatherSettings":
          return JSON.stringify(mockSettings);
        case "searchHistory":
          return JSON.stringify(mockHistory);
        case "lastLocation":
          return "Madrid";
        default:
          return null;
      }
    });

    let weatherContext: ReturnType<typeof useWeather> | undefined;

    render(
      <WeatherProvider>
        <TestComponent
          onMount={(weather) => {
            weatherContext = weather;
          }}
        />
      </WeatherProvider>
    );

    await waitFor(() => {
      expect(weatherContext?.settings.useFahrenheit).toBe(true);
      expect(weatherContext?.settings.darkMode).toBe(true);
      expect(weatherContext?.lastLocation).toBe("Madrid");
      expect(weatherContext?.searchHistory[0].name).toBe("Madrid");
      expect(weatherContext?.searchHistory[0].timestamp).toBe(1234567890);
    });
  });

  it("updates settings and saves to AsyncStorage", async () => {
    let weatherContext: ReturnType<typeof useWeather> | undefined;

    render(
      <WeatherProvider>
        <TestComponent
          onMount={(weather) => {
            weatherContext = weather;
          }}
        />
      </WeatherProvider>
    );

    await waitFor(() => {
      expect(weatherContext).toBeDefined();
    });

    const newSettings = {
      useFahrenheit: true,
      darkMode: true,
      autoRefresh: true,
      refreshInterval: 60,
    };

    await act(async () => {
      await weatherContext?.updateSettings(newSettings);
    });

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "weatherSettings",
        expect.stringContaining('"useFahrenheit":true')
      );
      expect(weatherContext?.settings.useFahrenheit).toBe(true);
      expect(weatherContext?.settings.darkMode).toBe(true);
      expect(weatherContext?.settings.autoRefresh).toBe(true);
      expect(weatherContext?.settings.refreshInterval).toBe(60);
    });
  });

  it("adds location to search history and saves to AsyncStorage", async () => {
    let weatherContext: ReturnType<typeof useWeather> | undefined;

    render(
      <WeatherProvider>
        <TestComponent
          onMount={(weather) => {
            weatherContext = weather;
          }}
        />
      </WeatherProvider>
    );

    await waitFor(() => {
      expect(weatherContext).toBeDefined();
    });

    const location = "Valencia";

    await act(async () => {
      await weatherContext?.addToHistory(location);
    });

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "searchHistory",
        expect.stringContaining(location)
      );
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "lastLocation",
        location
      );
      expect(weatherContext?.searchHistory[0].name).toBe(location);
      expect(weatherContext?.lastLocation).toBe(location);
    });
  });

  it("keeps only last 5 locations in history", async () => {
    let weatherContext: ReturnType<typeof useWeather> | undefined;

    render(
      <WeatherProvider>
        <TestComponent
          onMount={(weather) => {
            weatherContext = weather;
          }}
        />
      </WeatherProvider>
    );

    await waitFor(() => {
      expect(weatherContext).toBeDefined();
    });

    // Añadimos las ubicaciones en orden
    const locations = [
      "Madrid",
      "Barcelona",
      "Valencia",
      "Sevilla",
      "Bilbao",
      "Málaga",
    ];

    // Esperar a que cada ubicación se añada al historial
    for (const location of locations) {
      await act(async () => {
        await weatherContext?.addToHistory(location);
      });
      // Esperamos a que se actualice el estado después de cada adición
      await waitFor(() => {
        expect(weatherContext?.lastLocation).toBe(location);
      });
    }

    // Verificar el estado final
    await waitFor(() => {
      expect(weatherContext?.searchHistory).toHaveLength(5);
      // Verificar que las últimas 5 ubicaciones están en el orden correcto
      const expectedLocations = [
        "Málaga",
        "Bilbao",
        "Sevilla",
        "Valencia",
        "Barcelona",
      ];
      weatherContext?.searchHistory.forEach((historyItem, index) => {
        expect(historyItem.name).toBe(expectedLocations[index]);
      });
      // Verificar que Madrid (la más antigua) ha sido eliminada
      expect(
        weatherContext?.searchHistory.find((h) => h.name === "Madrid")
      ).toBeUndefined();
    });
  });

  it("fetches weather and updates state", async () => {
    let weatherContext: ReturnType<typeof useWeather> | undefined;

    render(
      <WeatherProvider>
        <TestComponent
          onMount={(weather) => {
            weatherContext = weather;
          }}
        />
      </WeatherProvider>
    );

    await waitFor(() => {
      expect(weatherContext).toBeDefined();
    });

    await act(async () => {
      await weatherContext?.fetchWeather("Madrid");
    });

    await waitFor(() => {
      expect(weatherContext?.weatherData?.temperature).toBe(20);
      expect(weatherContext?.weatherData?.conditions).toBe("Clear");
      expect(weatherContext?.isLoading).toBe(false);
      expect(weatherContext?.error).toBeNull();
    });
  });

  // Nuevo test para verificar que el cambio de servicio mantiene la última ubicación
  it("maintains last location when switching services", async () => {
    let weatherContext: ReturnType<typeof useWeather> | undefined;

    render(
      <WeatherProvider>
        <TestComponent
          onMount={(weather) => {
            weatherContext = weather;
          }}
        />
      </WeatherProvider>
    );

    await waitFor(() => {
      expect(weatherContext).toBeDefined();
    });

    // Establecer una ubicación inicial
    await act(async () => {
      await weatherContext?.fetchWeather("Madrid");
    });

    await waitFor(() => {
      expect(weatherContext?.lastLocation).toBe("Madrid");
    });

    // Cambiar el servicio
    await act(async () => {
      weatherContext?.setCurrentService("weatherapi");
    });

    // Verificar que la última ubicación se mantiene
    await waitFor(() => {
      expect(weatherContext?.settings.preferredService).toBe("weatherapi");
      expect(weatherContext?.lastLocation).toBe("Madrid");
    });
  });

  it("handles fetchWeather failure gracefully", async () => {
    mockOpenWeatherService.fetchWeather.mockRejectedValueOnce(
      new Error("Network error")
    );

    let weatherContext: ReturnType<typeof useWeather> | undefined;

    render(
      <WeatherProvider>
        <TestComponent
          onMount={(weather) => {
            weatherContext = weather;
          }}
        />
      </WeatherProvider>
    );

    await waitFor(() => {
      expect(weatherContext).toBeDefined();
    });

    await act(async () => {
      await weatherContext?.fetchWeather("Madrid");
    });

    await waitFor(() => {
      expect(weatherContext?.error).toBe("Failed to fetch weather data");
      expect(weatherContext?.weatherData).toBeNull();
      expect(weatherContext?.isLoading).toBe(false);
    });

    // Restaurar el mock para los siguientes tests
    mockOpenWeatherService.fetchWeather.mockResolvedValue({
      temperature: 20,
      conditions: "Clear",
      humidity: 50,
      windSpeed: 10,
      location: "Madrid",
    });
  });

});
