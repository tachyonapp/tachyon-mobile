import type { WizardState } from "@/context/WizardContext";
import { ForgeOptionCard } from "@/features/agents/forge/components/ForgeOptionCard";
import { ForgeSection } from "@/features/agents/forge/components/ForgeSection";
import { FrameAdvisoryBanner } from "@/features/agents/forge/components/FrameAdvisoryBanner";
import {
  EarningsBehavior,
  FrameAdvisory,
} from "@tachyonapp/tachyon-queue-types/config";
import React from "react";
import { StyleSheet, View } from "react-native";

interface EarningsProps {
  visibleAdvisories: FrameAdvisory[];
  earningsBehavior: EarningsBehavior | null;
  updateField: <K extends keyof WizardState>(
    field: K,
    value: WizardState[K],
  ) => void;
  handleDismiss: (code: string) => void;
}

const EARNINGS_OPTIONS: {
  value: EarningsBehavior;
  label: string;
  description: string;
}[] = [
  {
    value: EarningsBehavior.MORE_AGGRESSIVE,
    label: "More Aggressive",
    description:
      "Increases activity around earnings events to capture price moves.",
  },
  {
    value: EarningsBehavior.NEUTRAL,
    label: "Neutral",
    description: "No change in behavior during earnings seasons.",
  },
  {
    value: EarningsBehavior.STAND_DOWN,
    label: "Stand Down",
    description:
      "Avoids opening new positions during earnings windows to limit volatility risk.",
  },
];

export const Earnings = ({
  visibleAdvisories,
  earningsBehavior,
  updateField,
  handleDismiss,
}: EarningsProps) => {
  return (
    <ForgeSection
      title="Earnings Behavior"
      subtitle="How should your agent behave around company earnings announcements?"
      tooltip={{
        title: "Earnings Behavior",
        body: "The earnings behavior settings control how your agent behaves around company earnings announcements. More aggressive behavior means it opens more positions around earnings announcements. Neutral behavior means it trades as normal regardless of earnings announcements. Stand down behavior means it avoids opening new positions around earnings announcements.",
      }}
    >
      <View style={styles.container}>
        {EARNINGS_OPTIONS.map((opt) => (
          <ForgeOptionCard
            key={opt.value}
            label={opt.label}
            description={opt.description}
            selected={earningsBehavior === opt.value}
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
      </View>
    </ForgeSection>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
    marginTop: 20,
  },
  advisorySpacing: {
    marginTop: 8,
  },
});
