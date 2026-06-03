import type { WizardState } from "@/context/WizardContext";
import { ForgeOptionCard } from "@/features/agents/forge/components/ForgeOptionCard";
import { ForgeSection } from "@/features/agents/forge/components/ForgeSection";
import { DividendPreference } from "@tachyonapp/tachyon-queue-types/config";
import { StyleSheet, View } from "react-native";

interface DividendProps {
  updateField: <K extends keyof WizardState>(
    field: K,
    value: WizardState[K],
  ) => void;
  combatComplete: boolean;
  dividendPreference: DividendPreference | null;
}

const DIVIDEND_OPTIONS: {
  value: DividendPreference;
  label: string;
  description: string;
}[] = [
  {
    value: DividendPreference.PREFER_DIVIDEND,
    label: "Prefer Dividend Stocks",
    description: "Favors stocks that pay regular dividends.",
  },
  {
    value: DividendPreference.NO_PREFERENCE,
    label: "No Preference",
    description: "Dividend status has no bearing on stock selection.",
  },
  {
    value: DividendPreference.EXCLUDE_DIVIDEND,
    label: "Exclude Dividend Stocks",
    description: "Avoids dividend-paying stocks entirely.",
  },
];

export const Dividend = ({
  updateField,
  combatComplete,
  dividendPreference,
}: DividendProps) => {
  return (
    <ForgeSection
      title="Dividend Preference"
      subtitle="How should your agent treat dividend-paying stocks?"
      locked={!combatComplete}
      lockedMessage="Complete your Trading Profile first."
    >
      <View style={styles.container}>
        {DIVIDEND_OPTIONS.map((opt) => (
          <ForgeOptionCard
            key={opt.value}
            label={opt.label}
            description={opt.description}
            selected={dividendPreference === opt.value}
            onSelect={() => updateField("dividendPreference", opt.value)}
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
