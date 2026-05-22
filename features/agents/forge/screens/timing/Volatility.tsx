import type { WizardState } from "@/context/WizardContext";
import { ForgeOptionCard } from "@/features/agents/forge/components/ForgeOptionCard";
import { ForgeSection } from "@/features/agents/forge/components/ForgeSection";
import { FrameAdvisoryBanner } from "@/features/agents/forge/components/FrameAdvisoryBanner";
import {
  FrameAdvisory,
  VolatilityEnvPreference,
} from "@tachyonapp/tachyon-queue-types/config";
import React from "react";
import { StyleSheet, View } from "react-native";

interface VolatilityProps {
  visibleAdvisories: FrameAdvisory[];
  volatilityEnvPreference: VolatilityEnvPreference | null;
  updateField: <K extends keyof WizardState>(
    field: K,
    value: WizardState[K],
  ) => void;
  handleDismiss: (code: string) => void;
}

const VOLATILITY_OPTIONS: {
  value: VolatilityEnvPreference;
  label: string;
  description: string;
}[] = [
  {
    value: VolatilityEnvPreference.PREFERS_LOW_VIX,
    label: "Prefers Calm Markets",
    description:
      "More active when the VIX is low. Pulls back in high-volatility environments.",
  },
  {
    value: VolatilityEnvPreference.PREFERS_HIGH_VIX,
    label: "Prefers Volatile Markets",
    description:
      "Thrives when the VIX is elevated. Seeks larger intraday moves.",
  },
  {
    value: VolatilityEnvPreference.NO_PREFERENCE,
    label: "No Preference",
    description: "Trades in any volatility environment without adjustment.",
  },
];

export const Volatility = ({
  visibleAdvisories,
  volatilityEnvPreference,
  updateField,
  handleDismiss,
}: VolatilityProps) => {
  return (
    <ForgeSection
      title="Volatility Environment"
      subtitle="How should your agent respond to broad market volatility conditions?"
    >
      {VOLATILITY_OPTIONS.map((opt) => (
        <ForgeOptionCard
          key={opt.value}
          label={opt.label}
          description={opt.description}
          selected={volatilityEnvPreference === opt.value}
          onSelect={() => updateField("volatilityEnvPreference", opt.value)}
        />
      ))}
      {visibleAdvisories
        .filter((a) => a.field === "volatilityEnvPreference")
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
