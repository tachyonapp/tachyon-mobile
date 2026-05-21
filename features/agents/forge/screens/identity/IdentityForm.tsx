import { Colors } from "@/constants/theme";
import type { WizardState } from "@/context/WizardContext";
import { ForgeSection } from "@/features/agents/forge/components/ForgeSection";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

interface IdentityProps {
  name: string;
  avatarSeed: string;
  nameError: boolean;
  updateField: <K extends keyof WizardState>(
    field: K,
    value: WizardState[K],
  ) => void;
  setNameError: React.Dispatch<React.SetStateAction<boolean>>;
}

const MAX_NAME_LENGTH = 24;

export const IdentityForm = ({
  name,
  nameError,
  updateField,
  setNameError,
}: IdentityProps) => {
  const theme = Colors[useColorScheme()];
  const [nameFocused, setNameFocused] = useState(false);

  function handleNameChange(text: string) {
    updateField("name", text);
    updateField("avatarSeed", text + Date.now().toString());
    if (text.trim().length > 0) setNameError(false);
  }

  return (
    <ForgeSection title="Agent Name" subtitle="Name your agent.">
      <View style={styles.fieldGroup}>
        <TextInput
          style={[
            styles.textInput,
            {
              borderColor: theme.inputBorder,
              color: theme.textPrimary,
              backgroundColor: theme.inputBackground,
            },
            nameFocused && { borderColor: theme.electricBlue },
            nameError && { borderColor: theme.danger },
          ]}
          value={name}
          onChangeText={handleNameChange}
          onFocus={() => setNameFocused(true)}
          onBlur={() => setNameFocused(false)}
          maxLength={MAX_NAME_LENGTH}
          placeholder="e.g. Iron Scout"
          placeholderTextColor={theme.textDisabled}
          returnKeyType="done"
          selectTextOnFocus={false}
          autoCorrect={false}
          spellCheck={false}
        />
        {nameError && (
          <Text style={[styles.errorInline, { color: theme.danger }]}>
            Agent name is required.
          </Text>
        )}
        <View style={styles.fieldLabelRow}>
          <Text style={[styles.charCount, { color: theme.textSecondary }]}>
            {name.length}/{MAX_NAME_LENGTH}
          </Text>
        </View>
      </View>
    </ForgeSection>
  );
};

const styles = StyleSheet.create({
  fieldGroup: { gap: 8 },
  fieldLabelRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  charCount: { fontSize: 12 },
  fieldLabel: { fontSize: 14, fontWeight: "600" },
  textInput: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15,
  },
  errorInline: { fontSize: 12 },
});
