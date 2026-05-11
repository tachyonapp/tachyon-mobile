import { Colors, type ThemeColors } from "@/constants/theme";
import { BotStatus, type BotQuery } from "@/generated/graphql";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Avatar } from "./Avatar";

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
  agent: NonNullable<BotQuery["bot"]>;
}

export function Hero({ agent }: Props) {
  const theme = Colors[useColorScheme()];
  const statusColor = getStatusColor(agent.status, theme);
  const statusLabel = agent.status ? STATUS_LABELS[agent.status] : "";
  const initials = (agent.name ?? "?").slice(0, 2).toUpperCase();

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <View style={[styles.avatarInner]}>
        {agent.avatarSeed ? (
          <Avatar seed={agent.avatarSeed} backgroundColor={theme.background} />
        ) : (
          <Text style={[styles.avatarInitials, { color: theme.textPrimary }]}>
            {initials}
          </Text>
        )}
      </View>

      <View style={styles.info}>
        <Text
          style={[styles.botName, { color: theme.textPrimary }]}
          numberOfLines={1}
        >
          {agent.name ?? "Unnamed Bot"}
        </Text>
        <View style={[styles.statusPill, { borderColor: statusColor }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>
            {statusLabel}
          </Text>
        </View>
      </View>

      {agent.status === BotStatus.StoodDown && (
        <View
          style={[
            styles.stoodDownCallout,
            {
              borderLeftColor: theme.danger,
              backgroundColor: theme.danger + "20",
            },
          ]}
        >
          <Text style={[styles.stoodDownText, { color: theme.danger }]}>
            Stood Down — Reactivates next trading day
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 20,
    alignItems: "center",
    gap: 12,
  },
  avatarInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    fontSize: 24,
    fontWeight: "700",
  },
  info: {
    alignItems: "center",
    gap: 8,
  },
  botName: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  statusPill: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  stoodDownCallout: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderLeftWidth: 3,
    alignSelf: "stretch",
  },
  stoodDownText: {
    fontSize: 13,
    fontWeight: "500",
  },
});
