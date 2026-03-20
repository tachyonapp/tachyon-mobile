import { apolloClient } from "@/apollo/client";
import { AuthProvider, useAuth } from "@/auth/AuthProvider";
import { ClerkTokenBridge } from "@/auth/clerk-token-bridge";
import { tokenCache } from "@/auth/token-cache";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ApolloProvider } from "@apollo/client/react";
import { ClerkProvider } from "@clerk/clerk-expo";
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
import { AuthLoadingState } from "../components/auth/auth-loading-state";

// Hold the native splash screen until auth check resolves.
SplashScreen.preventAutoHideAsync();

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

/**
 * Inner layout reads auth state and handles routing.
 * Must be inside ClerkProvider + AuthProvider to access useAuth().
 */
function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      // Auth check resolved — hide native splash screen
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    return <AuthLoadingState message="Loading…" />;
  }

  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>

      {/* Navigation guard: redirect unauthenticated users to login */}
      {!isAuthenticated && <Redirect href="/(auth)/login" />}

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
  );
}
