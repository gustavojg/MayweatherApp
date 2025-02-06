import * as React from "react";
import { render, waitFor } from "@/utils/test-utils";
import WeatherDisplay from "../WeatherDisplay";
import { WeatherData } from "@/types/weather";
import { useWeather } from "@/context/WeatherContext";

const mockWeatherData: WeatherData = {
  temperature: 25,
  conditions: "Clear",
  humidity: 87,
  windSpeed: 6,
  location: "Madrid",
};

jest.mock("@/context/WeatherContext", () => {
  const actual = jest.requireActual("@/context/WeatherContext");
  return {
    __esModule: true,
    ...actual,
    useWeather: jest.fn(),
  };
});

describe("WeatherDisplay", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("renders correctly with weather data (Celsius)", async () => {
    (useWeather as jest.Mock).mockReturnValue({
      settings: { useFahrenheit: false },
      weatherData: { temperature: 25, condition: "Clear" },
    });

    const { getByTestId } = await render(
      <WeatherDisplay data={mockWeatherData} />
    );

    await waitFor(() => {
      const temperature = getByTestId("weather-temperature");
      expect(temperature.props.children).toEqual([25, "°C"]);
    });
  });

  it("displays temperature in Fahrenheit when enabled", async () => {
    (useWeather as jest.Mock).mockReturnValue({
      settings: { useFahrenheit: true },
      weatherData: { temperature: 25, condition: "Sunny" },
    });

    const { getByTestId } = await render(
      <WeatherDisplay data={mockWeatherData} />
    );

    await waitFor(() => {
      const temperature = getByTestId("weather-temperature");
      expect(temperature.props.children).toEqual([77, "°F"]);
    });
  });
});
