import { BrainSelector } from "@/components/wizard/BrainSelector";
import { WizardProgressBar } from "@/components/wizard/WizardProgressBar";
import { WizardStepAnimation } from "@/components/wizard/WizardStepAnimation";
import { Colors } from "@/constants/theme";
import { useWizard } from "@/context/WizardContext";
import {
  BrainType,
  ValidateBrainKeyDocument,
  type ValidateBrainKeyMutation,
  type ValidateBrainKeyMutationVariables,
} from "@/generated/graphql";
import { useMutation } from "@apollo/client/react";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const TOTAL_STEPS = 13;

export default function BrainScreen() {
  const { state, updateBrain, brainCatalog, persistDraft } = useWizard();
  const router = useRouter();
  const [isKeyValidated, setIsKeyValidated] = useState(false);

  const [validateBrainKey] = useMutation<
    ValidateBrainKeyMutation,
    ValidateBrainKeyMutationVariables
  >(ValidateBrainKeyDocument);

  const byokProviders = brainCatalog?.byokProviders ?? [];

  // True when user is on BYOK with no stored key — draft resume or first entry after navigating back
  const hasByokDraft =
    state.brain.brainType === BrainType.Byok && state.brain.apiKey === null;

  const canProceed =
    state.brain.brainType === BrainType.TachyonHosted ||
    (state.brain.brainType === BrainType.Byok && isKeyValidated);

  async function handleValidateKey(apiKey: string): Promise<boolean> {
    const { data } = await validateBrainKey({
      variables: { provider: state.brain.provider, apiKey },
    });
    const ok = data?.validateBrainKey?.valid ?? false;
    if (ok) {
      updateBrain({ apiKey });
      setIsKeyValidated(true);
    } else {
      setIsKeyValidated(false);
    }
    return ok;
  }

  function handleBrainTypeChange(type: BrainType) {
    updateBrain({ brainType: type, apiKey: null });
    setIsKeyValidated(false);
  }

  async function handleNext() {
    await persistDraft();
    router.push("/(bot-wizard)/summary");
  }

  return (
    <SafeAreaView style={styles.safe}>
      <WizardProgressBar currentStep={12} totalSteps={TOTAL_STEPS} />
      <ScrollView contentContainerStyle={styles.content}>
        <WizardStepAnimation source={null} />
        <Text style={styles.title}>{"Choose Your Bot's Brain"}</Text>
        <Text style={styles.subtitle}>
          Your bot uses AI to explain why it found a trade — you approve every
          trade before it executes.
        </Text>
        <BrainSelector
          brainType={state.brain.brainType}
          provider={state.brain.provider}
          modelId={state.brain.modelId}
          byokProviders={byokProviders}
          isKeyValidated={isKeyValidated}
          hasByokDraft={hasByokDraft}
          onBrainTypeChange={handleBrainTypeChange}
          onProviderChange={(p) => {
            updateBrain({ provider: p, apiKey: null });
            setIsKeyValidated(false);
          }}
          onModelChange={(m) => updateBrain({ modelId: m })}
          onValidateKey={handleValidateKey}
        />
      </ScrollView>
      <View style={styles.footer}>
        <Pressable
          onPress={handleNext}
          disabled={!canProceed}
          style={[styles.nextBtn, !canProceed && styles.nextBtnDisabled]}
        >
          <Text style={styles.nextBtnLabel}>Next</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.dark.background },
  content: { padding: 16, gap: 16 },
  title: { color: Colors.dark.textPrimary, fontSize: 22, fontWeight: "700" },
  subtitle: { color: Colors.dark.textSecondary, fontSize: 14, lineHeight: 20 },
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
