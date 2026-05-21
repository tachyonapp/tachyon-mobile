import { Colors } from "@/constants/theme";
import type { WizardState } from "@/context/WizardContext";
import { ForgeSection } from "@/features/agents/forge/components/ForgeSection";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

interface BackgroundProps {
  canAdvance: boolean;
  updateField: <K extends keyof WizardState>(
    field: K,
    value: WizardState[K],
  ) => void;
  agentBackground: any;
}

const AGENT_BACKGROUND_MAX = 300;

export const Background = ({
  canAdvance,
  updateField,
  agentBackground,
}: BackgroundProps) => {
  const theme = Colors[useColorScheme()];
  const [bgFocused, setBgFocused] = useState(false);
  const bgLength = agentBackground.length;
  const bgCountColor =
    bgLength >= AGENT_BACKGROUND_MAX
      ? theme.danger
      : bgLength > 270
        ? theme.warning
        : theme.textSecondary;

  return (
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
              borderColor: bgFocused ? theme.electricBlue : theme.inputBorder,
              color: theme.textPrimary,
              backgroundColor: theme.inputBackground,
            },
          ]}
          value={agentBackground}
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
  );
};

const styles = StyleSheet.create({
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
