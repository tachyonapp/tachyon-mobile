import { FRAME_CONFIG } from "@/constants/frameConfig";
import { useWizard } from "@/context/WizardContext";
import { ForgeNavBar } from "@/features/agents/forge/components/ForgeNavBar";
import { ForgeSection } from "@/features/agents/forge/components/ForgeSection";
import { Draft } from "@/features/agents/forge/draft";
import { BotFrame } from "@/generated/graphql";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { FrameCard } from "./FrameCard";
import { IdentityForm } from "./IdentityForm";

const FRAMES = Object.values(BotFrame);

export default function IdentityScreen() {
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
            <IdentityForm
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
            <View style={styles.frameGrid}>
              {FRAMES.map((frame) => (
                <View key={frame} style={styles.frameCardWrapper}>
                  <FrameCard
                    frame={FRAME_CONFIG[frame]}
                    selected={state.frameName === frame}
                    onSelect={() => selectFrame(frame)}
                  />
                </View>
              ))}
            </View>
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
  frameGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  frameCardWrapper: {
    width: "48%",
  },
});
