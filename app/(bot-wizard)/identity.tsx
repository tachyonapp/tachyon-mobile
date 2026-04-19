import { WizardProgressBar } from "@/components/wizard/WizardProgressBar";
import { WizardStepAnimation } from "@/components/wizard/WizardStepAnimation";
import { Colors } from "@/constants/theme";
import { useWizard } from "@/context/WizardContext";
import { botttsNeutral } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SvgXml } from "react-native-svg";

const TOTAL_STEPS = 13;
const MAX_NAME_LENGTH = 24;
const AVATAR_SIZE = 56;

const COLORWAYS = [
  "#2C6BED",
  "#8B7CFF",
  "#1C9C61",
  "#F2B705",
  "#D64545",
  "#E8F4FF",
];

function useBotAvatar(seed: string): string {
  return useMemo(
    () => createAvatar(botttsNeutral, { seed: seed || "default" }).toString(),
    [seed],
  );
}

export default function IdentityScreen() {
  const { state, updateField, persistDraft } = useWizard();
  const router = useRouter();
  const [nameFocused, setNameFocused] = useState(false);
  const [nameError, setNameError] = useState(false);

  const avatarSvg = useBotAvatar(state.name);
  const previewColorway = state.colorway || Colors.dark.electricBlue;

  const isValid = state.name.trim().length > 0 && !!state.colorway;

  async function handleNext() {
    if (!state.name.trim()) {
      setNameError(true);
      return;
    }
    // Store the DiceBear seed (bot name) as avatarId until API avatar system is ready
    updateField("avatarId", state.name);
    await persistDraft();
    router.push("/(bot-wizard)/brain");
  }

  function handleNameChange(text: string) {
    updateField("name", text);
    if (text.trim().length > 0) setNameError(false);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <WizardProgressBar currentStep={11} totalSteps={TOTAL_STEPS} />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <WizardStepAnimation source={null} />
        <Text style={styles.title}>Name Your Bot</Text>
        <Text style={styles.subtitle}>Give your bot an identity.</Text>

        {/* Live preview card */}
        <View style={[styles.previewCard, { borderColor: previewColorway }]}>
          <View
            style={[
              styles.previewColorBar,
              { backgroundColor: previewColorway },
            ]}
          />
          <View
            style={[
              styles.previewAvatarContainer,
              { backgroundColor: Colors.dark.surface },
            ]}
          >
            <SvgXml xml={avatarSvg} width={AVATAR_SIZE} height={AVATAR_SIZE} />
          </View>
          <View style={styles.previewInfo}>
            <Text style={styles.previewName} numberOfLines={1}>
              {state.name.trim() || "Your Bot"}
            </Text>
            <Text style={styles.previewFrame}>{state.frameName ?? "—"}</Text>
          </View>
        </View>

        {/* Name input */}
        <View style={styles.fieldGroup}>
          <View style={styles.fieldLabelRow}>
            <Text style={styles.fieldLabel}>Bot Name</Text>
            <Text style={styles.charCount}>
              {state.name.length}/{MAX_NAME_LENGTH}
            </Text>
          </View>
          <TextInput
            style={[
              styles.textInput,
              nameFocused && styles.textInputFocused,
              nameError && styles.textInputError,
            ]}
            value={state.name}
            onChangeText={handleNameChange}
            onFocus={() => setNameFocused(true)}
            onBlur={() => setNameFocused(false)}
            maxLength={MAX_NAME_LENGTH}
            placeholder="e.g. Iron Scout"
            placeholderTextColor={Colors.dark.textDisabled}
            returnKeyType="done"
          />
          {nameError && (
            <Text style={styles.errorText}>Bot name is required.</Text>
          )}
        </View>

        {/* Colorway picker */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Colorway</Text>
          <View style={styles.swatchRow}>
            {COLORWAYS.map((color) => (
              <Pressable
                key={color}
                onPress={() => updateField("colorway", color)}
                style={[styles.swatch, { backgroundColor: color }]}
                accessibilityRole="radio"
                accessibilityState={{ selected: state.colorway === color }}
              >
                {state.colorway === color && (
                  <Text style={styles.swatchCheck}>✓</Text>
                )}
              </Pressable>
            ))}
          </View>
        </View>

        {/* Avatar notice */}
        {/* TODO (post-MVP): Allow users to upload a custom avatar image from their camera roll.
            Replace the DiceBear-generated SVG with the uploaded image URI stored in the bot profile. */}
        <View style={styles.avatarNotice}>
          <Text style={styles.avatarNoticeText}>
            {
              "Your bot's avatar is generated from its name. You can change it in the Bot Manager after creation."
            }
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          onPress={handleNext}
          disabled={!isValid}
          style={[styles.nextBtn, !isValid && styles.nextBtnDisabled]}
        >
          <Text style={styles.nextBtnLabel}>Next</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.dark.background },
  content: { padding: 16, gap: 20 },
  title: { color: Colors.dark.textPrimary, fontSize: 22, fontWeight: "700" },
  subtitle: { color: Colors.dark.textSecondary, fontSize: 14 },

  // Preview card
  previewCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.dark.surface,
    borderRadius: 12,
    borderWidth: 1.5,
    overflow: "hidden",
    gap: 12,
  },
  previewColorBar: {
    width: 4,
    alignSelf: "stretch",
  },
  previewAvatarContainer: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    overflow: "hidden",
    marginVertical: 14,
  },
  previewInfo: { flex: 1, paddingVertical: 14, paddingRight: 14 },
  previewName: {
    color: Colors.dark.textPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
  previewFrame: {
    color: Colors.dark.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },

  // Fields
  fieldGroup: { gap: 8 },
  fieldLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  fieldLabel: {
    color: Colors.dark.textPrimary,
    fontSize: 14,
    fontWeight: "600",
  },
  charCount: { color: Colors.dark.textSecondary, fontSize: 12 },
  textInput: {
    height: 48,
    borderWidth: 1,
    borderColor: Colors.dark.inputBorder,
    borderRadius: 8,
    paddingHorizontal: 12,
    color: Colors.dark.textPrimary,
    backgroundColor: Colors.dark.inputBackground,
    fontSize: 15,
  },
  textInputFocused: { borderColor: Colors.dark.electricBlue },
  textInputError: { borderColor: Colors.dark.danger },
  errorText: { color: Colors.dark.danger, fontSize: 12 },

  // Colorway
  swatchRow: { flexDirection: "row", gap: 12, flexWrap: "wrap" },
  swatch: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  swatchCheck: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },

  // Avatar notice
  avatarNotice: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 8,
    padding: 12,
  },
  avatarNoticeText: {
    color: Colors.dark.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },

  // Footer
  footer: { padding: 16, paddingBottom: 32 },
  nextBtn: {
    height: 52,
    borderRadius: 10,
    backgroundColor: Colors.dark.electricBlue,
    justifyContent: "center",
    alignItems: "center",
  },
  nextBtnDisabled: { opacity: 0.35 },
  nextBtnLabel: {
    color: Colors.dark.textPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
});
