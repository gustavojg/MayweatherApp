import React from "react";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useWeather } from "@/context/WeatherContext";
import { getWeatherIcon } from "@/utils/weatherIcons";
import colors from "@/theme/colors";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";

interface Props {
  location: string;
  conditions: string;
}

export function WeatherHeader({ location, conditions }: Props) {
  const { settings } = useWeather();

  return (
    <ThemedView style={styles.header}>
      <ThemedText type="title" testID="weather-location">
        {location}
      </ThemedText>
      <Ionicons
        name={getWeatherIcon(conditions)}
        size={48}
        color={settings.darkMode ? colors.dark.icon : colors.light.icon}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
