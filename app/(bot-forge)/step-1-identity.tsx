import { useWizard } from "@/context/WizardContext";
import { ForgeNavBar } from "@/forge/components/ForgeNavBar";
import { ForgeSection } from "@/forge/components/ForgeSection";
import { Draft } from "@/forge/draft";
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
  const nameSet = state.name.trim().length > 0;
  const canAdvance = state.name.trim().length > 0 && state.frameName !== null;

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
          <ForgeSection
            title="Identity"
            subtitle="Your agents trading personality and strategy"
          >
            <></>
          </ForgeSection>

          <ForgeSection title="Agent Name" subtitle="Name your agent.">
            <Identity
              name={state.name}
              avatarSeed={state.avatarSeed}
              nameFocused={nameFocused}
              nameError={nameError}
              updateField={updateField}
              setNameError={setNameError}
              setNameFocused={setNameFocused}
            />
          </ForgeSection>

          <ForgeSection
            title="Core Strategy"
            subtitle="Your agent's core strategy type"
            tooltip={{
              title: "Personality Frame",
              body: "The strategy type defines your agent's core trading strategy archetype. It sets bounds on all other settings and pre-fills sensible default configurations.",
            }}
            locked={!nameSet}
            lockedMessage="Name your agent first."
          >
            <Frame frameName={state.frameName} selectFrame={selectFrame} />
          </ForgeSection>
        </Pressable>
      </ScrollView>

      <ForgeNavBar onNext={handleNext} nextDisabled={!canAdvance} />
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
