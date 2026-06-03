import { useWizard } from "@/context/WizardContext";
import { ForgeNavBar } from "@/features/agents/forge/components/ForgeNavBar";
import { ForgeSection } from "@/features/agents/forge/components/ForgeSection";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Avoidance } from "./Avoidance";
import { Session } from "./Session";
import { Volatility } from "./Volatility";

export default function Timing() {
  const { state, updateField, persistDraft, hasActiveTradingDay } = useWizard();
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
    router.push("/(agent-forge)/step-7-model");
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
        <ForgeSection title="Timing" subtitle="Timing settings for your agent">
          <></>
        </ForgeSection>

        {/* Session Preference */}
        <Session
          sessionPreference={state.sessionPreference}
          visibleAdvisories={visibleAdvisories}
          updateField={updateField}
          handleDismiss={handleDismiss}
        />

        {/* Day Avoidance */}
        <Avoidance
          visibleAdvisories={visibleAdvisories}
          dayAvoidance={state.dayAvoidance}
          hasActiveTradingDay={hasActiveTradingDay}
          updateField={updateField}
          handleDismiss={handleDismiss}
        />

        {/* Volatility Environment Preference */}
        <Volatility
          visibleAdvisories={visibleAdvisories}
          volatilityEnvPreference={state.volatilityEnvPreference}
          updateField={updateField}
          handleDismiss={handleDismiss}
        />
      </ScrollView>

      <ForgeNavBar
        onBack={handleBack}
        onNext={handleNext}
        nextDisabled={!hasActiveTradingDay}
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
