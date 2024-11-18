import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack  screenOptions={{
    headerShown: false, // Desativa o cabeçalho
  }} />;
}
