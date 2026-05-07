import { Colors } from "@/constants/theme";
import { SubscriptionStatus, SubscriptionTier } from "@/generated/graphql";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface Props {
  subscriptionTier: SubscriptionTier | null | undefined;
  subscriptionStatus: SubscriptionStatus | null | undefined;
  onCreateBot: () => void;
}

function ctaLabel(
  tier: SubscriptionTier | null | undefined,
  status: SubscriptionStatus | null | undefined,
): string {
  if (tier == null) return "Get Started";
  if (
    status === SubscriptionStatus.Suspended ||
    status === SubscriptionStatus.Cancelled
  ) {
    return "Reactivate Subscription";
  }
  return "Create Agent";
}

export function EmptyBotListState({
  subscriptionTier,
  subscriptionStatus,
  onCreateBot,
}: Props) {
  const theme = Colors[useColorScheme()];

  return (
    <View style={styles.container}>
      <Text style={[styles.headline, { color: theme.textPrimary }]}>
        No agents yet
      </Text>
      <Text style={[styles.subtext, { color: theme.textSecondary }]}>
        Build your first agent to start receiving trade proposals.
      </Text>
      <Pressable
        style={({ pressed }) => [
          styles.cta,
          { backgroundColor: theme.electricBlue },
          pressed && styles.ctaPressed,
        ]}
        onPress={onCreateBot}
      >
        <Text style={[styles.ctaText, { color: theme.textPrimary }]}>
          {ctaLabel(subscriptionTier, subscriptionStatus)}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    gap: 12,
  },
  headline: {
    fontSize: 24,
    fontWeight: "700",
  },
  subtext: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  cta: {
    marginTop: 8,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  ctaPressed: {
    opacity: 0.8,
  },
  ctaText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
