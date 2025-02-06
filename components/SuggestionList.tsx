import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/theme/colors";

interface Location {
  id: string;
  name: string;
  state?: string;
  region?: string;
  country: string;
}

interface Props {
  suggestions: Location[];
  searchHistory: { name: string; timestamp: number }[];
  query: string;
  showSuggestions: boolean;
  onSelect: (location: string) => void;
}

export function SuggestionList({
  suggestions,
  searchHistory,
  query,
  showSuggestions,
  onSelect,
}: Props) {
  return (
    <ThemedView testID="suggestions-container">
      {showSuggestions && (
        <ThemedView style={styles.suggestionsContainer}>
          {!query && searchHistory.length > 0 && (
            <React.Fragment>
              <ThemedText style={styles.historyTitle}>
                Recent Searches
              </ThemedText>
              {searchHistory.map((item) => (
                <TouchableOpacity
                  key={item.timestamp}
                  style={styles.suggestionItem}
                  onPress={() => {
                    onSelect(item.name);
                  }}
                  testID={`history-item-${item.name}`}
                >
                  <Ionicons
                    name="time-outline"
                    size={20}
                    color="#666"
                    style={styles.historyIcon}
                  />
                  <ThemedText>{item.name}</ThemedText>
                </TouchableOpacity>
              ))}
            </React.Fragment>
          )}

          {suggestions.length > 0 && (
            <React.Fragment>
              {!query && (
                <ThemedText style={styles.historyTitle}>Suggestions</ThemedText>
              )}
              {suggestions.map((location, index) => {
                return (
                  <TouchableOpacity
                    key={`${location.id}-${location.name}-${index}`}
                    style={styles.suggestionItem}
                    onPress={() => {
                      onSelect(location.name);
                    }}
                    testID={`suggestion-item-${location.name}`}
                  >
                    <Ionicons
                      name="location-outline"
                      size={20}
                      color="#666"
                      style={styles.historyIcon}
                    />
                    <View>
                      <ThemedText>{location.name}</ThemedText>
                      <ThemedText style={styles.countryText}>
                        {[location.state || location.region, location.country]
                          .filter(Boolean)
                          .join(", ")}
                      </ThemedText>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </React.Fragment>
          )}
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  suggestionsContainer: {
    zIndex: 100,
    position: "absolute",
    left: 0,
    right: 0,
    borderRadius: 8,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  historyTitle: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 8,
    paddingHorizontal: 12,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  historyIcon: {
    marginRight: 12,
  },
  countryText: {
    fontSize: 12,
    opacity: 0.7,
  },
});

export default SuggestionList;
