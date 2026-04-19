import { SectorGrid } from "@/components/wizard/SectorGrid";
import { WizardProgressBar } from "@/components/wizard/WizardProgressBar";
import { WizardStepAnimation } from "@/components/wizard/WizardStepAnimation";
import { Colors } from "@/constants/theme";
import { useWizard } from "@/context/WizardContext";
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

export default function SectorsScreen() {
  const { state, updateField, persistDraft } = useWizard();
  const router = useRouter();
  const [attempted, setAttempted] = useState(false);

  async function handleNext() {
    if (state.sectors.length === 0) {
      setAttempted(true);
      return;
    }
    await persistDraft();
    router.push("/(bot-wizard)/exit");
  }

  return (
    <SafeAreaView style={styles.safe}>
      <WizardProgressBar currentStep={7} totalSteps={TOTAL_STEPS} />
      <ScrollView contentContainerStyle={styles.content}>
        <WizardStepAnimation source={null} />
        <Text style={styles.title}>Where Does It Fight?</Text>
        <Text style={styles.subtitle}>
          Choose which market sectors your bot can trade in.
        </Text>
        <SectorGrid
          selected={state.sectors}
          onChange={(sectors) => {
            updateField("sectors", sectors);
            if (sectors.length > 0) setAttempted(false);
          }}
          showError={attempted}
        />
      </ScrollView>
      <View style={styles.footer}>
        <Pressable onPress={handleNext} style={styles.nextBtn}>
          <Text style={styles.nextBtnLabel}>Next</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.dark.background },
  content: { padding: 16, gap: 16 },
  title: {
    color: Colors.dark.textPrimary,
    fontSize: 22,
    fontWeight: "700",
  },
  subtitle: { color: Colors.dark.textSecondary, fontSize: 14 },
  footer: { padding: 16, paddingBottom: 32 },
  nextBtn: {
    height: 52,
    borderRadius: 10,
    backgroundColor: Colors.dark.electricBlue,
    justifyContent: "center",
    alignItems: "center",
  },
  nextBtnLabel: {
    color: Colors.dark.textPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
});
