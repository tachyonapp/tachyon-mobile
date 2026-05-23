import type { WizardState } from "@/context/WizardContext";
import { ForgeOptionCard } from "@/features/agents/forge/components/ForgeOptionCard";
import { ForgeSection } from "@/features/agents/forge/components/ForgeSection";
import { FrameAdvisoryBanner } from "@/features/agents/forge/components/FrameAdvisoryBanner";
import {
  FrameAdvisory,
  RegimeAwareness,
} from "@tachyonapp/tachyon-queue-types/config";
import React from "react";
import { StyleSheet, View } from "react-native";

interface AwarenessProps {
  visibleAdvisories: FrameAdvisory[];
  regimeAwareness: RegimeAwareness | null;
  updateField: <K extends keyof WizardState>(
    field: K,
    value: WizardState[K],
  ) => void;
  handleDismiss: (code: string) => void;
}

const REGIME_OPTIONS: {
  value: RegimeAwareness;
  label: string;
  description: string;
}[] = [
  {
    value: RegimeAwareness.NO_CHANGE,
    label: "No Change",
    description: "Ignores broader market regime. Trades as normal regardless.",
  },
  {
    value: RegimeAwareness.REDUCE_SIZE_BEAR,
    label: "Reduce Size in Bear Markets",
    description:
      "Scales down position sizes when the market is in a bearish trend.",
  },
  {
    value: RegimeAwareness.STAND_DOWN_BEAR,
    label: "Stand Down in Bear Markets",
    description: "Pauses all trading when the market enters a bearish regime.",
  },
  {
    value: RegimeAwareness.INCREASE_AGGRESSION_BULL,
    label: "Increase Aggression in Bull Markets",
    description:
      "Scales up position sizes and trade frequency during bullish conditions.",
  },
];

export const Awareness = ({
  visibleAdvisories,
  regimeAwareness,
  updateField,
  handleDismiss,
}: AwarenessProps) => {
  return (
    <ForgeSection
      title="Market Regime Awareness"
      subtitle="How should your agent respond to broader market conditions?"
    >
      {REGIME_OPTIONS.map((opt) => (
        <ForgeOptionCard
          key={opt.value}
          label={opt.label}
          description={opt.description}
          selected={regimeAwareness === opt.value}
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
  );
};

const styles = StyleSheet.create({
  advisorySpacing: {
    marginTop: 8,
  },
});
