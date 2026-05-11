import { type ThemeColors } from "@/constants/theme";
import { StyleSheet, Text, View } from "react-native";

interface StatRowProps {
  label: string;
  value: string;
  theme: ThemeColors;
}

export const StatRow = ({ label, value, theme }: StatRowProps) => {
  return (
    <View style={styles.statRow}>
      <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
        {label}
      </Text>
      <Text style={[styles.statValue, { color: theme.textPrimary }]}>
        {value}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(160,167,184,0.15)",
  },
  statLabel: {
    fontSize: 13,
  },
  statValue: {
    fontSize: 13,
    fontWeight: "600",
  },
});
