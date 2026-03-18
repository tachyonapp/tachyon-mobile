import { ApolloProvider } from "@apollo/client/react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { apolloClient } from "@/apollo/client";
import { Auth0Provider } from "@/auth/Auth0Provider";
import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = {
  anchor: "(tabs)",
};

// Auth0Provider must be outermost — Apollo link chain reads credentials via
// react-native-auth0 directly (not via context), so ordering here is for
// future hooks/components that consume both providers.
export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <Auth0Provider>
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
    </Auth0Provider>
  );
}
