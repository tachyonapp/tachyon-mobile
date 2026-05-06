import { FRAME_CONFIG } from "@/constants/frameConfig";
import { useWizard } from "@/context/WizardContext";
import { WizardNavBar } from "@/forge/components/WizardNavBar";
import { MarketIntelligence } from "@/forge/market";
import { Sectors } from "@/forge/sectors";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Keyboard, Pressable, ScrollView, StyleSheet } from "react-native";

export default function Step3Intelligence() {
  const { state, updateField, persistDraft } = useWizard();
  const router = useRouter();

  const [sectorAttempted, setSectorAttempted] = useState(false);

  const frameConfig = state.frameName ? FRAME_CONFIG[state.frameName] : null;
  const combatComplete =
    !!state.riskAttitude && !!state.tradeTempo && !!state.combatPatience;

  async function handleNext() {
    if (state.sectors.length === 0) {
      setSectorAttempted(true);
      return;
    }
    await persistDraft();
    router.push("/(bot-forge)/step-4-protection");
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
          <MarketIntelligence
            combatComplete={combatComplete}
            marketAwareness={state.marketAwareness}
            frameConfig={frameConfig}
            updateField={updateField}
          />

          <Sectors
            combatComplete={combatComplete}
            sectors={state.sectors}
            updateField={updateField}
            sectorAttempted={sectorAttempted}
            setSectorAttempted={setSectorAttempted}
          />
        </Pressable>
      </ScrollView>

      <WizardNavBar
        onBack={handleBack}
        onNext={handleNext}
        nextDisabled={state.sectors.length === 0}
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
