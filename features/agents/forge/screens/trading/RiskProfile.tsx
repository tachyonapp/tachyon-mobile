import { FrameConfig } from "@/constants/frameConfig";
import type { WizardState } from "@/context/WizardContext";
import { ForgeOptionCard } from "@/features/agents/forge/components/ForgeOptionCard";
import { RiskAttitude } from "@/generated/graphql";
import { capitalize } from "@/utils/capitalize";
import { StyleSheet, View } from "react-native";

interface RiskProfileProps {
  frameConfig: FrameConfig | null;
  updateField: <K extends keyof WizardState>(
    field: K,
    value: WizardState[K],
  ) => void;
  disabledReasonFor: (
    frameName: string,
    label: string,
    count: number,
  ) => string;
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

export const RiskProfile = ({
  frameConfig,
  updateField,
  disabledReasonFor,
  riskAttitude,
}: RiskProfileProps) => {
  const riskBounds =
    frameConfig?.bounds.riskAttitude ?? Object.values(RiskAttitude);
  const riskDisabledReason = frameConfig
    ? disabledReasonFor(
        frameConfig.gamifiedName,
        riskBounds.map((r) => capitalize(r)).join(", ") + " risk attitude",
        riskBounds.length,
      )
    : undefined;

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
            disabled={!riskBounds.includes(opt.value)}
            disabledReason={
              !riskBounds.includes(opt.value) ? riskDisabledReason : undefined
            }
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
