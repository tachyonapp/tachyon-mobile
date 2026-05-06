import { FRAME_CONFIG } from "@/constants/frameConfig";
import { useWizard } from "@/context/WizardContext";
import { WizardNavBar } from "@/forge/components/WizardNavBar";
import { Engagement } from "@/forge/engagement";
import { Exit } from "@/forge/exit";
import { Protections } from "@/forge/protections";
import { BalanceDocument, type BalanceQuery } from "@/generated/graphql";
import { useQuery } from "@apollo/client/react";
import { useRouter } from "expo-router";
import { Keyboard, Pressable, ScrollView, StyleSheet } from "react-native";

export default function Step4Protection() {
  const { state, updateField, persistDraft } = useWizard();
  const router = useRouter();

  const { data: balanceData } = useQuery<BalanceQuery>(BalanceDocument, {
    fetchPolicy: "cache-first",
  });
  const userCashBalance = parseFloat(
    (balanceData?.balance?.cashBalance as string | null | undefined) ?? "0",
  );

  const frameConfig = state.frameName ? FRAME_CONFIG[state.frameName] : null;
  const dailyMaxLossBounds = frameConfig?.bounds.dailyMaxLoss ?? {
    minPct: 0,
    maxPct: 1,
  };

  const isDailyMaxLossValid =
    state.dailyMaxLoss >= dailyMaxLossBounds.minPct &&
    state.dailyMaxLoss <= dailyMaxLossBounds.maxPct;

  const stopLossSet = state.stopLossStyle !== null;

  const canAdvance =
    state.exitPersonality !== null &&
    stopLossSet &&
    isDailyMaxLossValid;

  async function handleNext() {
    await persistDraft();
    router.push("/(bot-forge)/step-5-brain");
  }

  async function handleBack() {
    await persistDraft();
    router.back();
  }

  return (
    <>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.scrollContent}
      >
        <Pressable onPress={() => Keyboard.dismiss()}>
          <Exit
            sectors={state.sectors}
            exitPersonality={state.exitPersonality}
            updateField={updateField}
          />

          <Protections
            frameConfig={frameConfig}
            exitPersonality={state.exitPersonality}
            dailyMaxLoss={state.dailyMaxLoss}
            allocationPct={state.allocationPct}
            userCashBalance={userCashBalance}
            dailyMaxLossBounds={dailyMaxLossBounds}
            dailyMaxGain={state.dailyMaxGain}
            stopLossStyle={state.stopLossStyle}
            emotionalControls={state.emotionalControls}
            updateField={updateField}
          />

          <Engagement
            stopLossSet={stopLossSet}
            rulesOfEngagement={state.rulesOfEngagement}
            updateField={updateField}
          />
        </Pressable>
      </ScrollView>

      <WizardNavBar
        onBack={handleBack}
        onNext={handleNext}
        nextDisabled={!canAdvance}
      />
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
