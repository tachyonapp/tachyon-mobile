import { useAuth } from "@/auth/AuthProvider";
import { useOnboardingState } from "@/hooks/use-onboarding-state";
import { Redirect, Stack } from "expo-router";

export default function OnboardingLayout() {
  const { isAuthenticated } = useAuth();
  const { isComplete } = useOnboardingState();

  // Wait for SecureStore read to resolve before making routing decisions
  if (isComplete === null) return null;

  // Completed FTUE but not signed up → auth flow
  if (isComplete === true && !isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  // Completed FTUE and signed in → main app
  if (isComplete === true && isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="slides" />
    </Stack>
  );
}
