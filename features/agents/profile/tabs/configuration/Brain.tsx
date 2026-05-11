import { Colors } from "@/constants/theme";
import { BotBrainConfig } from "@/generated/graphql";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { Section } from "../../components/Section";
import { StatRow } from "../../components/StatRow";

interface BrainProps {
  botBrainConfig: BotBrainConfig | undefined | null;
}

export const Brain = ({ botBrainConfig }: BrainProps) => {
  const theme = Colors[useColorScheme()];
  return (
    <Section title="BRAIN" theme={theme}>
      <StatRow
        label="Brain Type"
        value={botBrainConfig?.brainType ?? "—"}
        theme={theme}
      />
      <StatRow
        label="Model"
        value={botBrainConfig?.modelId ?? "—"}
        theme={theme}
      />
      <StatRow
        label="Provider"
        value={botBrainConfig?.provider ?? "—"}
        theme={theme}
      />
    </Section>
  );
};
