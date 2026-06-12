import { useWizard } from "@/context/WizardContext";
import { ForgeNavBar } from "@/features/agents/forge/components/ForgeNavBar";
import { ForgeSection } from "@/features/agents/forge/components/ForgeSection";
import { BalanceDocument, type BalanceQuery } from "@/generated/graphql";
import { useQuery } from "@apollo/client/react";
import { FRAME_CONFIG } from "@tachyonapp/tachyon-queue-types/config";
import { useRouter } from "expo-router";
import { Keyboard, Pressable, ScrollView, StyleSheet } from "react-native";
import { Engagement } from "./Engagement";
import { Exit } from "./Exit";
import { SafetySystems } from "./SafetySystems";

export default function Protections() {
  const { state, updateField, persistDraft } = useWizard();
  const router = useRouter();

  const { data: balanceData } = useQuery<BalanceQuery>(BalanceDocument, {
    fetchPolicy: "cache-first",
  });
  const userCashBalance = parseFloat(
    (balanceData?.balance?.cashBalance as string | null | undefined) ?? "0",
  );

  const frameConfig = state.frameName ? FRAME_CONFIG[state.frameName] : null;
  const dailyMaxLossBounds = { minPct: 0.01, maxPct: 0.25 };

  const isDailyMaxLossValid =
    state.dailyMaxLoss >= dailyMaxLossBounds.minPct &&
    state.dailyMaxLoss <= dailyMaxLossBounds.maxPct;

  const stopLossSet = state.stopLossStyle !== null;

  const canAdvance =
    state.exitPersonality !== null && stopLossSet && isDailyMaxLossValid;

  async function handleNext() {
    await persistDraft();
    router.push("/(agent-forge)/step-6-timing");
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
          <ForgeSection
            title="Protections"
            subtitle="Trading safety limits for your agent"
          >
            <></>
          </ForgeSection>

          <Exit
            exitPersonality={state.exitPersonality}
            updateField={updateField}
            sectorsSet={state.sectors.length > 0}
          />

          <SafetySystems
            frameName={frameConfig?.gamifiedName ?? "your frame"}
            dailyMaxLossPct={state.dailyMaxLoss}
            onDailyMaxLossChange={(v) => updateField("dailyMaxLoss", v)}
            dailyMaxLossBounds={dailyMaxLossBounds}
            capitalAllocatedUsd={state.capitalAllocatedUsd}
            userCashBalance={userCashBalance}
            dailyMaxGain={state.dailyMaxGain}
            onDailyMaxGainChange={(v) => updateField("dailyMaxGain", v)}
            stopLossStyle={state.stopLossStyle}
            onStopLossStyleChange={(v) => updateField("stopLossStyle", v)}
            emotionalControls={state.emotionalControls}
            onEmotionalControlsChange={(v) =>
              updateField("emotionalControls", v)
            }
            exitSet={state.exitPersonality !== null}
          />

          <Engagement
            rulesOfEngagement={state.rulesOfEngagement}
            updateField={updateField}
            stopLossSet={stopLossSet}
          />
        </Pressable>
      </ScrollView>

      <ForgeNavBar
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
