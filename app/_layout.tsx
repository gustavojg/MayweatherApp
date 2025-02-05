import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { WeatherProvider, useWeather } from '@/context/WeatherContext';
import colors from "@/theme/colors";


function AppContent() {
  const { settings } = useWeather();
  const theme = settings.darkMode ? DarkTheme : DefaultTheme;

  const customTheme = {
    ...theme,
    colors: {
      ...theme.colors,
      background: settings.darkMode ? colors.dark.background : colors.light.background,
      text: settings.darkMode ? colors.dark.text : colors.light.text,
      primary: settings.darkMode ? colors.dark.primary : colors.light.primary,
      card: settings.darkMode ? colors.dark.card : colors.light.card,
      border: settings.darkMode ? colors.dark.border : colors.light.border,
    },
  };

  return (
    <ThemeProvider value={customTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style={settings.darkMode ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <WeatherProvider>
      <AppContent />
    </WeatherProvider>
  );
}