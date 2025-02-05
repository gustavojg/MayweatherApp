import { View, ViewProps } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useWeather } from '@/context/WeatherContext';

interface ThemedViewProps extends ViewProps {
  lightBg?: string;
  darkBg?: string;
  transparent?: boolean;
}

export function ThemedView({ 
  style, 
  lightBg,
  darkBg,
  transparent = false,
  ...props 
}: ThemedViewProps) {
  const { colors } = useTheme();
  const { settings } = useWeather();
  
  return (
    <View
      style={[
        {
          backgroundColor: transparent 
            ? 'transparent' 
            : (darkBg && settings.darkMode 
                ? darkBg 
                : lightBg || colors.background),
        },
        style,
      ]}
      {...props}
    />
  );
}