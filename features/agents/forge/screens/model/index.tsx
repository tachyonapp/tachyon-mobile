import { useWizard } from "@/context/WizardContext";
import { ForgeNavBar } from "@/features/agents/forge/components/ForgeNavBar";
import { BrainType } from "@/generated/graphql";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Keyboard, Pressable, ScrollView, StyleSheet } from "react-native";
import { Subscription } from "./Subscription";

export default function Model() {
  const { state, updateBrain, brainCatalog, persistDraft } = useWizard();
  const router = useRouter();

  const [isKeyValidated, setIsKeyValidated] = useState(false);

  // const stopLossSet = state.stopLossStyle !== null;

  const canAdvance =
    state.brain.brainType === BrainType.TachyonHosted || isKeyValidated;

  async function handleNext() {
    await persistDraft();
    router.push("/(agent-forge)/step-8-review");
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
          <Subscription
            brain={state.brain}
            brainCatalog={brainCatalog}
            isKeyValidated={isKeyValidated}
            updateBrain={updateBrain}
            setIsKeyValidated={setIsKeyValidated}
            stopLossSet={state.stopLossStyle !== null}
          />
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
