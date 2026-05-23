import { apolloClient } from "@/apollo/client";
import { AuthProvider, useAuth } from "@/auth/AuthProvider";
import {
  BiometricAuthProvider,
  useBiometricAuth,
} from "@/auth/BiometricAuthProvider";
import { ClerkTokenBridge } from "@/auth/clerk-token-bridge";
import { tokenCache } from "@/auth/token-cache";
import { AuthLoadingState } from "@/components/auth/auth-loading-state";
import { BiometricLockScreen } from "@/components/auth/BiometricLockScreen";
import { AppInitProvider, useAppInit } from "@/context/AppInitContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { OnboardingStateProvider } from "@/context/OnboardingStateContext";
import { ApolloProvider } from "@apollo/client/react";
import { ClerkProvider } from "@clerk/clerk-expo";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

// Hold the native splash screen until AppInitProvider resolves.
SplashScreen.preventAutoHideAsync();

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

/**
 * Purely presentational — renders the correct shell based on state vended
 * by AppInitProvider. All routing decisions live in AppInitContext.
 *
 * The biometric lock screen is rendered as a fullscreen overlay on top of the
 * Stack rather than replacing it. This keeps the Stack mounted at all times so
 * that router.replace() calls in AppInitContext always have a valid target.
 */
function RootNavigator() {
  const { isReady, isAuthenticated, isOnboarded } = useAppInit();
  const { logout } = useAuth();
  const { isInitialized, isLocked, prompt, disable } = useBiometricAuth();

  if (!isReady) {
    return <AuthLoadingState />;
  }

  // Wait for biometric preference hydration before rendering the Stack.
  // Without this the Stack flashes in before we know whether to show the lock.
  if (isAuthenticated && !isInitialized) {
    return <AuthLoadingState />;
  }

  return (
    <View style={styles.root}>
      <Stack>
        {/* Always accessible */}
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />

        {/* Requires authentication */}
        <Stack.Protected guard={isAuthenticated}>
          <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
        </Stack.Protected>

        {/* Requires authentication + completed onboarding */}
        <Stack.Protected guard={isAuthenticated && isOnboarded}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(agent-forge)" options={{ headerShown: false }} />
          <Stack.Screen name="(subscription)" options={{ headerShown: false }} />
          <Stack.Screen name="(agent-detail)" options={{ headerShown: false }} />
        </Stack.Protected>

        <Stack.Screen
          name="modal"
          options={{
            presentation: "modal",
            title: "Modal",
            headerShown: false,
          }}
        />
      </Stack>

      {/* Biometric lock overlay — rendered on top of the Stack so the Stack
          stays mounted. AppState routing fires into the mounted Stack while the
          overlay is visible; when Face ID passes the overlay dismisses and the
          user sees the already-committed (tabs) route underneath. */}
      {isAuthenticated && isLocked && (
        <View style={StyleSheet.absoluteFill}>
          <BiometricLockScreen
            onPrompt={prompt}
            onFallback={async () => {
              await disable();
              await logout();
            }}
          />
        </View>
      )}

      <StatusBar style="auto" />
    </View>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ClerkProvider
        publishableKey={CLERK_PUBLISHABLE_KEY}
        tokenCache={tokenCache}
      >
        <ClerkTokenBridge />
        <AuthProvider>
          <BiometricAuthProvider>
            <ApolloProvider client={apolloClient}>
              <OnboardingStateProvider>
                <ThemeProvider
                  value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
                >
                  <AppInitProvider>
                    <RootNavigator />
                  </AppInitProvider>
                </ThemeProvider>
              </OnboardingStateProvider>
            </ApolloProvider>
          </BiometricAuthProvider>
        </AuthProvider>
      </ClerkProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
