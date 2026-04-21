import { EducationalTooltip } from "@/components/wizard/EducationalTooltip";
import { AnimatedPatienceTimeline } from "@/components/wizard/PatienceTimeline";
import { WizardOptionCard } from "@/components/wizard/WizardOptionCard";
import { WizardProgressBar } from "@/components/wizard/WizardProgressBar";
import { FRAME_CONFIG } from "@/constants/frameConfig";
import { Colors } from "@/constants/theme";
import { useWizard } from "@/context/WizardContext";
import { CombatPatience } from "@/generated/graphql";
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

const PATIENCE_HINTS: Record<CombatPatience, string> = {
  [CombatPatience.Impulsive]: "No minimum hold. Can exit same day.",
  [CombatPatience.Calculated]: "Minimum hold: 4 hours",
  [CombatPatience.Patient]: "Minimum hold: 24 hours",
  [CombatPatience.Strategic]: "Minimum hold: 72 hours (3 days)",
};

const PATIENCE_OPTIONS: {
  value: CombatPatience;
  label: string;
  description: string;
}[] = [
  {
    value: CombatPatience.Impulsive,
    label: "Impulsive",
    description:
      "Exits quickly. No minimum hold. Reactive to short-term signals.",
  },
  {
    value: CombatPatience.Calculated,
    label: "Calculated",
    description: "Short commitment. Gives trades a few hours to play out.",
  },
  {
    value: CombatPatience.Patient,
    label: "Patient",
    description: "Holds overnight. Waits for meaningful price movement.",
  },
  {
    value: CombatPatience.Strategic,
    label: "Strategic",
    description:
      "Multi-day holds. Conviction-driven. Ignores short-term noise.",
  },
];

export default function PatienceScreen() {
  const theme = Colors[useColorScheme()];
  const { state, updateField } = useWizard();
  const router = useRouter();

  const bounds = state.frameName
    ? FRAME_CONFIG[state.frameName].bounds.combatPatience
    : [];
  const frameConfig = state.frameName ? FRAME_CONFIG[state.frameName] : null;
  const supportedPatienceLabels = bounds
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join(", ");
  const disabledReason = frameConfig
    ? `${frameConfig.gamifiedName} only supports ${supportedPatienceLabels} patience${bounds.length !== 1 ? " levels" : ""}.`
    : undefined;
  const patienceHint = state.combatPatience
    ? PATIENCE_HINTS[state.combatPatience]
    : null;
  const selectedIndex = state.combatPatience
    ? PATIENCE_OPTIONS.findIndex((o) => o.value === state.combatPatience)
    : -1;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <WizardProgressBar currentStep={4} totalSteps={TOTAL_STEPS} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.timeline}>
          <AnimatedPatienceTimeline
            selectedIndex={selectedIndex}
            bounds={bounds}
          />
        </View>

        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            Set Combat Patience
          </Text>
          <EducationalTooltip
            title="Combat Patience"
            body="Combat patience sets how long your bot must hold a position before exiting. Longer holds reduce PDT risk."
          />
        </View>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          How long should your bot commit to a trade?
        </Text>

        {patienceHint && (
          <Text style={[styles.hint, { color: theme.electricBlue }]}>
            {patienceHint}
          </Text>
        )}

        <View style={styles.options}>
          {PATIENCE_OPTIONS.map((opt) => (
            <WizardOptionCard
              key={opt.value}
              label={opt.label}
              description={opt.description}
              selected={state.combatPatience === opt.value}
              onSelect={() => updateField("combatPatience", opt.value)}
              disabled={!bounds.includes(opt.value)}
              disabledReason={
                !bounds.includes(opt.value) ? disabledReason : undefined
              }
            />
          ))}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Pressable
          onPress={() => router.push("/(bot-wizard)/allocation")}
          disabled={state.combatPatience === null}
          style={[
            styles.nextBtn,
            { backgroundColor: theme.electricBlue },
            state.combatPatience === null && styles.nextBtnDisabled,
          ]}
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
  timeline: { marginBottom: 50, marginTop: 50 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  title: { fontSize: 22, fontWeight: "700", flex: 1 },
  subtitle: { fontSize: 14 },
  hint: { fontSize: 13, fontWeight: "500" },
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
