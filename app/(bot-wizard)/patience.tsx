import { EducationalTooltip } from "@/components/wizard/EducationalTooltip";
import { RiskShapeIndicator } from "@/components/wizard/RiskShapeIndicator";
import { TempoWaveformIndicator } from "@/components/wizard/TempoWaveformIndicator";
import { WizardOptionCard } from "@/components/wizard/WizardOptionCard";
import { WizardProgressBar } from "@/components/wizard/WizardProgressBar";
import { WizardStepAnimation } from "@/components/wizard/WizardStepAnimation";
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

const EYE_ANIMATION = require("@/assets/animations/tachyon-eye.json");

const TOTAL_STEPS = 13;

const PATIENCE_HINTS: Record<CombatPatience, string> = {
  [CombatPatience.Impulsive]:  "No minimum hold. Can exit same day.",
  [CombatPatience.Calculated]: "Minimum hold: 4 hours",
  [CombatPatience.Patient]:    "Minimum hold: 24 hours",
  [CombatPatience.Strategic]:  "Minimum hold: 72 hours (3 days)",
};

const PATIENCE_OPTIONS: { value: CombatPatience; label: string; description: string }[] = [
  {
    value: CombatPatience.Impulsive,
    label: "Impulsive",
    description: "Exits quickly. No minimum hold. Reactive to short-term signals.",
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
    description: "Multi-day holds. Conviction-driven. Ignores short-term noise.",
  },
];

const TIMELINE_LABELS = ["Impulsive", "Calculated", "Patient", "Strategic"];

export default function PatienceScreen() {
  const theme = Colors[useColorScheme()];
  const { state, updateField } = useWizard();
  const router = useRouter();

  const bounds = state.frameName ? FRAME_CONFIG[state.frameName].bounds.combatPatience : [];
  const frameColorway = state.frameName ? FRAME_CONFIG[state.frameName].colorway : null;
  const patienceHint = state.combatPatience ? PATIENCE_HINTS[state.combatPatience] : null;
  const selectedIndex = state.combatPatience
    ? PATIENCE_OPTIONS.findIndex((o) => o.value === state.combatPatience)
    : -1;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <WizardProgressBar currentStep={4} totalSteps={TOTAL_STEPS} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.animationWrapper}>
          <WizardStepAnimation source={EYE_ANIMATION} />
          {frameColorway && (
            <View
              pointerEvents="none"
              style={[
                styles.colorwayRing,
                { borderColor: frameColorway, shadowColor: frameColorway },
              ]}
            />
          )}
          {state.riskAttitude && (
            <RiskShapeIndicator riskAttitude={state.riskAttitude} />
          )}
          {state.tradeTempo && (
            <TempoWaveformIndicator tradeTempo={state.tradeTempo} />
          )}
        </View>

        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>Set Combat Patience</Text>
          <EducationalTooltip
            title="Combat Patience"
            body="Combat patience sets how long your bot must hold a position before exiting. Longer holds reduce PDT risk."
          />
        </View>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          How long should your bot commit to a trade?
        </Text>

        <View style={styles.timeline}>
          <View style={styles.timelineTrack}>
            {PATIENCE_OPTIONS.map((opt, i) => (
              <View key={opt.value} style={styles.timelineNodeWrapper}>
                <View
                  style={[
                    styles.timelineNode,
                    { borderColor: theme.textDisabled, backgroundColor: theme.background },
                    i <= selectedIndex && { borderColor: theme.electricBlue, backgroundColor: theme.electricBlue },
                    !bounds.includes(opt.value) && styles.timelineNodeDisabled,
                  ]}
                />
                {i < PATIENCE_OPTIONS.length - 1 && (
                  <View
                    style={[
                      styles.timelineConnector,
                      { backgroundColor: theme.textDisabled },
                      i < selectedIndex && { backgroundColor: theme.electricBlue },
                    ]}
                  />
                )}
              </View>
            ))}
          </View>
          <View style={styles.timelineLabelsRow}>
            {TIMELINE_LABELS.map((label) => (
              <Text key={label} style={[styles.timelineLabel, { color: theme.textSecondary }]}>
                {label}
              </Text>
            ))}
          </View>
          <View style={styles.timelineEndLabels}>
            <Text style={[styles.timelineEndLabel, { color: theme.textDisabled }]}>Short</Text>
            <Text style={[styles.timelineEndLabel, { color: theme.textDisabled }]}>Long</Text>
          </View>
        </View>

        {patienceHint && (
          <Text style={[styles.hint, { color: theme.electricBlue }]}>{patienceHint}</Text>
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
          <Text style={[styles.nextBtnLabel, { color: theme.textPrimary }]}>Next</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: 16, gap: 16 },
  animationWrapper: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 30,
  },
  colorwayRing: {
    position: "absolute",
    alignSelf: "center",
    width: 208,
    height: 208,
    borderRadius: 104,
    borderWidth: 2,
    top: (200 - 208) / 2,
    shadowOpacity: 0.75,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  title: { fontSize: 22, fontWeight: "700", flex: 1 },
  subtitle: { fontSize: 14 },
  hint: { fontSize: 13, fontWeight: "500" },
  options: { gap: 10 },
  timeline: { gap: 6 },
  timelineTrack: { flexDirection: "row", alignItems: "center" },
  timelineNodeWrapper: { flexDirection: "row", alignItems: "center", flex: 1 },
  timelineNode: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
  },
  timelineNodeDisabled: { opacity: 0.3 },
  timelineConnector: { flex: 1, height: 2 },
  timelineLabelsRow: { flexDirection: "row", justifyContent: "space-between" },
  timelineLabel: { fontSize: 10, textAlign: "center", flex: 1 },
  timelineEndLabels: { flexDirection: "row", justifyContent: "space-between", marginTop: 2 },
  timelineEndLabel: { fontSize: 11, fontStyle: "italic" },
  footer: { padding: 16, paddingBottom: 32 },
  nextBtn: { height: 52, borderRadius: 10, justifyContent: "center", alignItems: "center" },
  nextBtnDisabled: { opacity: 0.35 },
  nextBtnLabel: { fontSize: 16, fontWeight: "700" },
});
