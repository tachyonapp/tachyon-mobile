import { EducationalTooltip } from "@/components/wizard/EducationalTooltip";
import { WizardOptionCard } from "@/components/wizard/WizardOptionCard";
import { WizardProgressBar } from "@/components/wizard/WizardProgressBar";
import { WizardStepAnimation } from "@/components/wizard/WizardStepAnimation";
import { Colors } from "@/constants/theme";
import { useWizard } from "@/context/WizardContext";
import { ExitPersonalityName } from "@/generated/graphql";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
import React from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const TOTAL_STEPS = 13;

const EXIT_OPTIONS: {
  value: ExitPersonalityName;
  label: string;
  description: string;
}[] = [
  {
    value: ExitPersonalityName.QuickFinisher,
    label: "Quick Finisher",
    description: "Takes profits early. Exits at 1.5× the risk taken.",
  },
  {
    value: ExitPersonalityName.Balanced,
    label: "Balanced",
    description: "Standard profit-taking. Exits at 2× the risk taken.",
  },
  {
    value: ExitPersonalityName.Patient,
    label: "Patient",
    description: "Lets winners run. Trailing stop. Exits at 3× the risk taken.",
  },
];

export default function ExitScreen() {
  const theme = Colors[useColorScheme()];
  const { state, updateField, persistDraft } = useWizard();
  const router = useRouter();

  async function handleNext() {
    await persistDraft();
    router.push("/(bot-wizard)/safety");
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <WizardProgressBar currentStep={8} totalSteps={TOTAL_STEPS} />
      <ScrollView contentContainerStyle={styles.content}>
        <WizardStepAnimation source={null} />
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>Exit Personality</Text>
          <EducationalTooltip
            title="Exit Personality"
            body="Exit personality controls when your bot closes a winning position."
          />
        </View>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>How should your bot take profits?</Text>
        <View style={styles.options}>
          {EXIT_OPTIONS.map((opt) => (
            <WizardOptionCard
              key={opt.value}
              label={opt.label}
              description={opt.description}
              selected={state.exitPersonality?.name === opt.value}
              onSelect={() =>
                updateField("exitPersonality", { name: opt.value })
              }
            />
          ))}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Pressable
          onPress={handleNext}
          disabled={state.exitPersonality === null}
          style={[
            styles.nextBtn,
            { backgroundColor: theme.electricBlue },
            state.exitPersonality === null && styles.nextBtnDisabled,
          ]}
        >
          <Text style={[styles.nextBtnLabel, { color: theme.textPrimary }]}>Next</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: 16, gap: 16 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  title: { fontSize: 22, fontWeight: "700", flex: 1 },
  subtitle: { fontSize: 14 },
  options: { gap: 10 },
  footer: { padding: 16, paddingBottom: 32 },
  nextBtn: {
    height: 52,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  nextBtnDisabled: { opacity: 0.35 },
  nextBtnLabel: { fontSize: 16, fontWeight: "700" },
});
