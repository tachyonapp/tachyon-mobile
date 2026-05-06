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
import { ApolloProvider } from "@apollo/client/react";
import { ClerkProvider } from "@clerk/clerk-expo";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

// Hold the native splash screen until AppInitProvider resolves.
SplashScreen.preventAutoHideAsync();

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

/**
 * Renders the loading screen until AppInitProvider has finished resolving
 * auth state, selected the correct initial route, and hidden the splash.
 * Once ready, mounts the Stack — which renders with the correct route
 * already committed, so no stale navigation state can flash through.
 */
function RootNavigator() {
  const { isReady } = useAppInit();
  const { isAuthenticated, logout } = useAuth();
  const { isInitialized, isLocked, prompt, disable } = useBiometricAuth();
  const segments = useSegments();
  const router = useRouter();
  const inAuthGroup = segments[0] === "(auth)";

  // Ongoing logout — fires when the user signs out while the app is open.
  useEffect(() => {
    if (!isReady) return;
    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/login");
    }
  }, [inAuthGroup, isAuthenticated, isReady, router]);

  if (!isReady) {
    return <AuthLoadingState />;
  }

  // Prevent route-group content from rendering before biometric preference
  // hydration completes. Otherwise protected routes can flash before lock.
  if (isAuthenticated && !isInitialized) {
    return <AuthLoadingState />;
  }

  if (isAuthenticated && isLocked) {
    return (
      <BiometricLockScreen
        onPrompt={prompt}
        onFallback={async () => {
          await disable();
          await logout();
        }}
      />
    );
  }

  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
        <Stack.Screen name="(bot-forge)" options={{ headerShown: false }} />
        <Stack.Screen name="(subscription)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style="auto" />
    </>
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
              <ThemeProvider
                value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
              >
                <AppInitProvider>
                  <RootNavigator />
                </AppInitProvider>
              </ThemeProvider>
            </ApolloProvider>
          </BiometricAuthProvider>
        </AuthProvider>
      </ClerkProvider>
    </GestureHandlerRootView>
  );
}
