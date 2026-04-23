import { ForgeSection } from "@/components/forge/ForgeSection";
import { WizardOptionCard } from "@/components/wizard/WizardOptionCard";
import type { WizardState } from "@/context/WizardContext";
import { ExitPersonalityInput, ExitPersonalityName } from "@/generated/graphql";
import { StyleSheet, View } from "react-native";

interface ExitProps {
  sectors: string[];
  updateField: <K extends keyof WizardState>(
    field: K,
    value: WizardState[K],
  ) => void;
  exitPersonality: ExitPersonalityInput | null;
}

const EXIT_OPTIONS: {
  value: ExitPersonalityName;
  label: string;
  description: string;
}[] = [
  {
    value: ExitPersonalityName.QuickFinisher,
    label: "Quick Finisher",
    description: "Takes profits early. Exits at 1.5× the risk taken.",
  },
  {
    value: ExitPersonalityName.Balanced,
    label: "Balanced",
    description: "Standard profit-taking. Exits at 2× the risk taken.",
  },
  {
    value: ExitPersonalityName.Patient,
    label: "Patient",
    description: "Lets winners run. Trailing stop. Exits at 3× the risk taken.",
  },
];

export const Exit = ({ sectors, updateField, exitPersonality }: ExitProps) => {
  const sectorsSet = sectors.length > 0;

  return (
    <ForgeSection
      title="Exit Strategy"
      subtitle="How should your bot take profits?"
      tooltip={{
        title: "Exit Personality",
        body: "Exit personality controls when your bot closes a winning position.",
      }}
      locked={!sectorsSet}
      lockedMessage="Select at least one sector first."
    >
      <View style={styles.optionList}>
        {EXIT_OPTIONS.map((opt) => (
          <WizardOptionCard
            key={opt.value}
            label={opt.label}
            description={opt.description}
            selected={exitPersonality?.name === opt.value}
            onSelect={() => updateField("exitPersonality", { name: opt.value })}
          />
        ))}
      </View>
    </ForgeSection>
  );
};

const styles = StyleSheet.create({
  optionList: { gap: 10 },
});
