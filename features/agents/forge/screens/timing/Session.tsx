import type { WizardState } from "@/context/WizardContext";
import { ForgeOptionCard } from "@/features/agents/forge/components/ForgeOptionCard";
import { ForgeSection } from "@/features/agents/forge/components/ForgeSection";
import { FrameAdvisoryBanner } from "@/features/agents/forge/components/FrameAdvisoryBanner";
import {
  FrameAdvisory,
  SessionPreference,
} from "@tachyonapp/tachyon-queue-types/config";
import React from "react";
import { StyleSheet, View } from "react-native";

interface SessionProps {
  sessionPreference: SessionPreference | null;
  visibleAdvisories: FrameAdvisory[];
  updateField: <K extends keyof WizardState>(
    field: K,
    value: WizardState[K],
  ) => void;
  handleDismiss: (code: string) => void;
}

const SESSION_OPTIONS: {
  value: SessionPreference;
  label: string;
  description: string;
}[] = [
  {
    value: SessionPreference.FULL_SESSION,
    label: "Full Session",
    description: "Trades throughout the entire market session (9:30am–4pm ET).",
  },
  {
    value: SessionPreference.MORNING_HUNTER,
    label: "Morning Hunter (9:30–12pm)",
    description:
      "Focuses activity in the morning when volume and price discovery are highest.",
  },
  {
    value: SessionPreference.AFTERNOON_HUNTER,
    label: "Afternoon Hunter (12–4pm)",
    description:
      "Focuses activity in the afternoon session after morning noise settles.",
  },
  {
    value: SessionPreference.AVOID_FIRST_30,
    label: "Avoid First 30 Min",
    description:
      "Skips the opening 30 minutes to avoid erratic spreads. Trades from 10am onward.",
  },
];

export const Session = ({
  sessionPreference,
  visibleAdvisories,
  updateField,
  handleDismiss,
}: SessionProps) => {
  return (
    <ForgeSection
      title="Session Preference"
      subtitle="Which part of the trading day should your agent focus on?"
    >
      <View style={styles.container}>
        {SESSION_OPTIONS.map((opt) => (
          <ForgeOptionCard
            key={opt.value}
            label={opt.label}
            description={opt.description}
            selected={sessionPreference === opt.value}
            onSelect={() => updateField("sessionPreference", opt.value)}
          />
        ))}
        {visibleAdvisories
          .filter((a) => a.field === "sessionPreference")
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
