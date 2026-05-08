import { useAuth } from "@/auth/AuthProvider";
import { HapticTab } from "@/components/layout/haptic-tab";
import { HeaderNav } from "@/components/layout/header-nav";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { CompleteOnboardingDocument, MeDocument } from "@/generated/graphql";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ONBOARDING_SYNC_PENDING_KEY } from "@/hooks/use-onboarding-state";
import { useMutation, useQuery } from "@apollo/client/react";
import { Redirect, Tabs } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect } from "react";
import { SafeAreaView, StyleSheet } from "react-native";

export default function TabLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];
  const tabColor = Colors[colorScheme].electricBlue;
  const [completeOnboarding] = useMutation(CompleteOnboardingDocument);

  // Only fetch me query when authenticated — provides the provisioning signal
  const { data: meData } = useQuery(MeDocument, { skip: !isAuthenticated });

  // Fire deferred completeOnboarding mutation once the users row is confirmed to exist.
  // Gated on meData.me.id so the mutation never fires before the Clerk webhook has
  // provisioned the user in the DB (eliminates the webhook race condition).
  useEffect(() => {
    if (!meData?.me?.id) return;

    async function syncPendingOnboarding() {
      const pending = await SecureStore.getItemAsync(
        ONBOARDING_SYNC_PENDING_KEY,
      );
      if (pending !== "true") return;

      try {
        await completeOnboarding();
        await SecureStore.deleteItemAsync(ONBOARDING_SYNC_PENDING_KEY);
      } catch {
        console.warn(
          "[completeOnboarding] deferred sync failed, will retry on next launch",
        );
      }
    }

    syncPendingOnboarding();
  }, [completeOnboarding, meData?.me?.id]);

  if (!isLoading && !isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <HeaderNav navPath="/(tabs)" iconName="add" />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: tabColor,
          tabBarStyle: {
            backgroundColor: theme.background,
            paddingTop: 0,
            paddingBottom: 0,
            height: 40,
          },
          tabBarItemStyle: {
            justifyContent: "center",
            alignItems: "center",
          },
          tabBarIconStyle: {
            marginTop: 10,
          },
          tabBarLabelStyle: {
            marginBottom: 0,
          },
          headerShown: false,
          tabBarButton: HapticTab,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={22} name="robot-outline" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={22} name="gearshape.fill" color={color} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topForgeLogoContainer: { padding: 10 },
  logo: {
    width: 50,
    height: 50,
  },
  safe: { flex: 1 },
});
