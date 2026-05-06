import { useWizard } from "@/context/WizardContext";
import { Draft } from "@/forge/draft";
import { WizardNavBar } from "@/forge/components/WizardNavBar";
import { Frame } from "@/forge/frame";
import { Identity } from "@/forge/identity";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Keyboard, Pressable, ScrollView, StyleSheet } from "react-native";

export default function Step1Identity() {
  const {
    state,
    selectFrame,
    updateField,
    persistDraft,
    draftPrompt,
    resumeDraft,
    startFresh,
  } = useWizard();
  const router = useRouter();

  const [nameFocused, setNameFocused] = useState(false);
  const [nameError, setNameError] = useState(false);

  const canAdvance =
    state.name.trim().length > 0 && state.frameName !== null;

  async function handleNext() {
    if (!state.name.trim()) {
      setNameError(true);
      return;
    }
    await persistDraft();
    router.push("/(bot-forge)/step-2-combat");
  }

  return (
    <>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.scrollContent}
      >
        <Pressable onPress={() => Keyboard.dismiss()}>
          {draftPrompt === "resume-or-fresh" && (
            <Draft resumeDraft={resumeDraft} startFresh={startFresh} />
          )}

          <Identity
            name={state.name}
            nameFocused={nameFocused}
            nameError={nameError}
            updateField={updateField}
            setNameError={setNameError}
            setNameFocused={setNameFocused}
          />

          <Frame
            name={state.name}
            frameName={state.frameName}
            selectFrame={selectFrame}
          />
        </Pressable>
      </ScrollView>

      <WizardNavBar
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
