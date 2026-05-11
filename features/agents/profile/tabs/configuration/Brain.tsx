import { Colors } from "@/constants/theme";
import { BotBrainConfig } from "@/generated/graphql";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { Section } from "../../components/Section";
import { StatRow } from "../../components/StatRow";

interface BrainProps {
  agentBrainConfig: BotBrainConfig | undefined | null;
}

export const Brain = ({ agentBrainConfig }: BrainProps) => {
  const theme = Colors[useColorScheme()];
  return (
    <Section title="BRAIN" theme={theme}>
      <StatRow
        label="Brain Type"
        value={agentBrainConfig?.brainType ?? "—"}
        theme={theme}
      />
      <StatRow
        label="Model"
        value={agentBrainConfig?.modelId ?? "—"}
        theme={theme}
      />
      <StatRow
        label="Provider"
        value={agentBrainConfig?.provider ?? "—"}
        theme={theme}
      />
    </Section>
  );
};
