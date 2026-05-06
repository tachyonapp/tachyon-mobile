import { useWizard } from "@/context/WizardContext";
import { WizardNavBar } from "@/forge/components/WizardNavBar";
import { Brain } from "@/forge/brain";
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
          <Brain
            stopLossSet={stopLossSet}
            brain={state.brain}
            brainCatalog={brainCatalog}
            isKeyValidated={isKeyValidated}
            updateBrain={updateBrain}
            setIsKeyValidated={setIsKeyValidated}
          />
        </Pressable>
      </ScrollView>

      <WizardNavBar
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
