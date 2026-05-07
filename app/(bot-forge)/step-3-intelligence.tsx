import { FRAME_CONFIG } from "@/constants/frameConfig";
import { useWizard } from "@/context/WizardContext";
import { ForgeNavBar } from "@/forge/components/ForgeNavBar";
import { ForgeSection } from "@/forge/components/ForgeSection";
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
          <ForgeSection
            title="Market Behavior"
            subtitle="How your agent interacts with markets"
          >
            <></>
          </ForgeSection>

          <ForgeSection
            title="Intelligence"
            subtitle="Tune your agent's market perception signals."
            tooltip={{
              title: "Market Awareness",
              body: "These weights tune how your agent weighs different market signals. They are independent — they do not need to add up to anything.",
            }}
            locked={!combatComplete}
            lockedMessage="Complete your Trading Profile first."
          >
            <MarketIntelligence
              marketAwareness={state.marketAwareness}
              frameConfig={frameConfig}
              updateField={updateField}
            />
          </ForgeSection>

          <ForgeSection
            title="Sectors"
            subtitle="Select one or more market sectors your agent can trade in."
            locked={!combatComplete}
            lockedMessage="Complete your Trading Profile first."
          >
            <Sectors
              sectors={state.sectors}
              updateField={updateField}
              sectorAttempted={sectorAttempted}
              setSectorAttempted={setSectorAttempted}
            />
          </ForgeSection>
        </Pressable>
      </ScrollView>

      <ForgeNavBar
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
