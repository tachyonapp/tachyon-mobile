import { Colors } from "@/constants/theme";
import { type BotQuery } from "@/generated/graphql";
import { useColorScheme } from "@/hooks/use-color-scheme";

import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Byok } from "./BYOK";
import { FreeTrial } from "./FreeTrial";
import { TachyonHosted } from "./TachyonHosted";

type Agent = NonNullable<BotQuery["bot"]>;

function subscriptionVariant(
  brainType: string | null | undefined,
): "FREE_TRIAL" | "BYOK" | "TACHYON_HOSTED" {
  if (brainType === "BYOK") return "BYOK";
  if (brainType === "TACHYON_HOSTED") return "TACHYON_HOSTED";
  return "FREE_TRIAL";
}

interface SubscriptionProps {
  agent: Agent;
}

export function Subscription({ agent }: SubscriptionProps) {
  const theme = Colors[useColorScheme()];
  const variant = subscriptionVariant(agent.botBrainConfig?.brainType);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={[styles.section, { backgroundColor: theme.surface }]}>
        <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
          BRAIN CONFIG
        </Text>
        {variant === "FREE_TRIAL" && <FreeTrial agent={agent} theme={theme} />}
        {variant === "TACHYON_HOSTED" && (
          <TachyonHosted agent={agent} theme={theme} />
        )}
        {variant === "BYOK" && <Byok agent={agent} theme={theme} />}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 12, paddingBottom: 32 },
  section: {
    borderRadius: 12,
    padding: 16,
    gap: 10,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
});
