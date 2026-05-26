import { useWizard } from "@/context/WizardContext";
import { ForgeNavBar } from "@/features/agents/forge/components/ForgeNavBar";
import { ForgeSection } from "@/features/agents/forge/components/ForgeSection";
import { ForgeStatPanel } from "@/features/agents/forge/components/ForgeStatPanel";
import {
  BrainType,
  CreateBotDocument,
  type CreateBotMutation,
  type CreateBotMutationVariables,
} from "@/generated/graphql";
import { useMutation } from "@apollo/client/react";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Deploy, DeployError } from "./Deploy";

export default function Deployer() {
  const { state, clearDraft } = useWizard();
  const router = useRouter();

  const [deploying, setDeploying] = useState(false);
  const [deployError, setDeployError] = useState<DeployError | null>(null);

  const [createBot] = useMutation<
    CreateBotMutation,
    CreateBotMutationVariables
  >(CreateBotDocument);

  const canDeploy =
    state.name.trim().length > 0 &&
    !!state.colorway &&
    state.frameName !== null &&
    state.riskAttitude !== null &&
    state.tradeTempo !== null &&
    state.combatPatience !== null &&
    state.sectors.length > 0 &&
    state.exitPersonality !== null &&
    state.stopLossStyle !== null &&
    (state.brain.brainType === BrainType.TachyonHosted ||
      state.brain.apiKey !== null);

  async function handleDeploy() {
    if (deploying) return;
    setDeploying(true);
    setDeployError(null);

    try {
      const { data } = await createBot({
        variables: {
          input: {
            name: state.name,
            frameName: state.frameName!,
            avatarSeed: state.avatarSeed,
            colorway: state.colorway,
            allocationPct: String(state.allocationPct),
            riskAttitude: state.riskAttitude!,
            tradeTempo: state.tradeTempo!,
            combatPatience: state.combatPatience!,
            marketAwareness: state.marketAwareness,
            sectors: state.sectors,
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
              // Feature 8c — only the active provider's variant field is non-null
              openaiModelVariant: state.openaiModelVariant ?? undefined,
              anthropicModelVariant: state.anthropicModelVariant ?? undefined,
              groqModelVariant: state.groqModelVariant ?? undefined,
              geminiModelVariant: state.geminiModelVariant ?? undefined,
            },
            // Feature 8b — advanced customization fields
            signalWeights: state.signalWeights
              ? {
                  technicals: state.signalWeights.technicals,
                  news: state.signalWeights.news,
                  fundamentals: state.signalWeights.fundamentals,
                }
              : undefined,
            confidenceThreshold: state.confidenceThreshold ?? undefined,
            regimeAwareness: state.regimeAwareness ?? undefined,
            earningsBehavior: state.earningsBehavior ?? undefined,
            subSectors:
              state.subSectors.length > 0 ? state.subSectors : undefined,
            customWatchlist:
              state.customWatchlist.length > 0
                ? state.customWatchlist
                : undefined,
            exclusionList:
              state.exclusionList.length > 0 ? state.exclusionList : undefined,
            dividendPreference: state.dividendPreference ?? undefined,
            shortInterestSignal: state.shortInterestSignal ?? undefined,
            positionSizingMethod: state.positionSizingMethod ?? undefined,
            minRrRatio: state.minRrRatio ?? undefined,
            maxDrawdownProtectionPct:
              state.maxDrawdownProtectionPct ?? undefined,
            recoveryMode: state.recoveryMode ?? undefined,
            sessionPreference: state.sessionPreference ?? undefined,
            dayAvoidance:
              state.dayAvoidance.length > 0 ? state.dayAvoidance : undefined,
            volatilityEnvPreference: state.volatilityEnvPreference ?? undefined,
            agentBackground: state.agentBackground || undefined,
            proposalCommunicationStyle:
              state.proposalCommunicationStyle ?? undefined,
            winReaction: state.winReaction ?? undefined,
            lossReaction: state.lossReaction ?? undefined,
          },
        },
      });

      await clearDraft();
      router.replace("/(tabs)");
    } catch (err) {
      const gqlErrors: { extensions?: { code?: string } }[] =
        (err as any)?.graphQLErrors ?? [];
      const rateLimited = gqlErrors.some(
        (e) => e.extensions?.code === "RATE_LIMITED",
      );
      setDeployError(
        rateLimited ? { kind: "rate_limited" } : { kind: "network" },
      );
      setDeploying(false);
    }
  }

  return (
    <>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.scrollContent}
      >
        <ForgeSection
          title="Review"
          subtitle="This is your final agent configuration"
        >
          <></>
        </ForgeSection>
        <ForgeStatPanel state={state} />
        <View>
          <Deploy
            deploying={deploying}
            canDeploy={canDeploy}
            deployError={deployError}
            handleDeploy={handleDeploy}
          />
        </View>
      </ScrollView>

      <ForgeNavBar onBack={() => router.back()} />
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    gap: 28,
    paddingBottom: 16,
  },
});
