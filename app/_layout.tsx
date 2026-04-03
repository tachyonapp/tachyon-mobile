import { apolloClient } from "@/apollo/client";
import { AuthProvider, useAuth } from "@/auth/AuthProvider";
import { ClerkTokenBridge } from "@/auth/clerk-token-bridge";
import { tokenCache } from "@/auth/token-cache";
import { AuthLoadingState } from "@/components/auth/auth-loading-state";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useOnboardingState } from "@/hooks/use-onboarding-state";
import { ApolloProvider } from "@apollo/client/react";
import { ClerkProvider } from "@clerk/clerk-expo";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Redirect, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

// Hold the native splash screen until auth check resolves.
SplashScreen.preventAutoHideAsync();

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

/**
 * Inner layout reads auth state and handles routing.
 * Must be inside ClerkProvider + AuthProvider to access useAuth().
 */
function RootNavigator() {
  const { isLoading, isAuthenticated } = useAuth();
  const { isComplete } = useOnboardingState();

  useEffect(() => {
    // Defer splash hide until Clerk AND SecureStore are both resolved
    if (!isLoading && isComplete !== null) {
      SplashScreen.hideAsync();
    }
  }, [isLoading, isComplete]);

  // Show loading state while Clerk resolves OR while SecureStore read is pending
  if (isLoading || isComplete === null) {
    return <AuthLoadingState message="Loading…" />;
  }

  // Routing decision tree:
  // 1. Not authenticated → auth flow
  // 2. Authenticated + not onboarded → FTUE
  // 3. Authenticated + onboarded → tabs (main app)
  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>

      {isAuthenticated && !isComplete && <Redirect href="/(onboarding)" />}

      <StatusBar style="auto" />
    </>
  );
}

// ClerkProvider must be outermost — all Clerk hooks require it in the tree.
// ClerkTokenBridge wires Clerk's getToken() into the Apollo auth link.
// AuthProvider (our custom context) sits inside ClerkProvider so it can use Clerk hooks.
export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      {/* ClerkTokenBridge calls `useAuth` from `@clerk/clerk-expo`, which requires being inside `ClerkProvider` */}
      <ClerkTokenBridge />
      <AuthProvider>
        <ApolloProvider client={apolloClient}>
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <RootNavigator />
          </ThemeProvider>
        </ApolloProvider>
      </AuthProvider>
    </ClerkProvider>
    </GestureHandlerRootView>
  );
}
