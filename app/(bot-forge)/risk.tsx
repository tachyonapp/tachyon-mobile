import { EducationalTooltip } from "@/components/wizard/EducationalTooltip";
import { WizardOptionCard } from "@/components/wizard/WizardOptionCard";
import { FrameConfig } from "@/constants/frameConfig";
import { Colors } from "@/constants/theme";
import type { WizardState } from "@/context/WizardContext";
import { RiskAttitude } from "@/generated/graphql";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { capitalize } from "@/utils/capitalize";
import { StyleSheet, Text, View } from "react-native";

interface RiskProps {
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
    value: RiskAttitude.Cautious,
    label: "Cautious",
    description:
      "Smaller positions. Prioritizes capital protection over upside.",
  },
  {
    value: RiskAttitude.Balanced,
    label: "Balanced",
    description: "Standard position sizing. Balances risk and reward.",
  },
  {
    value: RiskAttitude.Aggressive,
    label: "Aggressive",
    description: "Larger positions. Accepts higher drawdown for more upside.",
  },
];

export const Risk = ({
  frameConfig,
  updateField,
  disabledReasonFor,
  riskAttitude,
}: RiskProps) => {
  const theme = Colors[useColorScheme()];
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
      <View style={styles.subSectionHeader}>
        <Text style={[styles.subSectionTitle, { color: theme.textPrimary }]}>
          Risk Attitude
        </Text>
        <EducationalTooltip
          title="Risk Attitude"
          body="Risk attitude controls how large each position is relative to your bot's allocated capital."
        />
      </View>
      <View style={styles.optionList}>
        {RISK_OPTIONS.map((opt) => (
          <WizardOptionCard
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
  subSection: { gap: 10, marginBottom: 20, marginTop: 20 },
  subSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  subSectionTitle: { fontSize: 15, fontWeight: "600", flex: 1 },
  optionList: { gap: 10 },
});
