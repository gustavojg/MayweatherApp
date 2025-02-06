import React from "react";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useWeather } from "@/context/WeatherContext";
import colors from "@/theme/colors";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";

interface Props {
  humidity: number;
  windSpeed: number;
}

export function WeatherDetails({ humidity, windSpeed }: Props) {
  const { settings } = useWeather();
  const iconColor = settings.darkMode ? colors.dark.icon : colors.light.icon;

  return (
    <ThemedView style={styles.row}>
      <ThemedView style={styles.detailItem}>
        <Ionicons
          testID="weather-humidity-icon"
          name="water-outline"
          size={24}
          color={iconColor}
        />
        <ThemedText testID="weather-humidity">{humidity}%</ThemedText>
      </ThemedView>

      <ThemedView style={styles.detailItem}>
        <Ionicons
          testID="weather-wind-speed-icon"
          name="navigate-outline"
          size={24}
          color={iconColor}
        />
        <ThemedText testID="weather-wind-speed">{windSpeed} km/h</ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 16,
  },
  detailItem: {
    alignItems: "center",
    gap: 4,
  },
});
