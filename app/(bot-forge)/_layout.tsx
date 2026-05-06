import { WizardProvider } from "@/context/WizardContext";
import { MeSubscriptionDocument } from "@/generated/graphql";
import { useQuery } from "@apollo/client/react";
import { Redirect, Stack } from "expo-router";

export default function BotForgeLayout() {
  const { data, loading } = useQuery(MeSubscriptionDocument);

  if (loading) return null;

  if (!data?.me?.subscriptionTier) {
    return (
      <Redirect
        href={{
          pathname: "/(subscription)/tier-selection",
          params: { origin: "bot-forge" },
        }}
      />
    );
  }

  return (
    <WizardProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </WizardProvider>
  );
}
