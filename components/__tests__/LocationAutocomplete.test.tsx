import * as React from "react";
import { render, fireEvent, waitFor, act } from "@/utils/test-utils";
import LocationAutocomplete from "../LocationAutocomplete";

jest.mock("@/context/WeatherContext", () => {
  const actual = jest.requireActual("@/context/WeatherContext");
  return {
    __esModule: true,
    ...actual,
    useWeather: () => ({
      currentService: {
        searchLocations: jest.fn().mockImplementation(async () => {
          console.log("Mock searchLocations ejecutado");
          return [
            { id: "1", name: "London", country: "UK" },
            { id: "2", name: "Paris", country: "France" },
          ];
        }),
      },
      settings: {
        useFahrenheit: false,
        autoRefresh: false,
        refreshInterval: 30,
        darkMode: false,
        preferredService: "openweathermap",
      },
      searchHistory: [],
    }),
  };
});

const mockOnLocationSelect = jest.fn();

jest.mock("@/context/WeatherContext", () => {
  const actual = jest.requireActual("@/context/WeatherContext");
  return {
    __esModule: true,
    ...actual,
    useWeather: () => ({
      currentService: {
        searchLocations: jest.fn().mockImplementation(() => {
          return Promise.resolve([
            { id: "1", name: "London", country: "UK" },
            { id: "2", name: "Paris", country: "France" },
          ]);
        }),
      },
      settings: {
        useFahrenheit: false,
        autoRefresh: false,
        refreshInterval: 30,
        darkMode: false,
        preferredService: "openweathermap",
      },
      searchHistory: [
        { name: "Madrid", timestamp: 1234567890 },
        { name: "Berlin", timestamp: 1234567891 },
      ],
    }),
  };
});

describe("LocationAutocomplete", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly in initial state", async () => {
    const { getByPlaceholderText } = await render(
      <LocationAutocomplete onLocationSelect={mockOnLocationSelect} />
    );

    await waitFor(() => {
      expect(getByPlaceholderText("Search location...")).toBeTruthy();
    });
  });

  it("shows loading indicator when loading prop is true", async () => {
    const { getByTestId } = await render(
      <LocationAutocomplete
        onLocationSelect={mockOnLocationSelect}
        loading={true}
      />
    );

    await waitFor(() => {
      expect(getByTestId("loading-indicator")).toBeTruthy();
    });
  });

  it("shows clear button when text is entered", async () => {
    const { getByTestId, getByPlaceholderText } = await render(
      <LocationAutocomplete onLocationSelect={mockOnLocationSelect} />
    );

    const input = getByPlaceholderText("Search location...");
    fireEvent.changeText(input, "London");

    await waitFor(() => {
      expect(getByTestId("clear-button")).toBeTruthy();
    });
  });

  it("shows suggestions container on focus", async () => {
    const { getByTestId, getByPlaceholderText } = await render(
      <LocationAutocomplete onLocationSelect={mockOnLocationSelect} />
    );

    const input = getByPlaceholderText("Search location...");
    fireEvent(input, "focus");

    await waitFor(() => {
      expect(getByTestId("suggestions-container")).toBeTruthy();
    });
  });
});
