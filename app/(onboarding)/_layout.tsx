import { useOnboardingState } from "@/hooks/use-onboarding-state";
import { Redirect, Stack } from "expo-router";

export default function OnboardingLayout() {
  const { isComplete } = useOnboardingState();

  // Wait for SecureStore read to resolve before making routing decisions
  if (isComplete === null) return null;

  // If user has already completed onboarding, kick them out to the main app
  if (isComplete === true) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="slides" />
    </Stack>
  );
}
