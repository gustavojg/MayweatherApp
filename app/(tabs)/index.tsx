import * as React from "react";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ThemedText,
  ThemedView,
  LocationAutocomplete,
  WeatherDisplay,
} from "@/components";
import { useWeather } from "@/context/WeatherContext";
import { useAutoRefresh } from "@/hooks/useAutoRefresh";
import colors from "@/theme/colors";
import WeatherMood from "@/components/WeatherMood";

export default function WeatherScreen() {
  const insets = useSafeAreaInsets();
  const {
    weatherData,
    fetchWeather,
    isLoading,
    error,
    lastLocation,
    settings,
  } = useWeather();

  useAutoRefresh();

  useEffect(() => {
    if (lastLocation) {
      fetchWeather(lastLocation);
    }
  }, [lastLocation]);

  const handleLocationSelect = async (location: string) => {
    try {
      await fetchWeather(location);
    } catch (error) {
      console.error("WeatherScreen: Error fetching weather:", error);
    }
  };

  return (
    <ThemedView style={styles.mainContainer}>
      <View style={[styles.content, { paddingTop: insets.top }]}>
        <ThemedView style={styles.container}>
          <ThemedText type="title" style={styles.title}>
            May-Weather
          </ThemedText>

          <LocationAutocomplete
            onLocationSelect={handleLocationSelect}
            loading={isLoading}
          />

          {error && <ThemedText style={styles.error}>{error}</ThemedText>}

          {weatherData ? (
            <>
              <WeatherDisplay data={weatherData} />
              <WeatherMood />
            </>
          ) : (
            <ThemedView style={styles.placeholder}>
              <ThemedText type="subtitle">
                {lastLocation
                  ? "Loading weather data..."
                  : "Enter a location to see the weather"}
              </ThemedText>
              {settings.autoRefresh && lastLocation && (
                <ThemedText style={styles.refreshInfo}>
                  Auto-refresh every {settings.refreshInterval} minutes
                </ThemedText>
              )}
            </ThemedView>
          )}
        </ThemedView>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    textAlign: "center",
    marginVertical: 16,
  },
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  error: {
    color: colors.light.error,
    textAlign: "center",
  },
  refreshInfo: {
    marginTop: 8,
    opacity: 0.7,
    fontSize: 12,
  },
});
