import * as React from "react";
import { render, waitFor } from "@/utils/test-utils";
import { WeatherDetails } from "../WeatherDetails";
import { useWeather } from "@/context/WeatherContext";
import colors from "@/theme/colors";

jest.mock("@/context/WeatherContext", () => {
  const actual = jest.requireActual("@/context/WeatherContext");
  return {
    __esModule: true,
    ...actual,
    useWeather: jest.fn(),
  };
});

describe("WeatherDetails Component", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("renders humidity and wind speed correctly", async () => {
    (useWeather as jest.Mock).mockReturnValue({
      settings: { darkMode: false },
    });

    const { getByTestId } = await render(
      <WeatherDetails humidity={65} windSpeed={12} />
    );

    await waitFor(() => {
      expect(getByTestId("weather-humidity").props.children).toEqual([65, "%"]);
      expect(getByTestId("weather-wind-speed").props.children).toEqual([
        12,
        " km/h",
      ]);
    });
  });

  it("renders correct icon color in light mode", async () => {
    (useWeather as jest.Mock).mockReturnValue({
      settings: { darkMode: false }, // Simulamos el modo claro
    });

    const { getByTestId } = await render(
      <WeatherDetails humidity={80} windSpeed={15} />
    );

    await waitFor(() => {
      const humidityIcon = getByTestId("weather-humidity-icon");
      const windSpeedIcon = getByTestId("weather-wind-speed-icon");

      expect(humidityIcon.props.color).toBe(colors.light.icon);
      expect(windSpeedIcon.props.color).toBe(colors.light.icon);
    });
  });

  it("renders correct icon color in dark mode", async () => {
    (useWeather as jest.Mock).mockReturnValue({
      settings: { darkMode: true },
    });

    const { getByTestId } = await render(
      <WeatherDetails humidity={75} windSpeed={20} />
    );

    await waitFor(() => {
      const humidityIcon = getByTestId("weather-humidity-icon");
      const windSpeedIcon = getByTestId("weather-wind-speed-icon");

      expect(humidityIcon.props.color).toBe(colors.dark.icon);
      expect(windSpeedIcon.props.color).toBe(colors.dark.icon);
    });
  });
});
