import { Colors } from "@/constants/theme";
import { type BotQuery } from "@/generated/graphql";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { ModelVariantBadge } from "../../components/ModelVariantBadge";
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
  const [isVariantPickerVisible, setIsVariantPickerVisible] = useState(false);

  const config = agent.botBrainConfig;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Brain Config section */}
      <View style={[styles.section, { backgroundColor: theme.surface }]}>
        <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
          BRAIN CONFIG
        </Text>

        {/* Model variant badge */}
        {config && (
          <ModelVariantBadge
            brainType={config.brainType ?? "FREE_TRIAL"}
            provider={config.provider ?? null}
            modelId={config.modelId ?? null}
            openaiModelVariant={config.openaiModelVariant ?? null}
            anthropicModelVariant={config.anthropicModelVariant ?? null}
            groqModelVariant={config.groqModelVariant ?? null}
            geminiModelVariant={config.geminiModelVariant ?? null}
            onChangePress={
              variant === "BYOK"
                ? () => setIsVariantPickerVisible(true)
                : undefined
            }
          />
        )}

        {variant === "FREE_TRIAL" && <FreeTrial agent={agent} theme={theme} />}
        {variant === "TACHYON_HOSTED" && (
          <TachyonHosted agent={agent} theme={theme} />
        )}
        {variant === "BYOK" && <Byok agent={agent} theme={theme} />}

        {/* Confidence threshold context note */}
        {agent.confidenceThreshold != null && (
          <View style={styles.confidenceNote}>
            <Text style={[styles.confidenceLabel, { color: theme.textSecondary }]}>
              Confidence filter: {agent.confidenceThreshold}
            </Text>
            <Text style={[styles.confidenceBody, { color: theme.textSecondary }]}>
              Your bot only proposes trades that meet this confidence threshold.
            </Text>
          </View>
        )}
      </View>

      {/* TODO Task 12: ModelVariantPicker sheet
        <ModelVariantPicker
          isVisible={isVariantPickerVisible}
          onClose={() => setIsVariantPickerVisible(false)}
          provider={config?.provider as any}
          currentVariant={...}
          mode="management"
          botId={agent.id ?? ""}
        />
      */}
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
  confidenceNote: {
    gap: 2,
    marginTop: 4,
  },
  confidenceLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
  confidenceBody: {
    fontSize: 12,
    fontStyle: "italic",
  },
});
