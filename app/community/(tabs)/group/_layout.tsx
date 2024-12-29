import { Stack } from "expo-router";

export default function GroupLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="CommunityDetails" />
      <Stack.Screen
        name="SelectedDiscussion"
        getId={({ params }) => params?.id}
      />
    </Stack>
  );
}
