import * as React from "react";
import { StyleSheet } from "react-native";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { WeatherData } from "@/types/weather";
import { WeatherHeader } from "./WeatherHeader";
import { WeatherTemperature } from "./WeatherTemperature";
import { WeatherDetails } from "./WeatherDetails";

interface Props {
  data: WeatherData;
}

export default function WeatherDisplay({ data }: Props) {
  return (
    <ThemedView style={styles.container}>
      <WeatherHeader location={data.location} conditions={data.conditions} />
      <ThemedView style={styles.details}>
        <WeatherTemperature temperature={data.temperature} />
        <ThemedText type="subtitle" testID="weather-conditions">
          {data.conditions}
        </ThemedText>
        <WeatherDetails humidity={data.humidity} windSpeed={data.windSpeed} />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    gap: 16,
  },
  details: {
    alignItems: "center",
    gap: 8,
  },
});
