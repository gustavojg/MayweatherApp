export const getWeatherIcon = (conditions: string) => {
  const condition = conditions.toLowerCase();
  if (condition.includes("rain")) return "rainy";
  if (condition.includes("snow")) return "snow";
  if (condition.includes("cloud")) return "cloud";
  if (condition.includes("thunder") || condition.includes("storm"))
    return "thunderstorm";
  if (condition.includes("clear") || condition.includes("sun")) return "sunny";
  if (condition.includes("fog") || condition.includes("mist")) return "cloud";
  if (condition.includes("clear") || condition.includes("sun")) return "sunny";
  if (condition.includes("wind")) return "navigate";

  return "partly-sunny";
};
