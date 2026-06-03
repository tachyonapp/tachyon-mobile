import { Colors } from "@/constants/theme";
import type { WizardState } from "@/context/WizardContext";
import { ForgeSection } from "@/features/agents/forge/components/ForgeSection";
import { FrameAdvisoryBanner } from "@/features/agents/forge/components/FrameAdvisoryBanner";
import { SignalWeightSliders } from "@/features/agents/forge/components/SignalWeightSliders";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  FrameAdvisory,
  type SignalWeights as SignalWeightsValue,
} from "@tachyonapp/tachyon-queue-types/config";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface SignalWeightsProps {
  signalWeights: SignalWeightsValue;
  signalWeightsValid: boolean;
  updateField: <K extends keyof WizardState>(
    field: K,
    value: WizardState[K],
  ) => void;
  handleDismiss: (code: string) => void;
  visibleAdvisories: FrameAdvisory[];
}

export const SignalWeights = ({
  signalWeights,
  signalWeightsValid,
  updateField,
  handleDismiss,
  visibleAdvisories,
}: SignalWeightsProps) => {
  const theme = Colors[useColorScheme()];

  return (
    <ForgeSection
      title="Signal Weights"
      subtitle="How your agent weighs different types of market signals."
      tooltip={{
        title: "Signal Weights",
        body: "Signal weights control how much your agent prioritizes each category of market signal when scoring trade candidates. Technicals cover chart patterns and momentum. News & Sentiment tracks headlines and market mood. Fundamentals look at earnings, valuations, and financials. Weights must add up to 100.",
      }}
    >
      <SignalWeightSliders
        value={signalWeights}
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
  );
};

const styles = StyleSheet.create({
  advisorySpacing: {
    marginTop: 8,
  },
  validationHint: {
    fontSize: 13,
    marginTop: 6,
  },
});
