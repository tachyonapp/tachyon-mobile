import { Colors } from "@/constants/theme";
import { useWizard } from "@/context/WizardContext";
import { ForgeNavBar } from "@/features/agents/forge/components/ForgeNavBar";
import { ForgeOptionCard } from "@/features/agents/forge/components/ForgeOptionCard";
import { ForgeSection } from "@/features/agents/forge/components/ForgeSection";
import { FrameAdvisoryBanner } from "@/features/agents/forge/components/FrameAdvisoryBanner";
import { SignalWeightSliders } from "@/features/agents/forge/components/SignalWeightSliders";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  type ConfidenceThreshold,
  type EarningsBehavior,
  type RegimeAwareness,
} from "@tachyonapp/tachyon-queue-types/config";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const CONFIDENCE_OPTIONS: {
  value: ConfidenceThreshold;
  label: string;
  description: string;
}[] = [
  {
    value: "LOW",
    label: "Low",
    description:
      "Your agent proposes trades on weaker signals. More frequent, higher risk.",
  },
  {
    value: "MEDIUM",
    label: "Medium",
    description: "Balanced — proposes when signals are reasonably clear.",
  },
  {
    value: "HIGH",
    label: "High",
    description:
      "Waits for strong confirmation. Fewer trades, higher conviction.",
  },
  {
    value: "VERY_HIGH",
    label: "Very High",
    description:
      "Only acts on very strong signals. May miss some opportunities.",
  },
];

const REGIME_OPTIONS: {
  value: RegimeAwareness;
  label: string;
  description: string;
}[] = [
  {
    value: "NO_CHANGE",
    label: "No Change",
    description: "Ignores broader market regime. Trades as normal regardless.",
  },
  {
    value: "REDUCE_SIZE_BEAR",
    label: "Reduce Size in Bear Markets",
    description:
      "Scales down position sizes when the market is in a bearish trend.",
  },
  {
    value: "STAND_DOWN_BEAR",
    label: "Stand Down in Bear Markets",
    description: "Pauses all trading when the market enters a bearish regime.",
  },
  {
    value: "INCREASE_AGGRESSION_BULL",
    label: "Increase Aggression in Bull Markets",
    description:
      "Scales up position sizes and trade frequency during bullish conditions.",
  },
];

const EARNINGS_OPTIONS: {
  value: EarningsBehavior;
  label: string;
  description: string;
}[] = [
  {
    value: "MORE_AGGRESSIVE",
    label: "More Aggressive",
    description:
      "Increases activity around earnings events to capture price moves.",
  },
  {
    value: "NEUTRAL",
    label: "Neutral",
    description: "No change in behavior during earnings seasons.",
  },
  {
    value: "STAND_DOWN",
    label: "Stand Down",
    description:
      "Avoids opening new positions during earnings windows to limit volatility risk.",
  },
];

export default function Intelligence() {
  const { state, updateField, persistDraft, signalWeightsValid } = useWizard();
  const router = useRouter();
  const theme = Colors[useColorScheme()];
  const [dismissedAdvisories, setDismissedAdvisories] = useState<string[]>([]);

  const visibleAdvisories = state.activeAdvisories.filter(
    (a) => !dismissedAdvisories.includes(a.code),
  );

  const handleDismiss = (code: string) => {
    setDismissedAdvisories((prev) => [...prev, code]);
  };

  async function handleNext() {
    await persistDraft();
    router.push("/(agent-forge)/step-4-sectors");
  }

  async function handleBack() {
    await persistDraft();
    router.back();
  }

  return (
    <>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.scrollContent}
      >
        <Pressable onPress={() => Keyboard.dismiss()}>
          {/* Signal Weights */}
          <ForgeSection
            title="Signal Weights"
            subtitle="Balance how your agent weighs different types of market signals."
          >
            <SignalWeightSliders
              value={state.signalWeights}
              onChange={(v) => updateField("signalWeights", v)}
            />
            {!signalWeightsValid && (
              <Text style={[styles.validationHint, { color: theme.warning }]}>
                Signal weights must add up to 100 before continuing.
              </Text>
            )}
            {visibleAdvisories
              .filter((a) => a.field === "signalWeights")
              .map((a) => (
                <View key={a.code} style={styles.advisorySpacing}>
                  <FrameAdvisoryBanner advisory={a} onDismiss={handleDismiss} />
                </View>
              ))}
          </ForgeSection>

          {/* Confidence Threshold */}
          <ForgeSection
            title="Confidence Threshold"
            subtitle="How strong must a signal be before your agent proposes a trade?"
          >
            {CONFIDENCE_OPTIONS.map((opt) => (
              <ForgeOptionCard
                key={opt.value}
                label={opt.label}
                description={opt.description}
                selected={state.confidenceThreshold === opt.value}
                onSelect={() => updateField("confidenceThreshold", opt.value)}
              />
            ))}
            {visibleAdvisories
              .filter((a) => a.field === "confidenceThreshold")
              .map((a) => (
                <View key={a.code} style={styles.advisorySpacing}>
                  <FrameAdvisoryBanner advisory={a} onDismiss={handleDismiss} />
                </View>
              ))}
          </ForgeSection>

          {/* Regime Awareness */}
          <ForgeSection
            title="Market Regime Awareness"
            subtitle="How should your agent respond to broader market conditions?"
          >
            {REGIME_OPTIONS.map((opt) => (
              <ForgeOptionCard
                key={opt.value}
                label={opt.label}
                description={opt.description}
                selected={state.regimeAwareness === opt.value}
                onSelect={() => updateField("regimeAwareness", opt.value)}
              />
            ))}
            {visibleAdvisories
              .filter((a) => a.field === "regimeAwareness")
              .map((a) => (
                <View key={a.code} style={styles.advisorySpacing}>
                  <FrameAdvisoryBanner advisory={a} onDismiss={handleDismiss} />
                </View>
              ))}
          </ForgeSection>

          {/* Earnings Behavior */}
          <ForgeSection
            title="Earnings Behavior"
            subtitle="How should your agent behave around company earnings announcements?"
          >
            {EARNINGS_OPTIONS.map((opt) => (
              <ForgeOptionCard
                key={opt.value}
                label={opt.label}
                description={opt.description}
                selected={state.earningsBehavior === opt.value}
                onSelect={() => updateField("earningsBehavior", opt.value)}
              />
            ))}
            {visibleAdvisories
              .filter((a) => a.field === "earningsBehavior")
              .map((a) => (
                <View key={a.code} style={styles.advisorySpacing}>
                  <FrameAdvisoryBanner advisory={a} onDismiss={handleDismiss} />
                </View>
              ))}
          </ForgeSection>
        </Pressable>
      </ScrollView>

      <ForgeNavBar
        onBack={handleBack}
        onNext={handleNext}
        nextDisabled={!signalWeightsValid}
      />
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    gap: 28,
    paddingBottom: 16,
  },
  advisorySpacing: {
    marginTop: 8,
  },
  validationHint: {
    fontSize: 13,
    marginTop: 6,
  },
});
