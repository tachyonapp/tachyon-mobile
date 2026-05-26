import { useWizard } from "@/context/WizardContext";
import { ModelVariantPicker } from "@/features/agents/forge/components/ModelVariantPicker";
import { ForgeNavBar } from "@/features/agents/forge/components/ForgeNavBar";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { BrainType } from "@/generated/graphql";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Keyboard, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Subscription } from "./Subscription";

export default function Model() {
  const { state, updateBrain, updateField, brainCatalog, persistDraft } = useWizard();
  const router = useRouter();
  const theme = Colors[useColorScheme()];

  const [isKeyValidated, setIsKeyValidated] = useState(false);
  const [isVariantPickerVisible, setIsVariantPickerVisible] = useState(false);

  const canAdvance =
    state.brain.brainType === BrainType.TachyonHosted || isKeyValidated;

  const isByok = state.brain.brainType === BrainType.Byok;
  const provider = state.brain.provider as "openai" | "anthropic" | "groq" | "gemini" | null;

  const activeVariant = provider === "openai"    ? state.openaiModelVariant
    : provider === "anthropic" ? state.anthropicModelVariant
    : provider === "groq"      ? state.groqModelVariant
    : provider === "gemini"    ? state.geminiModelVariant
    : null;

  async function handleNext() {
    await persistDraft();
    router.push("/(agent-forge)/step-8-review");
  }

  async function handleBack() {
    await persistDraft();
    router.back();
  }

  function handleVariantSelect(variant: string) {
    updateField("openaiModelVariant",    provider === "openai"    ? variant : null);
    updateField("anthropicModelVariant", provider === "anthropic" ? variant : null);
    updateField("groqModelVariant",      provider === "groq"      ? variant : null);
    updateField("geminiModelVariant",    provider === "gemini"    ? variant : null);
  }

  return (
    <>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.scrollContent}
      >
        <Pressable onPress={() => Keyboard.dismiss()}>
          <Subscription
            brain={state.brain}
            brainCatalog={brainCatalog}
            isKeyValidated={isKeyValidated}
            updateBrain={updateBrain}
            setIsKeyValidated={setIsKeyValidated}
            stopLossSet={state.stopLossStyle !== null}
          />

          {/* Model Variant section — BYOK only, once provider is selected */}
          {isByok && provider && (
            <View style={[styles.variantSection, { backgroundColor: theme.surface }]}>
              <Text style={[styles.variantLabel, { color: theme.textSecondary }]}>
                MODEL VARIANT
              </Text>
              <View style={styles.variantRow}>
                <Text style={[styles.variantValue, { color: theme.textPrimary }]}>
                  {activeVariant ?? "Default (recommended)"}
                </Text>
                <TouchableOpacity onPress={() => setIsVariantPickerVisible(true)} hitSlop={8}>
                  <Text style={[styles.changeLink, { color: theme.electricBlue }]}>
                    Change
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Pressable>
      </ScrollView>

      <ForgeNavBar
        onBack={handleBack}
        onNext={handleNext}
        nextDisabled={!canAdvance}
        nextLabel="Review"
      />

      {isByok && provider && (
        <ModelVariantPicker
          isVisible={isVariantPickerVisible}
          onClose={() => setIsVariantPickerVisible(false)}
          provider={provider}
          currentVariant={activeVariant}
          mode="wizard"
          onWizardSelect={handleVariantSelect}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    gap: 28,
    paddingBottom: 16,
  },
  variantSection: {
    borderRadius: 10,
    padding: 14,
    marginTop: 12,
    gap: 6,
  },
  variantLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  variantRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  variantValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  changeLink: {
    fontSize: 14,
    fontWeight: "600",
  },
});


