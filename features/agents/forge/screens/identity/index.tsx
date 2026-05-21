import { AgentAvatar } from "@/components/shared/AgentAvatar";
import { Colors } from "@/constants/theme";
import { useWizard } from "@/context/WizardContext";
import { ForgeNavBar } from "@/features/agents/forge/components/ForgeNavBar";
import { ForgeSection } from "@/features/agents/forge/components/ForgeSection";
import {
  LOSS_REACTIONS,
  ReactionPicker,
  WIN_REACTIONS,
} from "@/features/agents/forge/components/ReactionPicker";
import { Draft } from "@/features/agents/forge/draft";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Background } from "./Background";
import { Communication } from "./Communication";
import { IdentityForm } from "./IdentityForm";
import { Strategy } from "./Strategy";

export default function IdentityScreen() {
  const {
    state,
    selectFrame,
    updateField,
    persistDraft,
    draftPrompt,
    resumeDraft,
    startFresh,
    setWinReaction,
    setLossReaction,
  } = useWizard();
  const router = useRouter();
  const theme = Colors[useColorScheme()];
  const [nameError, setNameError] = useState(false);

  const nameSet = state.name.trim().length > 0;
  const canAdvance = state.name.trim().length > 0 && state.frameName !== null;

  async function handleNext() {
    if (!state.name.trim()) {
      setNameError(true);
      return;
    }
    await persistDraft();
    router.push("/(agent-forge)/step-2-trading-profile");
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

          <View style={styles.header}>
            <ForgeSection
              title="Identity"
              subtitle="Your agents trading personality and strategy"
            >
              <></>
            </ForgeSection>
            <View style={styles.avatar}>
              <AgentAvatar
                seed={state.avatarSeed}
                backgroundColor={theme.inputBackground}
              />
            </View>
          </View>

          <IdentityForm
            name={state.name}
            avatarSeed={state.avatarSeed}
            nameError={nameError}
            updateField={updateField}
            setNameError={setNameError}
          />

          <Strategy
            nameSet={nameSet}
            frameName={state.frameName}
            selectFrame={selectFrame}
          />

          <Background
            canAdvance={canAdvance}
            updateField={updateField}
            agentBackground={state.agentBackground}
          />

          <Communication
            canAdvance={canAdvance}
            updateField={updateField}
            proposalCommunicationStyle={state.proposalCommunicationStyle}
          />

          {/* Win Reactions */}
          <ForgeSection
            title="Win Reaction"
            subtitle="How does your agent respond after a winning trade? (Optional)"
            locked={!canAdvance}
            lockedMessage="Set your agent name and strategy first."
          >
            <ReactionPicker
              type="win"
              value={state.winReaction}
              onChange={setWinReaction}
              options={WIN_REACTIONS}
            />
          </ForgeSection>

          {/* Loss Reactions */}
          <ForgeSection
            title="Loss Reaction"
            subtitle="How does your agent respond after a losing trade? (Optional)"
            locked={!canAdvance}
            lockedMessage="Set your agent name and strategy first."
          >
            <ReactionPicker
              type="loss"
              value={state.lossReaction}
              onChange={setLossReaction}
              options={LOSS_REACTIONS}
            />
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
  header: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-between",
    alignItems: "center",
  },
  avatar: {
    marginTop: 35,
  },
});
