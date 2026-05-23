import { Colors } from "@/constants/theme";
import type { WizardState } from "@/context/WizardContext";
import { ForgeOptionCard } from "@/features/agents/forge/components/ForgeOptionCard";
import { CombatPatience } from "@/generated/graphql";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { StyleSheet, Text, View } from "react-native";

interface PatienceProps {
  combatPatience: CombatPatience | null;
  updateField: <K extends keyof WizardState>(
    field: K,
    value: WizardState[K],
  ) => void;
}

const PATIENCE_OPTIONS: {
  value: CombatPatience;
  label: string;
  description: string;
}[] = [
  {
    value: CombatPatience.IMPULSIVE,
    label: "Impulsive",
    description:
      "Exits quickly. No minimum hold. Reactive to short-term signals.",
  },
  {
    value: CombatPatience.CALCULATED,
    label: "Calculated",
    description: "Short commitment. Gives trades a few hours to play out.",
  },
  {
    value: CombatPatience.PATIENT,
    label: "Patient",
    description: "Holds overnight. Waits for meaningful price movement.",
  },
  {
    value: CombatPatience.STRATEGIC,
    label: "Strategic",
    description:
      "Multi-day holds. Conviction-driven. Ignores short-term noise.",
  },
];

const PATIENCE_HINTS: Record<CombatPatience, string> = {
  [CombatPatience.IMPULSIVE]: "No minimum hold. Can exit same day.",
  [CombatPatience.CALCULATED]: "Minimum hold: 4 hours",
  [CombatPatience.PATIENT]: "Minimum hold: 24 hours",
  [CombatPatience.STRATEGIC]: "Minimum hold: 72 hours (3 days)",
};

export const Patience = ({ combatPatience, updateField }: PatienceProps) => {
  const theme = Colors[useColorScheme()];

  return (
    <View style={styles.subSection}>
      {combatPatience && (
        <Text style={[styles.hint, { color: theme.electricBlue }]}>
          {PATIENCE_HINTS[combatPatience]}
        </Text>
      )}
      <View style={styles.optionList}>
        {PATIENCE_OPTIONS.map((opt) => (
          <ForgeOptionCard
            key={opt.value}
            label={opt.label}
            description={opt.description}
            selected={combatPatience === opt.value}
            onSelect={() => updateField("combatPatience", opt.value)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  subSection: { gap: 10, marginBottom: 20, marginTop: 20 },
  optionList: { gap: 10 },
  hint: { fontSize: 15, fontWeight: "500", textAlign: "left", marginLeft: 5 },
});
