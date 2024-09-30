import { Stack } from "expo-router";

export default function LayoutNotifications() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="detail"
        options={{
          presentation: "modal",
          headerShown: false,
          animation: "slide_from_bottom",
          headerBackButtonMenuEnabled: true,
          gestureEnabled: true,
          gestureDirection: "vertical",
          headerBackVisible: true,
        }}
      />
    </Stack>
  );
}
