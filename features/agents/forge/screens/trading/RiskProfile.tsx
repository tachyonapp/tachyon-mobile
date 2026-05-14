import type { WizardState } from "@/context/WizardContext";
import { ForgeOptionCard } from "@/features/agents/forge/components/ForgeOptionCard";
import { RiskAttitude } from "@/generated/graphql";
import { StyleSheet, View } from "react-native";

interface RiskProfileProps {
  updateField: <K extends keyof WizardState>(
    field: K,
    value: WizardState[K],
  ) => void;
  riskAttitude: RiskAttitude | null;
}

const RISK_OPTIONS: {
  value: RiskAttitude;
  label: string;
  description: string;
}[] = [
  {
    value: RiskAttitude.CAUTIOUS,
    label: "Cautious",
    description:
      "Smaller positions. Prioritizes capital protection over upside.",
  },
  {
    value: RiskAttitude.BALANCED,
    label: "Balanced",
    description: "Standard position sizing. Balances risk and reward.",
  },
  {
    value: RiskAttitude.AGGRESSIVE,
    label: "Aggressive",
    description: "Larger positions. Accepts higher drawdown for more upside.",
  },
];

export const RiskProfile = ({ updateField, riskAttitude }: RiskProfileProps) => {
  return (
    <View style={styles.subSection}>
      <View style={styles.optionList}>
        {RISK_OPTIONS.map((opt) => (
          <ForgeOptionCard
            key={opt.value}
            label={opt.label}
            description={opt.description}
            selected={riskAttitude === opt.value}
            onSelect={() => updateField("riskAttitude", opt.value)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  subSection: { gap: 10, marginBottom: 10, marginTop: 10 },
  optionList: { gap: 10 },
});
