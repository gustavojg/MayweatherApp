import { TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import colors from "@/theme/colors";
import { ThemedText } from "./ThemedText";

interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary";
}

export function Button({
  title,
  onPress,
  disabled,
  loading,
  variant = "primary",
}: ButtonProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const getBackgroundColor = () => {
    if (disabled) return isDark ? colors.dark.disabled : colors.light.disabled;
    if (variant === "primary")
      return isDark ? colors.dark.primary : colors.light.primary;
    return "transparent";
  };

  const getTextColor = () => {
    if (disabled)
      return isDark ? colors.dark.disabledText : colors.light.disabledText;
    if (variant === "primary")
      return isDark ? colors.light.text : colors.dark.text;
    return isDark ? colors.dark.text : colors.light.text;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor:
            variant === "secondary"
              ? isDark
                ? "#FFFFFF"
                : "#000000"
              : "transparent",
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <ThemedText style={[styles.text, { color: getTextColor() }]}>
          {title}
        </ThemedText>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
});
