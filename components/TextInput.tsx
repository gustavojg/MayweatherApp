import { TextInput as RNTextInput, TextInputProps, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';

interface ThemedTextInputProps extends TextInputProps {
  error?: boolean;
}

export function TextInput({ 
  style, 
  error,
  ...props 
}: ThemedTextInputProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  return (
    <RNTextInput
      style={[
        styles.input,
        {
          backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5',
          color: isDark ? '#FFFFFF' : '#000000',
          borderColor: error ? '#FF4444' : isDark ? '#404040' : '#E0E0E0',
        },
        style,
      ]}
      placeholderTextColor={isDark ? '#808080' : '#A0A0A0'}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
});