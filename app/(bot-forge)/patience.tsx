import { EducationalTooltip } from "@/components/wizard/EducationalTooltip";
import { WizardOptionCard } from "@/components/wizard/WizardOptionCard";
import { FrameConfig } from "@/constants/frameConfig";
import { Colors } from "@/constants/theme";
import type { WizardState } from "@/context/WizardContext";
import { CombatPatience } from "@/generated/graphql";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { capitalize } from "@/utils/capitalize";
import { StyleSheet, Text, View } from "react-native";

interface PatienceProps {
  frameConfig: FrameConfig | null;
  combatPatience: CombatPatience | null;
  updateField: <K extends keyof WizardState>(
    field: K,
    value: WizardState[K],
  ) => void;
  disabledReasonFor: (
    frameName: string,
    label: string,
    count: number,
  ) => string;
}

const PATIENCE_OPTIONS: {
  value: CombatPatience;
  label: string;
  description: string;
}[] = [
  {
    value: CombatPatience.Impulsive,
    label: "Impulsive",
    description:
      "Exits quickly. No minimum hold. Reactive to short-term signals.",
  },
  {
    value: CombatPatience.Calculated,
    label: "Calculated",
    description: "Short commitment. Gives trades a few hours to play out.",
  },
  {
    value: CombatPatience.Patient,
    label: "Patient",
    description: "Holds overnight. Waits for meaningful price movement.",
  },
  {
    value: CombatPatience.Strategic,
    label: "Strategic",
    description:
      "Multi-day holds. Conviction-driven. Ignores short-term noise.",
  },
];

const PATIENCE_HINTS: Record<CombatPatience, string> = {
  [CombatPatience.Impulsive]: "No minimum hold. Can exit same day.",
  [CombatPatience.Calculated]: "Minimum hold: 4 hours",
  [CombatPatience.Patient]: "Minimum hold: 24 hours",
  [CombatPatience.Strategic]: "Minimum hold: 72 hours (3 days)",
};

export const Patience = ({
  frameConfig,
  combatPatience,
  updateField,
  disabledReasonFor,
}: PatienceProps) => {
  const theme = Colors[useColorScheme()];
  const patienceBounds =
    frameConfig?.bounds.combatPatience ?? Object.values(CombatPatience);
  const patienceDisabledReason = frameConfig
    ? disabledReasonFor(
        frameConfig.gamifiedName,
        patienceBounds.map((p) => capitalize(p)).join(", ") + " patience",
        patienceBounds.length,
      )
    : undefined;

  return (
    <View style={styles.subSection}>
      <View style={styles.subSectionHeader}>
        <Text style={[styles.subSectionTitle, { color: theme.textPrimary }]}>
          Combat Patience
        </Text>
        <EducationalTooltip
          title="Combat Patience"
          body="Combat patience sets how long your bot must hold a position before exiting. Longer holds reduce PDT risk."
        />
      </View>
      {combatPatience && (
        <Text style={[styles.hint, { color: theme.electricBlue }]}>
          {PATIENCE_HINTS[combatPatience]}
        </Text>
      )}
      <View style={styles.optionList}>
        {PATIENCE_OPTIONS.map((opt) => (
          <WizardOptionCard
            key={opt.value}
            label={opt.label}
            description={opt.description}
            selected={combatPatience === opt.value}
            onSelect={() => updateField("combatPatience", opt.value)}
            disabled={!patienceBounds.includes(opt.value)}
            disabledReason={
              !patienceBounds.includes(opt.value)
                ? patienceDisabledReason
                : undefined
            }
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  subSection: { gap: 10, marginBottom: 20, marginTop: 20 },
  subSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  subSectionTitle: { fontSize: 15, fontWeight: "600", flex: 1 },
  optionList: { gap: 10 },
  hint: { fontSize: 13, fontWeight: "500" },
});
