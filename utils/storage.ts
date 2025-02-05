// utils/storage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  SETTINGS: "@weather_app_settings",
  LAST_LOCATION: "@weather_app_last_location",
  SEARCH_HISTORY: "@weather_app_search_history",
} as const;

export async function loadSettings() {
  try {
    const settingsString = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    return settingsString ? JSON.parse(settingsString) : null;
  } catch (error) {
    console.error("Error loading settings:", error);
    return null;
  }
}

export async function saveSettings(settings: any) {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error("Error saving settings:", error);
  }
}

export async function loadSearchHistory() {
  try {
    const historyString = await AsyncStorage.getItem(
      STORAGE_KEYS.SEARCH_HISTORY
    );
    return historyString ? JSON.parse(historyString) : [];
  } catch (error) {
    console.error("Error loading search history:", error);
    return [];
  }
}

export async function saveSearchHistory(history: any[]) {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.SEARCH_HISTORY,
      JSON.stringify(history)
    );
  } catch (error) {
    console.error("Error saving search history:", error);
  }
}

export async function loadLastLocation() {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.LAST_LOCATION);
  } catch (error) {
    console.error("Error loading last location:", error);
    return null;
  }
}

export async function saveLastLocation(location: string) {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_LOCATION, location);
  } catch (error) {
    console.error("Error saving last location:", error);
  }
}
