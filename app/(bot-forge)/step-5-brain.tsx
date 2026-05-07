import { useWizard } from "@/context/WizardContext";
import { Brain } from "@/forge/brain";
import { ForgeNavBar } from "@/forge/components/ForgeNavBar";
import { ForgeSection } from "@/forge/components/ForgeSection";
import { BrainType } from "@/generated/graphql";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Keyboard, Pressable, ScrollView, StyleSheet } from "react-native";

export default function Step5Brain() {
  const { state, updateBrain, brainCatalog, persistDraft } = useWizard();
  const router = useRouter();

  const [isKeyValidated, setIsKeyValidated] = useState(false);

  const stopLossSet = state.stopLossStyle !== null;

  const canAdvance =
    state.brain.brainType === BrainType.TachyonHosted || isKeyValidated;

  async function handleNext() {
    await persistDraft();
    router.push("/(bot-forge)/step-6-review");
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
            title="AI Model"
            subtitle="Your agent uses AI to analyze and interact with markets, reason about its trading as well as explain and propose trades to you — No trade execute without your explicit approval."
            locked={!stopLossSet}
            lockedMessage="Set your protections first."
          >
            <Brain
              brain={state.brain}
              brainCatalog={brainCatalog}
              isKeyValidated={isKeyValidated}
              updateBrain={updateBrain}
              setIsKeyValidated={setIsKeyValidated}
            />
          </ForgeSection>
        </Pressable>
      </ScrollView>

      <ForgeNavBar
        onBack={handleBack}
        onNext={handleNext}
        nextDisabled={!canAdvance}
        nextLabel="Review"
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
