import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { formatPct } from "@/utils/format-pct";
import React from "react";
import { Section } from "../../components/Section";
import { StatRow } from "../../components/StatRow";

interface ParametersProps {
  riskAttitude: any;
  tradeTempo: any;
  combatPatience: any;
  allocationPct: any;
}

const RISK_ATTITUDE_LABELS: Record<string, string> = {
  CAUTIOUS: "Cautious",
  BALANCED: "Balanced",
  AGGRESSIVE: "Aggressive",
};

const TRADE_TEMPO_LABELS: Record<string, string> = {
  OPPORTUNISTIC: "Opportunistic",
  ACTIVE: "Active",
  RELENTLESS: "Relentless",
};

const COMBAT_PATIENCE_LABELS: Record<string, string> = {
  IMPULSIVE: "Impulsive",
  CALCULATED: "Calculated",
  PATIENT: "Patient",
  STRATEGIC: "Strategic",
};

export const Parameters = ({
  riskAttitude,
  tradeTempo,
  combatPatience,
  allocationPct,
}: ParametersProps) => {
  const theme = Colors[useColorScheme()];

  return (
    <Section title="TRAINING PARAMETERS" theme={theme}>
      <StatRow
        label="Risk Attitude"
        value={
          riskAttitude
            ? (RISK_ATTITUDE_LABELS[riskAttitude] ?? riskAttitude)
            : "—"
        }
        theme={theme}
      />
      <StatRow
        label="Trade Tempo"
        value={
          tradeTempo ? (TRADE_TEMPO_LABELS[tradeTempo] ?? tradeTempo) : "—"
        }
        theme={theme}
      />
      <StatRow
        label="Combat Patience"
        value={
          combatPatience
            ? (COMBAT_PATIENCE_LABELS[combatPatience] ?? combatPatience)
            : "—"
        }
        theme={theme}
      />
      <StatRow
        label="Capital Allocated"
        value={formatPct(allocationPct)}
        theme={theme}
      />
    </Section>
  );
};
