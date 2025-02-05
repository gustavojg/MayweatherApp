import { StyleSheet } from 'react-native';
import { ThemedView } from './ThemedView';
import { TextInput } from './TextInput';
import { Button } from './Button';
import { useState } from 'react';

interface Props {
  onSearch: (location: string) => void;
  loading?: boolean;
}

export function WeatherInput({ onSearch, loading }: Props) {
  const [location, setLocation] = useState('');

  return (
    <ThemedView style={styles.container}>
      <TextInput
        value={location}
        onChangeText={setLocation}
        placeholder="Enter location"
        style={styles.input}
      />
      <Button
        title="Search"
        onPress={() => onSearch(location)}
        loading={loading}
        disabled={!location.trim() || loading}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  input: {
    height: 40,
    borderRadius: 8,
  },
});
