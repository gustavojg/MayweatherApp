// hooks/useAutoRefresh.ts
import { useEffect, useRef } from "react";
import { useWeather } from "@/context/WeatherContext";

export function useAutoRefresh() {
  const { settings, lastLocation, fetchWeather } = useWeather();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (settings.autoRefresh && lastLocation) {
      intervalRef.current = setInterval(() => {
        fetchWeather(lastLocation);
      }, settings.refreshInterval * 60 * 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [settings.autoRefresh, settings.refreshInterval, lastLocation]);
}
