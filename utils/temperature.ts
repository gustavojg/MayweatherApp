export function convertTemperature(celsius: number, useFahrenheit: boolean) {
    return useFahrenheit ? Math.round((celsius * 9) / 5 + 32) : Math.round(celsius);
  }
  