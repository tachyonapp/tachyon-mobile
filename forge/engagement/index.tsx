import { Colors } from "@/constants/theme";
import type { WizardState } from "@/context/WizardContext";
import { ForgeSection } from "@/forge/components/ForgeSection";
import { RulesOfEngagementInput } from "@/generated/graphql";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { StyleSheet, Switch, Text, View } from "react-native";

interface EngagementProps {
  stopLossSet: boolean;
  rulesOfEngagement: RulesOfEngagementInput;
  updateField: <K extends keyof WizardState>(
    field: K,
    value: WizardState[K],
  ) => void;
}

export const Engagement = ({
  stopLossSet,
  rulesOfEngagement,
  updateField,
}: EngagementProps) => {
  const theme = Colors[useColorScheme()];

  return (
    <ForgeSection
      title="Rules of Engagement"
      subtitle="Set the operating rules your bot must follow."
      locked={!stopLossSet}
      lockedMessage="Configure your stop-loss style first."
    >
      <View style={[styles.toggleGroup, { borderColor: theme.inputBorder }]}>
        <View
          style={[styles.toggleRow, { borderBottomColor: theme.inputBorder }]}
        >
          <Text style={[styles.toggleLabel, { color: theme.textPrimary }]}>
            Allow overnight holding
          </Text>
          <Switch
            value={rulesOfEngagement.overnightHoldAllowed}
            onValueChange={(on) =>
              updateField("rulesOfEngagement", {
                ...rulesOfEngagement,
                overnightHoldAllowed: on,
              })
            }
            trackColor={{ true: theme.electricBlue, false: theme.surface }}
            thumbColor={theme.textPrimary}
          />
        </View>
        <View
          style={[styles.toggleRow, { borderBottomColor: theme.inputBorder }]}
        >
          <Text style={[styles.toggleLabel, { color: theme.textPrimary }]}>
            Avoid same-day exits unless stop-loss triggered
          </Text>
          <Switch
            value={rulesOfEngagement.noSameDayExitUnlessStopLoss}
            onValueChange={(on) =>
              updateField("rulesOfEngagement", {
                ...rulesOfEngagement,
                noSameDayExitUnlessStopLoss: on,
              })
            }
            trackColor={{ true: theme.electricBlue, false: theme.surface }}
            thumbColor={theme.textPrimary}
          />
        </View>
        <View
          style={[
            styles.toggleRow,
            styles.toggleRowLocked,
            { borderBottomColor: "transparent" },
          ]}
        >
          <View style={styles.lockedLabelGroup}>
            <Text style={[styles.toggleLabel, { color: theme.textPrimary }]}>
              One trade at a time
            </Text>
            <Text style={styles.lockIcon}>🔒</Text>
            <Text style={[styles.lockedHint, { color: theme.textSecondary }]}>
              Required in MVP. Your bot will only hold one position at a time.
            </Text>
          </View>
          <Switch
            value={true}
            disabled={true}
            trackColor={{ true: theme.electricBlue, false: theme.surface }}
            thumbColor={theme.textPrimary}
          />
        </View>
      </View>
    </ForgeSection>
  );
};

const styles = StyleSheet.create({
  toggleGroup: { gap: 0 },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 52,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  toggleRowLocked: { opacity: 0.7 },
  toggleLabel: { fontSize: 14, flex: 1, marginRight: 12 },
  lockedLabelGroup: { flex: 1, marginRight: 12, gap: 4 },
  lockIcon: { fontSize: 12 },
  lockedHint: { fontSize: 12, lineHeight: 16 },
});
