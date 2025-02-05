import { useState, useEffect } from "react";
import { useWeather } from "@/context/WeatherContext";
import { debounce } from "lodash";
import { Location } from "@/types/weather";

export function useLocationAutocomplete(
  onLocationSelect: (location: string) => void
) {
  const { currentService, searchHistory } = useWeather();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const searchLocations = debounce(
    async (text: string) => {
      if (!text.trim() || !isFocused) {
        setSuggestions([]);
        return;
      }

      try {
        setIsSearching(true);
        const locations = await currentService.searchLocations(text);
        setSuggestions(locations);
      } catch (error) {
        console.error("Error searching locations:", error);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    },
    process.env.JEST_WORKER_ID ? 0 : 300
  );

  useEffect(() => {
    searchLocations(query);
  }, [query]);

  const handleSelect = (location: string) => {
    setQuery(location);
    setSuggestions([]);
    setShowSuggestions(false);
    setIsFocused(false);
    onLocationSelect(location);
  };

  return {
    query,
    setQuery,
    suggestions,
    isSearching,
    showSuggestions,
    handleFocus: () => {
      setIsFocused(true);
      setShowSuggestions(true);
    },
    handleBlur: () => {
      setTimeout(() => {
        setIsFocused(false);
        setShowSuggestions(false);
      }, 2000);
    },
    handleSelect,
    searchHistory,
  };
}
