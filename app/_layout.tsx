import { apolloClient } from "@/apollo/client";
import { AuthProvider, useAuth } from "@/auth/AuthProvider";
import { ClerkTokenBridge } from "@/auth/clerk-token-bridge";
import { tokenCache } from "@/auth/token-cache";
import { AuthLoadingState } from "@/components/auth/auth-loading-state";
import { BiometricAuthProvider } from "@/auth/BiometricAuthProvider";
import { BiometricLockScreen } from "@/components/auth/BiometricLockScreen";
import { useBiometricAuth } from "@/auth/BiometricAuthProvider";
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
  const { isLoading, isAuthenticated, logout } = useAuth();
  const { isComplete } = useOnboardingState();
  const { isLocked, prompt, disable } = useBiometricAuth(); // isLocked gates RootNavigator output, not the splash

  useEffect(() => {
    // Defer splash hide until Clerk and SecureStore are both resolved.
    // isLocked is intentionally excluded — the BiometricLockScreen is the sole
    // output of RootNavigator when locked, so there is no app content underneath
    // that could flash through. Blocking hideAsync on isLocked caused the splash
    // to stay up indefinitely on cold start when biometrics were enabled.
    if (!isLoading && isComplete !== null) {
      SplashScreen.hideAsync();
    }
  }, [isLoading, isComplete]);

  // Show loading state while Clerk resolves OR while SecureStore read is pending
  if (isLoading || isComplete === null) {
    return <AuthLoadingState message="Loading…" />;
  }

  // Gate authenticated sessions behind biometrics when the user has enabled them.
  // Unauthenticated users (FTUE, auth screens) are never shown the biometric prompt.
  if (isAuthenticated && isLocked) {
    return (
      <BiometricLockScreen
        onPrompt={prompt}
        onFallback={async () => {
          // disable() clears the SecureStore key and sets isLocked=false so the
          // lock screen unmounts cleanly before logout triggers a re-render.
          await disable();
          await logout();
        }}
      />
    );
  }

  // Routing decision tree:
  // 1. Clerk or SecureStore pending          → AuthLoadingState       (early return above)
  // 2. Authenticated + biometrics locked     → BiometricLockScreen    (early return above)
  // 3. Not authenticated                     → auth flow              ((auth)/_layout.tsx guards entry)
  // 4. Authenticated + not onboarded         → FTUE                   (Redirect below)
  // 5. Authenticated + onboarded             → tabs (main app)        (default Stack route)
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
        {/* BiometricAuthProvider must be inside AuthProvider — it calls useAuth()
            to gate the AppState lock on isAuthenticated. A single provider instance
            ensures RootNavigator and settings components share the same state. */}
        <BiometricAuthProvider>
          <ApolloProvider client={apolloClient}>
            <ThemeProvider
              value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
            >
              <RootNavigator />
            </ThemeProvider>
          </ApolloProvider>
        </BiometricAuthProvider>
      </AuthProvider>
    </ClerkProvider>
    </GestureHandlerRootView>
  );
}
