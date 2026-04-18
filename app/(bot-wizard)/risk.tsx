import { EducationalTooltip } from "@/components/wizard/EducationalTooltip";
import { WizardOptionCard } from "@/components/wizard/WizardOptionCard";
import { WizardProgressBar } from "@/components/wizard/WizardProgressBar";
import { WizardStepAnimation } from "@/components/wizard/WizardStepAnimation";
import { FRAME_CONFIG } from "@/constants/frameConfig";
import { Colors } from "@/constants/theme";
import { useWizard } from "@/context/WizardContext";
import { RiskAttitude } from "@/generated/graphql";
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

const RISK_OPTIONS: { value: RiskAttitude; label: string; description: string }[] = [
  {
    value: RiskAttitude.Cautious,
    label: "Cautious",
    description: "Smaller positions. Prioritizes capital protection over upside.",
  },
  {
    value: RiskAttitude.Balanced,
    label: "Balanced",
    description: "Standard position sizing. Balances risk and reward.",
  },
  {
    value: RiskAttitude.Aggressive,
    label: "Aggressive",
    description: "Larger positions. Accepts higher drawdown for more upside.",
  },
];

export default function RiskScreen() {
  const { state, updateField } = useWizard();
  const router = useRouter();

  const bounds = state.frameName
    ? FRAME_CONFIG[state.frameName].bounds.riskAttitude
    : [];

  return (
    <SafeAreaView style={styles.safe}>
      <WizardProgressBar currentStep={2} totalSteps={TOTAL_STEPS} />
      <ScrollView contentContainerStyle={styles.content}>
        <WizardStepAnimation source={null} />
        <View style={styles.titleRow}>
          <Text style={styles.title}>Set Risk Attitude</Text>
          <EducationalTooltip
            title="Risk Attitude"
            body="Risk attitude controls how large each position is relative to your bot's allocated capital."
          />
        </View>
        <Text style={styles.subtitle}>
          How aggressively should your bot size its positions?
        </Text>
        <View style={styles.options}>
          {RISK_OPTIONS.map((opt) => (
            <WizardOptionCard
              key={opt.value}
              label={opt.label}
              description={opt.description}
              selected={state.riskAttitude === opt.value}
              onSelect={() => updateField("riskAttitude", opt.value)}
              disabled={!bounds.includes(opt.value)}
            />
          ))}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Pressable
          onPress={() => router.push("/(bot-wizard)/tempo")}
          disabled={state.riskAttitude === null}
          style={[styles.nextBtn, state.riskAttitude === null && styles.nextBtnDisabled]}
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
  titleRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  title: { color: Colors.dark.textPrimary, fontSize: 22, fontWeight: "700", flex: 1 },
  subtitle: { color: Colors.dark.textSecondary, fontSize: 14 },
  options: { gap: 10 },
  footer: { padding: 16, paddingBottom: 32 },
  nextBtn: {
    height: 52,
    borderRadius: 10,
    backgroundColor: Colors.dark.electricBlue,
    justifyContent: "center",
    alignItems: "center",
  },
  nextBtnDisabled: { opacity: 0.35 },
  nextBtnLabel: { color: Colors.dark.textPrimary, fontSize: 16, fontWeight: "700" },
});
