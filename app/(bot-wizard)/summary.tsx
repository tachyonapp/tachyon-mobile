import { WizardProgressBar } from "@/components/wizard/WizardProgressBar";
import { WizardSummaryCard } from "@/components/wizard/WizardSummaryCard";
import { Colors } from "@/constants/theme";
import { useWizard } from "@/context/WizardContext";
import {
  BalanceDocument,
  BrainType,
  CreateBotDocument,
  type BalanceQuery,
  type CreateBotMutation,
  type CreateBotMutationVariables,
} from "@/generated/graphql";
import { useMutation, useQuery } from "@apollo/client/react";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const TOTAL_STEPS = 13;

type ErrorState =
  | { kind: "validation"; message: string; field?: string | null }
  | { kind: "network" }
  | { kind: "rate_limited" };

export default function SummaryScreen() {
  const { state, clearDraft } = useWizard();
  const router = useRouter();
  const [deploying, setDeploying] = useState(false);
  const [error, setError] = useState<ErrorState | null>(null);

  const { data: balanceData } = useQuery<BalanceQuery>(BalanceDocument, {
    fetchPolicy: "cache-first",
  });

  const userCashBalance = parseFloat(
    (balanceData?.balance?.cashBalance as string | null | undefined) ?? "0",
  );

  const isKeyValidated =
    state.brain.brainType === BrainType.TachyonHosted ||
    state.brain.apiKey !== null;

  const [createBot] = useMutation<
    CreateBotMutation,
    CreateBotMutationVariables
  >(CreateBotDocument);

  async function handleDeploy() {
    if (deploying) return;
    setDeploying(true);
    setError(null);

    try {
      const { data, error: mutationError } = await createBot({
        variables: {
          input: {
            name: state.name,
            frameName: state.frameName!,
            avatarId: state.avatarId,
            colorway: state.colorway,
            allocationPct: String(state.allocationPct),
            riskAttitude: state.riskAttitude!,
            tradeTempo: state.tradeTempo!,
            combatPatience: state.combatPatience!,
            marketAwareness: state.marketAwareness,
            sectors: state.sectors as any,
            exitPersonality: state.exitPersonality!,
            stopLossStyle: state.stopLossStyle!,
            dailyMaxLossPct: String(state.dailyMaxLoss),
            dailyMaxGain:
              state.dailyMaxGain !== null
                ? String(state.dailyMaxGain)
                : undefined,
            emotionalControls: state.emotionalControls,
            rulesOfEngagement: state.rulesOfEngagement,
            brain: {
              brainType: state.brain.brainType,
              modelId: state.brain.modelId,
              provider: state.brain.provider,
              apiKey: state.brain.apiKey ?? undefined,
            },
          },
        },
      });

      // Apollo-level error (network or GraphQL errors)
      if (mutationError) {
        const gqlErrors: { extensions?: { code?: string } }[] =
          (mutationError as any).graphQLErrors ?? [];
        const rateLimited = gqlErrors.some(
          (e) => e.extensions?.code === "RATE_LIMITED",
        );
        setError(rateLimited ? { kind: "rate_limited" } : { kind: "network" });
        setDeploying(false);
        return;
      }

      const result = data?.createBot;

      if (result?.__typename === "ValidationError") {
        setError({
          kind: "validation",
          message: result.message ?? "Validation failed.",
          field: result.field,
        });
        setDeploying(false);
        return;
      }

      // Success
      await clearDraft();
      router.replace("/(tabs)/bots");
    } catch {
      setError({ kind: "network" });
      setDeploying(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <WizardProgressBar currentStep={13} totalSteps={TOTAL_STEPS} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Ready to Deploy</Text>

        <WizardSummaryCard
          state={state}
          userCashBalance={userCashBalance}
          isKeyValidated={isKeyValidated}
        />

        {/* Compliance copy — required, non-negotiable */}
        <View style={styles.complianceBox}>
          <Text style={styles.complianceText}>
            Your bot will propose trades, but every trade requires your approval
            before it executes. Nothing trades without your say-so.
          </Text>
        </View>

        {/* Zero-balance funding reminder */}
        {userCashBalance === 0 && (
          <Text style={styles.fundingReminder}>
            {"Don't forget to fund your account before your bot can trade."}
          </Text>
        )}

        {/* Error states */}
        {error?.kind === "validation" && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error.message}</Text>
            {error.field && (
              <Text style={styles.errorHint}>
                {`Check the field "${error.field}" above and tap Edit to fix it.`}
              </Text>
            )}
          </View>
        )}
        {error?.kind === "network" && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>
              Something went wrong — try again.
            </Text>
          </View>
        )}
        {error?.kind === "rate_limited" && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>
              Too many attempts — please wait before trying again.
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          onPress={handleDeploy}
          disabled={deploying}
          style={[styles.deployBtn, deploying && styles.deployBtnDisabled]}
        >
          {deploying ? (
            <ActivityIndicator size="small" color={Colors.dark.textPrimary} />
          ) : (
            <Text style={styles.deployBtnLabel}>Deploy Bot</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.dark.background },
  content: { padding: 16, gap: 16, paddingBottom: 8 },
  title: {
    color: Colors.dark.textPrimary,
    fontSize: 22,
    fontWeight: "700",
  },

  // Compliance
  complianceBox: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 8,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: Colors.dark.electricBlue,
  },
  complianceText: {
    color: Colors.dark.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },

  // Funding reminder
  fundingReminder: {
    color: Colors.dark.warning,
    fontSize: 13,
    lineHeight: 18,
  },

  // Errors
  errorBox: {
    backgroundColor: "rgba(214, 69, 69, 0.1)",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.dark.danger,
    gap: 4,
  },
  errorText: {
    color: Colors.dark.danger,
    fontSize: 13,
    fontWeight: "600",
  },
  errorHint: {
    color: Colors.dark.textSecondary,
    fontSize: 12,
  },

  // Footer
  footer: { padding: 16, paddingBottom: 32 },
  deployBtn: {
    height: 52,
    borderRadius: 10,
    backgroundColor: Colors.dark.electricBlue,
    justifyContent: "center",
    alignItems: "center",
  },
  deployBtnDisabled: { opacity: 0.5 },
  deployBtnLabel: {
    color: Colors.dark.textPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
});
