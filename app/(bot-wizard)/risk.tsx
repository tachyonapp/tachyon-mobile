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
import LottieView from "lottie-react-native";
import React, { useEffect, useRef } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const RISK_ANIMATION = require("@/assets/animations/risk.json");

const NEEDLE_FRAMES: Record<RiskAttitude, number> = {
  [RiskAttitude.Cautious]: 27,
  [RiskAttitude.Balanced]: 52,
  [RiskAttitude.Aggressive]: 70,
};

const TOTAL_STEPS = 13;
type LottieViewWithGoToAndStop = LottieView & {
  play: (startFrame?: number, endFrame?: number) => void;
};

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
  const lottieRef = useRef<LottieViewWithGoToAndStop>(null);

  const bounds = state.frameName
    ? FRAME_CONFIG[state.frameName].bounds.riskAttitude
    : [];

  const frameConfig = state.frameName ? FRAME_CONFIG[state.frameName] : null;
  const supportedRiskLabels = bounds
    .map((r) => r.charAt(0).toUpperCase() + r.slice(1).toLowerCase())
    .join(", ");
  const disabledReason = frameConfig
    ? `${frameConfig.gamifiedName} only supports ${supportedRiskLabels} risk attitude${bounds.length !== 1 ? "s" : ""}.`
    : undefined;

  useEffect(() => {
    const ref = lottieRef.current;
    if (!ref) return;
    if (state.riskAttitude) {
      const frame = NEEDLE_FRAMES[state.riskAttitude];
      ref.play(frame, frame + 1);
    } else {
      ref.play();
    }
  }, [state.riskAttitude]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <WizardProgressBar currentStep={2} totalSteps={TOTAL_STEPS} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.animationWrapper}>
          <WizardStepAnimation ref={lottieRef} source={RISK_ANIMATION} />
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
              disabledReason={
                !bounds.includes(opt.value) ? disabledReason : undefined
              }
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
