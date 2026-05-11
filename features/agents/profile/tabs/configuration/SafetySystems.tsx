import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { formatPct } from "@/utils/format-pct";
import { formatStyleName } from "@/utils/format-style-name";
import React from "react";
import { Section } from "../../components/Section";
import { StatRow } from "../../components/StatRow";

interface SafetySystemsProps {
  dailyMaxLoss: number;
  dailyMaxGain: number;
  stopStyle: string | null | undefined;
}

export const SafetySystems = ({
  dailyMaxGain,
  dailyMaxLoss,
  stopStyle,
}: SafetySystemsProps) => {
  const theme = Colors[useColorScheme()];

  return (
    <Section title="SAFETY SYSTEMS" theme={theme}>
      <StatRow
        label="Daily Max Loss"
        value={formatPct(dailyMaxLoss)}
        theme={theme}
      />
      <StatRow
        label="Daily Max Gain"
        value={dailyMaxGain != null ? formatPct(dailyMaxGain) : "—"}
        theme={theme}
      />
      <StatRow
        label="Stop Style"
        value={formatStyleName(stopStyle)}
        theme={theme}
      />
    </Section>
  );
};
