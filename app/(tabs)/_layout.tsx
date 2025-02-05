import { Tabs } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useWeather } from '@/context/WeatherContext';
import { getWeatherIcon } from '@/utils/weatherIcons';

export default function TabLayout() {
  const { colors } = useTheme();
  const { weatherData, settings } = useWeather();

  const getTabIcon = () => {
    if (weatherData) {
      const iconName = getWeatherIcon(weatherData.conditions);
      return `${iconName}-outline`;
    }
    return 'cloud-outline';
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: settings.darkMode ? '#666666' : '#999999',
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTintColor: colors.text,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: 'MayWeather',
          tabBarIcon: ({ color, size }) => (
            <Ionicons 
              name={getTabIcon() as any} 
              size={size} 
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons 
              name="settings-outline" 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}