import React from "react";
import { Image, StyleSheet } from "react-native";
import { useWeather } from "@/context/WeatherContext";

const weatherImages: Record<string, any> = {
  clear: require("@/assets/images/mayweather/happymayweather.webp"),
  sunny: require("@/assets/images/mayweather/happymayweather2.webp"),
  rain: require("@/assets/images/mayweather/rain-mayweather.webp"),
  cloudy: require("@/assets/images/mayweather/sad-mayweather.jpg"),
  fog: require("@/assets/images/mayweather/sad2-mayweather.jpg"),
};

export default function WeatherMood() {
  const { weatherData } = useWeather();

  if (!weatherData) return null;

  // Determinar qué imagen mostrar según la condición del clima
  const getImage = () => {
    const condition = weatherData.conditions.toLowerCase();
    if (condition.includes("rain")) return weatherImages.rain;
    if (condition.includes("cloud") || condition.includes("overcast"))
      return weatherImages.cloudy;
    if (condition.includes("fog") || condition.includes("mist"))
      return weatherImages.fog;
    if (condition.includes("clear")) return weatherImages.clear;
    if (condition.includes("sunny")) return weatherImages.sunny;
    return weatherImages.clear; // Default
  };

  return <Image source={getImage()} style={styles.image} resizeMode="cover" />;
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 350,
    marginTop: 16,
    borderRadius: 10,
  },
});
