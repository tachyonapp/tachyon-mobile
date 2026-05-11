import { useAuth } from "@/auth/AuthProvider";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useOnboardingState } from "@/hooks/use-onboarding-state";
import { Redirect, Stack } from "expo-router";

export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const { isComplete } = useOnboardingState();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];

  if (!isLoading && isAuthenticated) {
    // Wait for SecureStore to resolve before deciding where to send an
    // authenticated user — routing before isComplete resolves would send
    // every new sign-up to /(tabs), skipping FTUE entirely.
    if (isComplete === null) return null;
    return <Redirect href={isComplete ? "/(tabs)" : "/(onboarding)"} />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.background },
        animation: "fade",
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="verify" />
    </Stack>
  );
}
