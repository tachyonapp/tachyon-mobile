import { EducationalTooltip } from "@/components/wizard/EducationalTooltip";
import { RiskShape } from "@/components/wizard/RiskShapeIndicator";
import { WizardOptionCard } from "@/components/wizard/WizardOptionCard";
import { WizardProgressBar } from "@/components/wizard/WizardProgressBar";
import { WizardStepAnimation } from "@/components/wizard/WizardStepAnimation";
import { FRAME_CONFIG } from "@/constants/frameConfig";
import { Colors } from "@/constants/theme";
import { useWizard } from "@/context/WizardContext";
import { RiskAttitude } from "@/generated/graphql";
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

const RISK_OPTIONS: {
  value: RiskAttitude;
  label: string;
  description: string;
}[] = [
  {
    value: RiskAttitude.Cautious,
    label: "Cautious",
    description:
      "Smaller positions. Prioritizes capital protection over upside.",
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
  const theme = Colors[useColorScheme()];
  const { state, updateField } = useWizard();
  const router = useRouter();

  const bounds = state.frameName
    ? FRAME_CONFIG[state.frameName].bounds.riskAttitude
    : [];
  const frameColorway = state.frameName
    ? FRAME_CONFIG[state.frameName].colorway
    : null;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <WizardProgressBar currentStep={2} totalSteps={TOTAL_STEPS} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.animationWrapper}>
          <WizardStepAnimation source={EYE_ANIMATION} />
          {frameColorway && (
            <View
              pointerEvents="none"
              style={[
                styles.colorwayRing,
                {
                  borderColor: frameColorway,
                  shadowColor: frameColorway,
                },
              ]}
            />
          )}
        </View>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            Set Risk Attitude
          </Text>
          <EducationalTooltip
            title="Risk Attitude"
            body="Risk attitude controls how large each position is relative to your bot's allocated capital."
          />
        </View>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
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
              icon={<RiskShape riskAttitude={opt.value} size={14} />}
            />
          ))}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Pressable
          onPress={() => router.push("/(bot-wizard)/tempo")}
          disabled={state.riskAttitude === null}
          style={[
            styles.nextBtn,
            { backgroundColor: theme.electricBlue },
            state.riskAttitude === null && styles.nextBtnDisabled,
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
