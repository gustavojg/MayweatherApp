import * as React from "react";
import { ThemedView } from "./ThemedView";
import { ActivityIndicator } from "react-native";
import { useLocationAutocomplete } from "@/hooks/useLocationAutocomplete";
import { SearchInput } from "./SearchInput";
import { SuggestionList } from "./SuggestionList";

interface Props {
  onLocationSelect: (location: string) => void;
  loading?: boolean;
}

export default function LocationAutocomplete({
  onLocationSelect,
  loading,
}: Props) {
  const {
    query,
    setQuery,
    suggestions,
    isSearching,
    showSuggestions,
    handleFocus,
    handleBlur,
    handleSelect,
    searchHistory,
  } = useLocationAutocomplete(onLocationSelect);

  return (
    <ThemedView>
      <SearchInput
        query={query}
        setQuery={setQuery}
        onFocus={handleFocus}
        onBlur={handleBlur}
        loading={loading}
      />

      {showSuggestions && (
        <SuggestionList
          query={query}
          suggestions={suggestions}
          searchHistory={searchHistory}
          showSuggestions={showSuggestions}
          onSelect={handleSelect}
        />
      )}
      {(isSearching || loading) && (
        <ThemedView>
          <ActivityIndicator size="small" testID="loading-indicator" />
        </ThemedView>
      )}
    </ThemedView>
  );
}
