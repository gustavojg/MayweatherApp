import * as React from "react";
import { StyleSheet } from "react-native";
import { ThemedView, ThemedText } from "@/components";
import { Switch } from "react-native";
import { useWeather } from "@/context/WeatherContext";
import colors from "@/theme/colors";

export default function SettingsScreen() {
  const { currentService, setCurrentService, settings, updateSettings } =
    useWeather();

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Weather Service</ThemedText>
        <ThemedView style={styles.serviceOption}>
          <ThemedText>OpenWeather</ThemedText>
          <Switch
            value={currentService.id === "openweathermap"}
            onValueChange={(value) =>
              setCurrentService(value ? "openweathermap" : "weatherapi")
            }
          />
        </ThemedView>
      </ThemedView>
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Units</ThemedText>
        <ThemedView style={styles.row}>
          <ThemedText>Use Fahrenheit</ThemedText>
          <Switch
            value={settings.useFahrenheit}
            onValueChange={(value) => updateSettings({ useFahrenheit: value })}
          />
        </ThemedView>
      </ThemedView>
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Auto Refresh</ThemedText>
        <ThemedView style={styles.row}>
          <ThemedText>Enable Auto Refresh</ThemedText>
          <Switch
            value={settings.autoRefresh}
            onValueChange={(value) => updateSettings({ autoRefresh: value })}
          />
        </ThemedView>
        {settings.autoRefresh && (
          <ThemedView style={styles.refreshIntervals}>
            {[15, 30, 60].map((interval) => (
              <ThemedView
                key={interval}
                style={[
                  styles.intervalOption,
                  settings.refreshInterval === interval &&
                    styles.selectedInterval,
                ]}
                onTouchEnd={() => updateSettings({ refreshInterval: interval })}
              >
                <ThemedText>{interval} min</ThemedText>
              </ThemedView>
            ))}
          </ThemedView>
        )}
      </ThemedView>
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">App Theme</ThemedText>
        <ThemedView style={styles.row}>
          <ThemedText>Dark Mode</ThemedText>
          <Switch
            value={settings.darkMode}
            onValueChange={(value) => updateSettings({ darkMode: value })}
          />
        </ThemedView>
      </ThemedView>
      <ThemedView style={styles.infoSection}>
        <ThemedText style={styles.infoText}>
          Current Service: {currentService.name}
        </ThemedText>
        <ThemedText style={styles.infoText}>
          Auto Refresh:{" "}
          {settings.autoRefresh
            ? `Every ${settings.refreshInterval} minutes`
            : "Disabled"}
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
    gap: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  serviceOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  refreshIntervals: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  intervalOption: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.light.border,
    flex: 1,
    marginHorizontal: 4,
    alignItems: "center",
  },
  selectedInterval: {
    backgroundColor: colors.dark.primary,
  },
  infoSection: {
    marginTop: "auto",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
  },
  infoText: {
    textAlign: "center",
    opacity: 0.7,
    marginBottom: 4,
  },
});
