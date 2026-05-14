import { Colors } from "@/constants/theme";
import type { WizardState } from "@/context/WizardContext";
import { ForgeOptionCard } from "@/features/agents/forge/components/ForgeOptionCard";
import { TradeTempo } from "@/generated/graphql";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { StyleSheet, Text, View } from "react-native";

interface TempoProps {
  tradeTempo: TradeTempo | null;
  updateField: <K extends keyof WizardState>(
    field: K,
    value: WizardState[K],
  ) => void;
}

const TEMPO_OPTIONS: {
  value: TradeTempo;
  label: string;
  description: string;
}[] = [
  {
    value: TradeTempo.OPPORTUNISTIC,
    label: "Opportunistic",
    description: "Waits for high-conviction setups. Trades infrequently.",
  },
  {
    value: TradeTempo.ACTIVE,
    label: "Active",
    description: "Consistent scanning. Fires when conditions align.",
  },
  {
    value: TradeTempo.RELENTLESS,
    label: "Relentless",
    description:
      "Scans constantly. High trade frequency — maximum opportunity capture.",
  },
];

const TEMPO_HINTS: Record<TradeTempo, string> = {
  [TradeTempo.OPPORTUNISTIC]: "At most one proposal per hour",
  [TradeTempo.ACTIVE]: "At most one proposal every 20 minutes",
  [TradeTempo.RELENTLESS]: "Scans every 5 minutes — fires when ready",
};

export const Tempo = ({ tradeTempo, updateField }: TempoProps) => {
  const theme = Colors[useColorScheme()];

  return (
    <View style={styles.subSection}>
      {tradeTempo && (
        <Text style={[styles.hint, { color: theme.electricBlue }]}>
          {TEMPO_HINTS[tradeTempo]}
        </Text>
      )}
      <View style={styles.optionList}>
        {TEMPO_OPTIONS.map((opt) => (
          <ForgeOptionCard
            key={opt.value}
            label={opt.label}
            description={opt.description}
            selected={tradeTempo === opt.value}
            onSelect={() => updateField("tradeTempo", opt.value)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  subSection: { gap: 10, marginBottom: 20, marginTop: 20 },
  optionList: { gap: 10 },
  hint: { fontSize: 15, fontWeight: "500", textAlign: "left", marginLeft: 5 },
});
