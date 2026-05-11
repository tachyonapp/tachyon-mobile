import { AgentAvatar } from "@/components/shared/AgentAvatar";
import { Colors } from "@/constants/theme";
import type { WizardState } from "@/context/WizardContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { StyleSheet, Text, TextInput, View } from "react-native";

interface IdentityProps {
  name: string;
  avatarSeed: string;
  nameFocused: boolean;
  nameError: boolean;
  updateField: <K extends keyof WizardState>(
    field: K,
    value: WizardState[K],
  ) => void;
  setNameError: React.Dispatch<React.SetStateAction<boolean>>;
  setNameFocused: (v: boolean) => void;
}

const MAX_NAME_LENGTH = 24;

export const IdentityForm = ({
  name,
  avatarSeed,
  nameFocused,
  nameError,
  updateField,
  setNameError,
  setNameFocused,
}: IdentityProps) => {
  const theme = Colors[useColorScheme()];

  function handleNameChange(text: string) {
    updateField("name", text);
    updateField("avatarSeed", text + Date.now().toString());
    if (text.trim().length > 0) setNameError(false);
  }

  return (
    <View style={styles.fieldGroup}>
      <View style={styles.avatar}>
        <AgentAvatar seed={avatarSeed} backgroundColor={theme.background} />
      </View>
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
  );
};

const styles = StyleSheet.create({
  avatar: {
    alignItems: "flex-end",
  },
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
