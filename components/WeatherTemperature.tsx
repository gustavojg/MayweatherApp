import React from "react";
import { ThemedText } from "./ThemedText";
import { useWeather } from "@/context/WeatherContext";
import { convertTemperature } from "@/utils/temperature";

interface Props {
  temperature: number;
}

export function WeatherTemperature({ temperature }: Props) {
  const { settings } = useWeather();
  const convertedTemp = convertTemperature(temperature, settings.useFahrenheit);
  const unit = settings.useFahrenheit ? "°F" : "°C";

  return (
    <ThemedText type="bigText" testID="weather-temperature">
      {convertedTemp}
      {unit}
    </ThemedText>
  );
}
