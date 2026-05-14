// import { FRAME_CONFIG } from "@tachyonapp/tachyon-queue-types/config";
import { Colors } from "@/constants/theme";
import { useWizard } from "@/context/WizardContext";
import { ForgeNavBar } from "@/features/agents/forge/components/ForgeNavBar";
import { ForgeOptionCard } from "@/features/agents/forge/components/ForgeOptionCard";
import { ForgeSection } from "@/features/agents/forge/components/ForgeSection";
import {
  LOSS_REACTIONS,
  ReactionPicker,
  WIN_REACTIONS,
} from "@/features/agents/forge/components/ReactionPicker";
import { Draft } from "@/features/agents/forge/draft";
import { BotFrame } from "@/generated/graphql";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  FRAME_CONFIG,
  ProposalCommunicationStyle,
} from "@tachyonapp/tachyon-queue-types/config";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { FrameCard } from "./FrameCard";
import { IdentityForm } from "./IdentityForm";

const FRAMES = Object.values(BotFrame);

const AGENT_BACKGROUND_MAX = 300;

const COMM_STYLE_OPTIONS: {
  value: ProposalCommunicationStyle;
  label: string;
  description: string;
}[] = [
  {
    value: ProposalCommunicationStyle.TERSE,
    label: "Terse",
    description: "Short, direct proposals. Just the signal and the numbers.",
  },
  {
    value: ProposalCommunicationStyle.DETAILED,
    label: "Detailed",
    description:
      "Full context with each proposal — reasoning, market conditions, risk factors.",
  },
  {
    value: ProposalCommunicationStyle.AGGRESSIVE_CONFIDENT,
    label: "Aggressive & Confident",
    description: "Bold, high-conviction language. Your agent doesn't hedge.",
  },
  {
    value: ProposalCommunicationStyle.CAUTIOUS_MEASURED,
    label: "Cautious & Measured",
    description: "Thoughtful, nuanced proposals that acknowledge uncertainty.",
  },
];

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
  const [nameFocused, setNameFocused] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [bgFocused, setBgFocused] = useState(false);

  const bgLength = state.agentBackground.length;
  const bgCountColor =
    bgLength >= AGENT_BACKGROUND_MAX
      ? theme.danger
      : bgLength > 270
        ? theme.warning
        : theme.textSecondary;
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

          {/* Agent Background */}
          <ForgeSection
            title="Agent Background"
            subtitle="Describe your agent's investor identity and experience."
            locked={!canAdvance}
            lockedMessage="Set your agent name and strategy first."
          >
            <View style={styles.bgInputWrapper}>
              <TextInput
                style={[
                  styles.bgInput,
                  {
                    borderColor: bgFocused
                      ? theme.electricBlue
                      : theme.inputBorder,
                    color: theme.textPrimary,
                    backgroundColor: theme.inputBackground,
                  },
                ]}
                value={state.agentBackground}
                onChangeText={(text) => updateField("agentBackground", text)}
                onFocus={() => setBgFocused(true)}
                onBlur={() => setBgFocused(false)}
                multiline
                maxLength={AGENT_BACKGROUND_MAX}
                placeholder="Contrarian value hunter with 20 years of experience. Focuses on beaten-down sectors with strong fundamentals and insider buying. Avoids momentum chasing."
                placeholderTextColor={theme.textDisabled}
                textAlignVertical="top"
              />
              <Text style={[styles.charCount, { color: bgCountColor }]}>
                {bgLength} / {AGENT_BACKGROUND_MAX}
              </Text>
            </View>
          </ForgeSection>

          {/* Communication Style */}
          <ForgeSection
            title="Communication Style"
            subtitle="How should your agent phrase its trade proposals?"
            locked={!canAdvance}
            lockedMessage="Set your agent name and strategy first."
          >
            {COMM_STYLE_OPTIONS.map((opt) => (
              <ForgeOptionCard
                key={opt.value}
                label={opt.label}
                description={opt.description}
                selected={state.proposalCommunicationStyle === opt.value}
                onSelect={() =>
                  updateField("proposalCommunicationStyle", opt.value)
                }
              />
            ))}
          </ForgeSection>

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
  frameGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  frameCardWrapper: {
    width: "48%",
  },
  bgInputWrapper: {
    gap: 6,
  },
  bgInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    minHeight: 96,
    lineHeight: 20,
  },
  charCount: {
    fontSize: 12,
    textAlign: "right",
  },
});
