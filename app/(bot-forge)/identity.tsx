import { ForgeSection } from "@/components/forge/ForgeSection";
import { Colors } from "@/constants/theme";
import type { WizardState } from "@/context/WizardContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { StyleSheet, Text, TextInput, View } from "react-native";

interface IdentityProps {
  name: string;
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

export const Identity = ({
  name,
  nameFocused,
  nameError,
  updateField,
  setNameError,
  setNameFocused,
}: IdentityProps) => {
  const theme = Colors[useColorScheme()];

  function handleNameChange(text: string) {
    updateField("name", text);
    updateField("avatarId", text);
    if (text.trim().length > 0) setNameError(false);
  }

  return (
    <ForgeSection title="Bot Name" subtitle="Name and customize your bot.">
      <View style={styles.fieldGroup}>
        <View style={styles.fieldLabelRow}>
          <Text style={[styles.charCount, { color: theme.textSecondary }]}>
            {name.length}/{MAX_NAME_LENGTH}
          </Text>
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
        />
        {nameError && (
          <Text style={[styles.errorInline, { color: theme.danger }]}>
            Bot name is required.
          </Text>
        )}
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
