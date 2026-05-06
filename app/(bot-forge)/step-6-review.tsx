import { useWizard } from "@/context/WizardContext";
import { ForgeStatPanel } from "@/forge/components/ForgeStatPanel";
import { WizardNavBar } from "@/forge/components/WizardNavBar";
import { Deploy, DeployError } from "@/forge/deploy";
import {
  BrainType,
  CreateBotDocument,
  type CreateBotMutation,
  type CreateBotMutationVariables,
} from "@/generated/graphql";
import { useMutation } from "@apollo/client/react";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

export default function Step6Review() {
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

  function handleClose() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)");
    }
  }

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
            avatarId: state.avatarId || state.name,
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
            },
          },
        },
      });

      const result = data?.createBot;
      if (result?.__typename === "ValidationError") {
        setDeployError({
          kind: "validation",
          message: result.message ?? "Validation failed.",
          field: result.field,
        });
        setDeploying(false);
        return;
      }

      await clearDraft();
      router.replace("/(tabs)/index");
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
      <ForgeStatPanel state={state} name={state.name} onClose={handleClose} />
      <View style={styles.deployContainer}>
        <Deploy
          deploying={deploying}
          canDeploy={canDeploy}
          deployError={deployError}
          handleDeploy={handleDeploy}
        />
      </View>
      <WizardNavBar onBack={() => router.back()} />
    </>
  );
}

const styles = StyleSheet.create({
  deployContainer: {
    padding: 16,
  },
});
