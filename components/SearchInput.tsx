import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/theme/colors";

interface Props {
  query: string;
  setQuery: (text: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  loading?: boolean;
}

export function SearchInput({ query, setQuery, onFocus, onBlur, loading }: Props) {
  return (
    <View style={styles.container}>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search location..."
        editable={!loading}
        onFocus={onFocus}
        onBlur={onBlur}
        style={styles.input}
        placeholderTextColor={colors.light.placeholderText}
      />
      {query.length > 0 && (
        <TouchableOpacity onPress={() => setQuery("")} testID="clear-button" style={styles.clearButton}>
          <Ionicons name="close-circle" size={20} color={colors.light.icon} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.light.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.light.border,
    shadowColor: colors.light.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.light.text,
  },
  clearButton: {
    marginLeft: 8,
  },
});

export default SearchInput;
