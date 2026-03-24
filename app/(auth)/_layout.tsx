import { useAuth } from "@/auth/AuthProvider";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Redirect, Stack } from "expo-router";

export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];

  /**
   *  When verifySignIn/verifySignUp calls setActive and Clerk sets the session,
   * isAuthenticated becomes true, the auth layout re-renders, hits the guard,
   * \and redirects to tabs automatically
   *
   */
  if (!isLoading && isAuthenticated) {
    return <Redirect href="/(tabs)" />;
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
