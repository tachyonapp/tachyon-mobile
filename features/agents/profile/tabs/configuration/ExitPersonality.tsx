import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { formatStyleName } from "@/utils/format-style-name";
import React from "react";
import { Section } from "../../components/Section";
import { StatRow } from "../../components/StatRow";

interface ExitPersonalityProps {
  exitStyle: string | null | undefined;
}

export const ExitPersonality = ({ exitStyle }: ExitPersonalityProps) => {
  const theme = Colors[useColorScheme()];

  return (
    <Section title="EXIT PERSONALITY" theme={theme}>
      <StatRow
        label="Exit Style"
        value={formatStyleName(exitStyle)}
        theme={theme}
      />
    </Section>
  );
};
