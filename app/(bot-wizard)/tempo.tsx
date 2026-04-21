import { EducationalTooltip } from "@/components/wizard/EducationalTooltip";
import { RiskShapeIndicator } from "@/components/wizard/RiskShapeIndicator";
import { TempoWaveform } from "@/components/wizard/TempoWaveformIndicator";
import { WizardOptionCard } from "@/components/wizard/WizardOptionCard";
import { WizardProgressBar } from "@/components/wizard/WizardProgressBar";
import { WizardStepAnimation } from "@/components/wizard/WizardStepAnimation";
import { FRAME_CONFIG } from "@/constants/frameConfig";
import { Colors } from "@/constants/theme";
import { useWizard } from "@/context/WizardContext";
import { TradeTempo } from "@/generated/graphql";
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

const TEMPO_HINTS: Record<TradeTempo, string> = {
  [TradeTempo.Opportunistic]: "At most one proposal per hour",
  [TradeTempo.Active]: "At most one proposal every 20 minutes",
  [TradeTempo.Relentless]: "Scans every 5 minutes — fires when ready",
};

const TEMPO_OPTIONS: {
  value: TradeTempo;
  label: string;
  description: string;
}[] = [
  {
    value: TradeTempo.Opportunistic,
    label: "Opportunistic",
    description: "Waits for high-conviction setups. Trades infrequently.",
  },
  {
    value: TradeTempo.Active,
    label: "Active",
    description: "Consistent scanning. Fires when conditions align.",
  },
  {
    value: TradeTempo.Relentless,
    label: "Relentless",
    description:
      "Scans constantly. High trade frequency — maximum opportunity capture.",
  },
];

export default function TempoScreen() {
  const theme = Colors[useColorScheme()];
  const { state, updateField } = useWizard();
  const router = useRouter();

  const bounds = state.frameName
    ? FRAME_CONFIG[state.frameName].bounds.tradeTempo
    : [];
  const frameColorway = state.frameName
    ? FRAME_CONFIG[state.frameName].colorway
    : null;
  const tempoHint = state.tradeTempo ? TEMPO_HINTS[state.tradeTempo] : null;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <WizardProgressBar currentStep={3} totalSteps={TOTAL_STEPS} />
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
        </View>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            Set Trade Tempo
          </Text>
          <EducationalTooltip
            title="Trade Tempo"
            body="Trade tempo controls how often your bot looks for new opportunities."
          />
        </View>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          How frequently should your bot scan for trades?
        </Text>
        {tempoHint && (
          <Text style={[styles.hint, { color: theme.electricBlue }]}>
            {tempoHint}
          </Text>
        )}
        <View style={styles.options}>
          {TEMPO_OPTIONS.map((opt) => (
            <WizardOptionCard
              key={opt.value}
              label={opt.label}
              description={opt.description}
              selected={state.tradeTempo === opt.value}
              onSelect={() => updateField("tradeTempo", opt.value)}
              disabled={!bounds.includes(opt.value)}
              icon={<TempoWaveform tradeTempo={opt.value} />}
            />
          ))}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Pressable
          onPress={() => router.push("/(bot-wizard)/patience")}
          disabled={state.tradeTempo === null}
          style={[
            styles.nextBtn,
            { backgroundColor: theme.electricBlue },
            state.tradeTempo === null && styles.nextBtnDisabled,
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
