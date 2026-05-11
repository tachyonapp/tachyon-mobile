import { type ThemeColors } from "@/constants/theme";
import { type BotQuery } from "@/generated/graphql";
import { relativeTime } from "@/utils/relative-time";
import { StyleSheet, Text, View } from "react-native";

type Bot = NonNullable<BotQuery["bot"]>;
type Position = NonNullable<Bot["activePosition"]>;

interface OpenPositionSummaryProps {
  position: Position;
  theme: ThemeColors;
}

export const OpenPositionSummary = ({
  position,
  theme,
}: OpenPositionSummaryProps) => {
  return (
    <View style={[styles.section, { backgroundColor: theme.surface }]}>
      <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
        OPEN POSITION
      </Text>
      <View style={styles.positionRow}>
        <Text style={[styles.symbol, { color: theme.textPrimary }]}>
          {position.symbol}
        </Text>
        <Text style={[styles.positionMeta, { color: theme.textSecondary }]}>
          {position.qty != null ? `${position.qty} shares` : ""}
          {position.avgEntryPrice != null
            ? `  ·  avg $${Number(position.avgEntryPrice).toFixed(2)}`
            : ""}
        </Text>
      </View>
      {position.openedAt && (
        <Text style={[styles.timestamp, { color: theme.textDisabled }]}>
          Opened {relativeTime(position.openedAt)}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    borderRadius: 12,
    padding: 16,
    gap: 10,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  positionRow: {
    gap: 4,
  },
  symbol: {
    fontSize: 18,
    fontWeight: "700",
  },
  timestamp: {
    fontSize: 12,
  },
  positionMeta: {
    fontSize: 13,
  },
});
