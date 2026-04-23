import { ForgeSection } from "@/components/forge/ForgeSection";
import { FrameConfig } from "@/constants/frameConfig";
import { Colors } from "@/constants/theme";
import type { WizardState } from "@/context/WizardContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { botttsNeutral } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { useMemo } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { SvgXml } from "react-native-svg";

interface IdentityProps {
  frameConfig: FrameConfig | null;
  colorway: string;
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
const AVATAR_SIZE = 48;

export const Identity = ({
  frameConfig,
  colorway,
  name,
  nameFocused,
  nameError,
  updateField,
  setNameError,
  setNameFocused,
}: IdentityProps) => {
  const theme = Colors[useColorScheme()];
  const avatarSvg = useMemo(
    () => createAvatar(botttsNeutral, { seed: name || "default" }).toString(),
    [name],
  );

  function handleNameChange(text: string) {
    updateField("name", text);
    updateField("avatarId", text);
    if (text.trim().length > 0) setNameError(false);
  }

  return (
    <ForgeSection title="Identity" subtitle="Name and customize your bot.">
      <View
        style={[
          styles.previewCard,
          {
            borderColor: colorway || theme.inputBorder,
            backgroundColor: theme.surface,
          },
        ]}
      >
        <View
          style={[
            styles.previewColorBar,
            { backgroundColor: colorway || theme.inputBorder },
          ]}
        />
        <View
          style={[styles.previewAvatar, { backgroundColor: theme.background }]}
        >
          <SvgXml xml={avatarSvg} width={AVATAR_SIZE} height={AVATAR_SIZE} />
        </View>
        <View style={styles.previewInfo}>
          <Text
            style={[styles.previewName, { color: theme.textPrimary }]}
            numberOfLines={1}
          >
            {name.trim() || "Your Bot"}
          </Text>
          <Text style={[styles.previewFrame, { color: theme.textSecondary }]}>
            {frameConfig?.gamifiedName ?? "No frame selected"}
          </Text>
        </View>
      </View>

      {/* Name input */}
      <View style={styles.fieldGroup}>
        <View style={styles.fieldLabelRow}>
          <Text style={[styles.fieldLabel, { color: theme.textPrimary }]}>
            Bot Name
          </Text>
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
  previewCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1.5,
    overflow: "hidden",
    gap: 12,
  },
  previewColorBar: { width: 4, alignSelf: "stretch" },
  previewAvatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: 8,
    overflow: "hidden",
    marginVertical: 12,
  },
  previewInfo: { flex: 1, paddingVertical: 12, paddingRight: 12 },
  previewName: { fontSize: 15, fontWeight: "700" },
  previewFrame: { fontSize: 12, marginTop: 2 },
  fieldGroup: { gap: 8 },
  fieldLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
