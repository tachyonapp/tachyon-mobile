import { useAuth } from "@/auth/AuthProvider";
import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ONBOARDING_SYNC_PENDING_KEY } from "@/hooks/use-onboarding-state";
import { CompleteOnboardingDocument } from "@/generated/graphql";
import { useMutation } from "@apollo/client/react";
import * as SecureStore from "expo-secure-store";
import { Redirect, Tabs } from "expo-router";
import React, { useEffect } from "react";

export default function TabLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const colorScheme = useColorScheme();
  const tabColor = Colors[colorScheme].electricBlue;
  const [completeOnboarding] = useMutation(CompleteOnboardingDocument);

  // Fire deferred completeOnboarding mutation for users who completed FTUE before signing up
  useEffect(() => {
    async function syncPendingOnboarding() {
      const pending = await SecureStore.getItemAsync(ONBOARDING_SYNC_PENDING_KEY);
      if (pending !== "true") return;

      try {
        await completeOnboarding();
        await SecureStore.deleteItemAsync(ONBOARDING_SYNC_PENDING_KEY);
      } catch (err) {
        console.error("[completeOnboarding] deferred sync failed:", err);
        // Flag remains set — will retry on next app launch
      }
    }

    syncPendingOnboarding();
  }, []);

  if (!isLoading && !isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tabColor,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
