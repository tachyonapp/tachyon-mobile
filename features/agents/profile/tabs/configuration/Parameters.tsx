import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { Section } from "../../components/Section";
import { StatRow } from "../../components/StatRow";

interface ParametersProps {
  riskAttitude: any;
  tradeTempo: any;
  combatPatience: any;
  capitalAllocatedUsd: any;
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
  capitalAllocatedUsd,
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
        value={
          capitalAllocatedUsd != null
            ? Number(capitalAllocatedUsd).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
              })
            : "—"
        }
        theme={theme}
      />
    </Section>
  );
};
