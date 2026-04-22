import { SectorGrid } from "@/components/wizard/SectorGrid";
import { WizardProgressBar } from "@/components/wizard/WizardProgressBar";
import { WizardStepAnimation } from "@/components/wizard/WizardStepAnimation";
import { Colors } from "@/constants/theme";
import { useWizard } from "@/context/WizardContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
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
  const theme = Colors[useColorScheme()];
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
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <WizardProgressBar currentStep={7} totalSteps={TOTAL_STEPS} />
      <ScrollView contentContainerStyle={styles.content}>
        <WizardStepAnimation source={null} />
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          Where Does It Fight?
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
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
        <Pressable
          onPress={handleNext}
          style={[styles.nextBtn, { backgroundColor: theme.electricBlue }]}
        >
          <Text style={[styles.nextBtnLabel, { color: theme.textPrimary }]}>
            Next
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: 16, gap: 16 },
  title: { fontSize: 22, fontWeight: "700" },
  subtitle: { fontSize: 14 },
  footer: { padding: 16, paddingBottom: 32 },
  nextBtn: {
    height: 52,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  nextBtnLabel: { fontSize: 16, fontWeight: "700" },
});
