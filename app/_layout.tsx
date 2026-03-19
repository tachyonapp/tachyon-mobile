import { apolloClient } from "@/apollo/client";
import { AuthProvider } from "@/auth/AuthProvider";
import { tokenCache } from "@/auth/token-cache";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ApolloProvider } from "@apollo/client/react";
import { ClerkProvider } from "@clerk/clerk-expo";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

export const unstable_settings = {
  anchor: "(tabs)",
};

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
      <AuthProvider>
        <ApolloProvider client={apolloClient}>
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="modal"
                options={{ presentation: "modal", title: "Modal" }}
              />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </ApolloProvider>
      </AuthProvider>
    </ClerkProvider>
  );
}
