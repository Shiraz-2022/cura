import { Stack } from "expo-router";
import "../global.css";
import { SliderProvider } from "@/contexts/SliderSwitchContext";
import { LocationProvider } from "@/contexts/LocationContext";

export default function RootLayout() {
  return (
    <LocationProvider>
      <SliderProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </SliderProvider>
    </LocationProvider>
  );
}
