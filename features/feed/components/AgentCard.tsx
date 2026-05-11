import { FRAME_CONFIG } from "@/constants/frameConfig";
import { Colors, type ThemeColors } from "@/constants/theme";
import { BotStatus, type BotsQuery } from "@/generated/graphql";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const STATUS_LABELS: Record<BotStatus, string> = {
  [BotStatus.Active]: "Active",
  [BotStatus.Paused]: "Paused",
  [BotStatus.Draft]: "Draft",
  [BotStatus.StoodDown]: "Stood Down",
  [BotStatus.Archived]: "Archived",
};

function getStatusColor(
  status: BotStatus | null | undefined,
  theme: ThemeColors,
): string {
  switch (status) {
    case BotStatus.Active:
      return theme.success;
    case BotStatus.Paused:
      return theme.warning;
    case BotStatus.Draft:
      return theme.textSecondary;
    case BotStatus.StoodDown:
      return theme.danger;
    case BotStatus.Archived:
      return theme.textDisabled;
    default:
      return theme.textSecondary;
  }
}

interface Props {
  bot: NonNullable<BotsQuery["bots"]>[number];
  onPress: () => void;
}

export function AgentCard({ bot, onPress }: Props) {
  const theme = Colors[useColorScheme()];
  const colorway = bot.frame
    ? (FRAME_CONFIG[bot.frame]?.colorway ?? theme.electricBlue)
    : theme.electricBlue;
  const statusColor = getStatusColor(bot.status, theme);
  const statusLabel = bot.status ? STATUS_LABELS[bot.status] : "";

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.surface },
        pressed && styles.cardPressed,
      ]}
      onPress={onPress}
    >
      <View style={[styles.colorwayBar, { backgroundColor: colorway }]} />
      <View style={styles.body}>
        <Text
          style={[styles.botName, { color: theme.textPrimary }]}
          numberOfLines={1}
        >
          {bot.name ?? "Unnamed Bot"}
        </Text>
        <View style={[styles.statusPill, { borderColor: statusColor }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>
            {statusLabel}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: "hidden",
    minHeight: 44,
    width: "100%",
    flexDirection: "row",
  },
  cardPressed: {
    opacity: 0.8,
  },
  colorwayBar: {
    width: 4,
  },
  body: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 8,
  },
  botName: {
    fontSize: 16,
    fontWeight: "700",
    flex: 1,
  },
  statusPill: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
});
