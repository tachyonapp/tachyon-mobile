import { SafetySystemsForm } from "@/components/wizard/SafetySystemsForm";
import { WizardProgressBar } from "@/components/wizard/WizardProgressBar";
import { WizardStepAnimation } from "@/components/wizard/WizardStepAnimation";
import { FRAME_CONFIG } from "@/constants/frameConfig";
import { Colors } from "@/constants/theme";
import { useWizard } from "@/context/WizardContext";
import { BalanceDocument, type BalanceQuery } from "@/generated/graphql";
import { useQuery } from "@apollo/client/react";
import { useRouter } from "expo-router";
import React from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const TOTAL_STEPS = 13;

export default function SafetyScreen() {
  const { state, updateField, persistDraft } = useWizard();
  const router = useRouter();

  const { data } = useQuery<BalanceQuery>(BalanceDocument, {
    fetchPolicy: "cache-first",
  });

  const userCashBalance = parseFloat(
    (data?.balance?.cashBalance as string | null | undefined) ?? "0",
  );

  const dailyMaxLossBounds = state.frameName
    ? FRAME_CONFIG[state.frameName].bounds.dailyMaxLoss
    : { minPct: 0, maxPct: 1 };

  const isValid =
    state.dailyMaxLoss >= dailyMaxLossBounds.minPct &&
    state.dailyMaxLoss <= dailyMaxLossBounds.maxPct;

  async function handleNext() {
    await persistDraft();
    router.push("/(bot-wizard)/rules");
  }

  return (
    <SafeAreaView style={styles.safe}>
      <WizardProgressBar currentStep={9} totalSteps={TOTAL_STEPS} />
      <ScrollView contentContainerStyle={styles.content}>
        <WizardStepAnimation source={null} />
        <Text style={styles.title}>{"Set Your bot's Protections"}</Text>
        <Text style={styles.subtitle}>
          Configure safety limits to protect your capital.
        </Text>
        <SafetySystemsForm
          frameName={
            state.frameName
              ? FRAME_CONFIG[state.frameName].gamifiedName
              : "your frame"
          }
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
          onEmotionalControlsChange={(v) => updateField("emotionalControls", v)}
        />
      </ScrollView>
      <View style={styles.footer}>
        <Pressable
          onPress={handleNext}
          disabled={!isValid}
          style={[styles.nextBtn, !isValid && styles.nextBtnDisabled]}
        >
          <Text style={styles.nextBtnLabel}>Next</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.dark.background },
  content: { padding: 16, gap: 16 },
  title: {
    color: Colors.dark.textPrimary,
    fontSize: 22,
    fontWeight: "700",
  },
  subtitle: { color: Colors.dark.textSecondary, fontSize: 14 },
  footer: { padding: 16, paddingBottom: 32 },
  nextBtn: {
    height: 52,
    borderRadius: 10,
    backgroundColor: Colors.dark.electricBlue,
    justifyContent: "center",
    alignItems: "center",
  },
  nextBtnDisabled: { opacity: 0.35 },
  nextBtnLabel: {
    color: Colors.dark.textPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
});
