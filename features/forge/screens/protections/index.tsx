import { FRAME_CONFIG } from "@/constants/frameConfig";
import { useWizard } from "@/context/WizardContext";
import { ForgeNavBar } from "@/features/forge/components/ForgeNavBar";
import { ForgeSection } from "@/features/forge/components/ForgeSection";
import { BalanceDocument, type BalanceQuery } from "@/generated/graphql";
import { useQuery } from "@apollo/client/react";
import { useRouter } from "expo-router";
import { Keyboard, Pressable, ScrollView, StyleSheet } from "react-native";
import { Engagement } from "./Engagement";
import { Exit } from "./Exit";
import { SafetySystems } from "./SafetySystems";

export default function Protections() {
  const { state, updateField, persistDraft } = useWizard();
  const router = useRouter();
  const sectorsSet = state.sectors.length > 0;

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
  const exitSet = state.exitPersonality !== null;

  const canAdvance =
    state.exitPersonality !== null && stopLossSet && isDailyMaxLossValid;

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
          <ForgeSection
            title="Protections"
            subtitle="Trading safety limits for your agent"
          >
            <></>
          </ForgeSection>

          <ForgeSection
            title="Exit Strategy"
            subtitle="Set how your agent exits positions?"
            tooltip={{
              title: "Exit Personality",
              body: "Exit personality controls when your agent closes a winning position.",
            }}
            locked={!sectorsSet}
            lockedMessage="Select at least one sector first."
          >
            <Exit
              exitPersonality={state.exitPersonality}
              updateField={updateField}
            />
          </ForgeSection>

          <ForgeSection
            title="Daily Loss Limit"
            subtitle="Configure safety limits to protect your allocated capital."
            locked={!exitSet}
            lockedMessage="Choose an exit strategy first."
          >
            <SafetySystems
              frameName={frameConfig?.gamifiedName ?? "your frame"}
              dailyMaxLossPct={state.dailyMaxLoss}
              onDailyMaxLossChange={(v) => updateField("dailyMaxLoss", v)}
              dailyMaxLossBounds={dailyMaxLossBounds}
              allocationPct={state.allocationPct}
              userCashBalance={userCashBalance}
              dailyMaxGain={state.dailyMaxGain}
              onDailyMaxGainChange={(v) => updateField("dailyMaxGain", v)}
              stopLossStyle={state.stopLossStyle}
              onStopLossStyleChange={(v) => updateField("stopLossStyle", v)}
              emotionalControls={state.emotionalControls}
              onEmotionalControlsChange={(v) =>
                updateField("emotionalControls", v)
              }
            />
          </ForgeSection>

          <ForgeSection
            title="Rules of Engagement"
            subtitle="Set the operating rules your agent must follow."
            locked={!stopLossSet}
            lockedMessage="Configure your stop-loss style first."
          >
            <Engagement
              rulesOfEngagement={state.rulesOfEngagement}
              updateField={updateField}
            />
          </ForgeSection>
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
