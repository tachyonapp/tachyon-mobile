import type { WizardState } from "@/context/WizardContext";
import { ForgeOptionCard } from "@/features/agents/forge/components/ForgeOptionCard";
import { ForgeSection } from "@/features/agents/forge/components/ForgeSection";
import { FrameAdvisoryBanner } from "@/features/agents/forge/components/FrameAdvisoryBanner";
import {
  ConfidenceThreshold,
  FrameAdvisory,
} from "@tachyonapp/tachyon-queue-types/config";
import React from "react";
import { StyleSheet, View } from "react-native";

interface ConfidenceProps {
  confidenceThreshold: ConfidenceThreshold | null;
  updateField: <K extends keyof WizardState>(
    field: K,
    value: WizardState[K],
  ) => void;
  visibleAdvisories: FrameAdvisory[];
  handleDismiss: (code: string) => void;
}

const CONFIDENCE_OPTIONS: {
  value: ConfidenceThreshold;
  label: string;
  description: string;
}[] = [
  {
    value: ConfidenceThreshold.LOW,
    label: "Low",
    description:
      "Your agent proposes trades on weaker signals. More frequent, higher risk.",
  },
  {
    value: ConfidenceThreshold.MEDIUM,
    label: "Medium",
    description: "Balanced — proposes when signals are reasonably clear.",
  },
  {
    value: ConfidenceThreshold.HIGH,
    label: "High",
    description:
      "Waits for strong confirmation. Fewer trades, higher conviction.",
  },
  {
    value: ConfidenceThreshold.VERY_HIGH,
    label: "Very High",
    description:
      "Only acts on very strong signals. May miss some opportunities.",
  },
];

export const Confidence = ({
  confidenceThreshold,
  updateField,
  visibleAdvisories,
  handleDismiss,
}: ConfidenceProps) => {
  return (
    <ForgeSection
      title="Confidence Threshold"
      subtitle="How strong must a signal be before your agent proposes a trade?"
    >
      {CONFIDENCE_OPTIONS.map((opt) => (
        <ForgeOptionCard
          key={opt.value}
          label={opt.label}
          description={opt.description}
          selected={confidenceThreshold === opt.value}
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
  );
};

const styles = StyleSheet.create({
  advisorySpacing: {
    marginTop: 8,
  },
});
