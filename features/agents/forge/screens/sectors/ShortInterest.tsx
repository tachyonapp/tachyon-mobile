import type { WizardState } from "@/context/WizardContext";
import { ForgeOptionCard } from "@/features/agents/forge/components/ForgeOptionCard";
import { ForgeSection } from "@/features/agents/forge/components/ForgeSection";
import { ShortInterestSignal } from "@tachyonapp/tachyon-queue-types/config";
import { StyleSheet, View } from "react-native";

interface ShortInterestProps {
  updateField: <K extends keyof WizardState>(
    field: K,
    value: WizardState[K],
  ) => void;
  combatComplete: boolean;
  shortInterestSignal: ShortInterestSignal | null;
}

const SHORT_INTEREST_OPTIONS: {
  value: ShortInterestSignal;
  label: string;
  description: string;
}[] = [
  {
    value: ShortInterestSignal.TARGET_SHORT_SQUEEZE,
    label: "Target Short Squeeze Candidates",
    description:
      "Actively seeks stocks with high short interest as potential squeeze setups.",
  },
  {
    value: ShortInterestSignal.AVOID_HIGH_SHORT_INTEREST,
    label: "Avoid High Short Interest",
    description:
      "Steers clear of heavily shorted stocks to reduce volatility risk.",
  },
  {
    value: ShortInterestSignal.IGNORE,
    label: "Ignore",
    description: "Short interest data is not factored into stock selection.",
  },
];

export const ShortInterest = ({
  updateField,
  combatComplete,
  shortInterestSignal,
}: ShortInterestProps) => {
  return (
    <ForgeSection
      title="Short Interest Signal"
      subtitle="How should your agent use short interest data in its analysis?"
      locked={!combatComplete}
      lockedMessage="Complete your Trading Profile first."
    >
      <View style={styles.container}>
        {SHORT_INTEREST_OPTIONS.map((opt) => (
          <ForgeOptionCard
            key={opt.value}
            label={opt.label}
            description={opt.description}
            selected={shortInterestSignal === opt.value}
            onSelect={() => updateField("shortInterestSignal", opt.value)}
          />
        ))}
      </View>
    </ForgeSection>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginTop: 20,
  },
});
