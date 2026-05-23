import { useWizard } from "@/context/WizardContext";
import { ForgeNavBar } from "@/features/agents/forge/components/ForgeNavBar";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Keyboard, Pressable, ScrollView, StyleSheet } from "react-native";
import { Awareness } from "./Awareness";
import { Confidence } from "./Confidence";
import { Earnings } from "./Earnings";
import { SignalWeights } from "./SignalWeights";

export default function Intelligence() {
  const { state, updateField, persistDraft, signalWeightsValid } = useWizard();
  const router = useRouter();
  const [dismissedAdvisories, setDismissedAdvisories] = useState<string[]>([]);

  const visibleAdvisories = state.activeAdvisories.filter(
    (a) => !dismissedAdvisories.includes(a.code),
  );

  const handleDismiss = (code: string) => {
    setDismissedAdvisories((prev) => [...prev, code]);
  };

  async function handleNext() {
    await persistDraft();
    router.push("/(agent-forge)/step-4-sectors");
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
          <SignalWeights
            signalWeights={state.signalWeights}
            signalWeightsValid={signalWeightsValid}
            updateField={updateField}
            handleDismiss={handleDismiss}
            visibleAdvisories={visibleAdvisories}
          />

          <Confidence
            confidenceThreshold={state.confidenceThreshold}
            visibleAdvisories={visibleAdvisories}
            updateField={updateField}
            handleDismiss={handleDismiss}
          />

          <Awareness
            visibleAdvisories={visibleAdvisories}
            regimeAwareness={state.regimeAwareness}
            updateField={updateField}
            handleDismiss={handleDismiss}
          />

          <Earnings
            visibleAdvisories={visibleAdvisories}
            earningsBehavior={state.earningsBehavior}
            updateField={updateField}
            handleDismiss={handleDismiss}
          />
        </Pressable>
      </ScrollView>

      <ForgeNavBar
        onBack={handleBack}
        onNext={handleNext}
        nextDisabled={!signalWeightsValid}
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
