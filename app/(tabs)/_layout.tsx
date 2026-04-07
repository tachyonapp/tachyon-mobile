import { useAuth } from "@/auth/AuthProvider";
import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ONBOARDING_SYNC_PENDING_KEY } from "@/hooks/use-onboarding-state";
import { CompleteOnboardingDocument, MeDocument } from "@/generated/graphql";
import { useMutation, useQuery } from "@apollo/client/react";
import * as SecureStore from "expo-secure-store";
import { Redirect, Tabs } from "expo-router";
import React, { useEffect } from "react";

export default function TabLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const colorScheme = useColorScheme();
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
      const pending = await SecureStore.getItemAsync(ONBOARDING_SYNC_PENDING_KEY);
      if (pending !== "true") return;

      try {
        await completeOnboarding();
        await SecureStore.deleteItemAsync(ONBOARDING_SYNC_PENDING_KEY);
      } catch {
        console.warn("[completeOnboarding] deferred sync failed, will retry on next launch");
      }
    }

    syncPendingOnboarding();
  }, [meData?.me?.id]);

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
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="gearshape.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
