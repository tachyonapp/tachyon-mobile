import { FRAME_CONFIG } from "@/constants/frameConfig";
import { BotStatus, type BotsQuery } from "@/generated/graphql";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const STATUS_COLORS: Record<BotStatus, string> = {
  [BotStatus.Active]: "#1C9C61",
  [BotStatus.Paused]: "#F2B705",
  [BotStatus.Draft]: "#A0A7B8",
  [BotStatus.StoodDown]: "#D64545",
  [BotStatus.Archived]: "#5A6275",
};

const STATUS_LABELS: Record<BotStatus, string> = {
  [BotStatus.Active]: "Active",
  [BotStatus.Paused]: "Paused",
  [BotStatus.Draft]: "Draft",
  [BotStatus.StoodDown]: "Stood Down",
  [BotStatus.Archived]: "Archived",
};

interface Props {
  bot: NonNullable<BotsQuery["bots"]>[number];
  onPress: () => void;
}

export function BotCard({ bot, onPress }: Props) {
  const colorway = bot.frame
    ? (FRAME_CONFIG[bot.frame]?.colorway ?? "#2C6BED")
    : "#2C6BED";
  const statusColor = bot.status ? STATUS_COLORS[bot.status] : "#A0A7B8";
  const statusLabel = bot.status ? STATUS_LABELS[bot.status] : "";

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
    >
      <View style={[styles.colorwayBar, { backgroundColor: colorway }]} />
      <View style={styles.body}>
        <Text style={styles.botName} numberOfLines={1}>
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
    backgroundColor: "#1A2133",
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
    color: "#FFFFFF",
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
