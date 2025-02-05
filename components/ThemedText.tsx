import { Text, TextProps, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";

interface ThemedTextProps extends TextProps {
  type?: "default" | "title" | "subtitle" | "defaultSemiBold" | "bigText";
  lightColor?: string;
  darkColor?: string;
}

export function ThemedText({
  style,
  type = "default",
  lightColor,
  darkColor,
  ...props
}: ThemedTextProps) {
  const { colors } = useTheme();

  return (
    <Text
      style={[
        styles[type],
        {
          color: lightColor || colors.text,
        },
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    fontFamily: "System",
  },
  defaultSemiBold: {
    fontSize: 16,
    fontFamily: "System",
    fontWeight: "600",
  },
  title: {
    fontSize: 24,
    fontFamily: "System",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 20,
    fontFamily: "System",
    fontWeight: "600",
  },
  bigText: {
    fontSize: 50,
    fontFamily: "System",
    fontWeight: "bold",
  },
});
