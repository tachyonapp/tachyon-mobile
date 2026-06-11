import { Colors } from "@/constants/theme";
import { BotStatus } from "@/generated/graphql";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Avatar } from "@/features/agents/profile/components/Avatar";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const STOOD_DOWN_RED = "#D64545";
const RECOVERY_AMBER = "#F2B705";
const PAUSED_GRAY = "#5A6275";

interface AgentTileProps {
  id: string;
  name: string;
  avatarSeed: string | null | undefined;
  frameColorway: string;
  status: BotStatus | null | undefined;
  recoveryModeApplied: string | null | undefined;
  recoveryModeActiveUntil: string | null | undefined;
  onPress: () => void;
}

function daysUntil(dateValue: string | null | undefined): number {
  if (!dateValue) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const until = new Date(dateValue);
  until.setHours(0, 0, 0, 0);
  return Math.max(0, Math.ceil((until.getTime() - today.getTime()) / 86_400_000));
}

interface Badge {
  bg: string;
  text: string;
  textColor: string;
}

function resolveBadge(
  status: BotStatus | null | undefined,
  recoveryModeApplied: string | null | undefined,
  recoveryModeActiveUntil: string | null | undefined,
): Badge | null {
  const isStoodDown = status === BotStatus.StoodDown;

  if (isStoodDown && recoveryModeApplied === "MORE_CONSERVATIVE_2D") {
    const days = daysUntil(recoveryModeActiveUntil);
    return { bg: RECOVERY_AMBER, text: `Rec. Mode · ${days}d`, textColor: "#0B0F1A" };
  }
  if (isStoodDown) {
    return { bg: STOOD_DOWN_RED, text: "Stood Down", textColor: "#FFFFFF" };
  }
  if (status === BotStatus.Paused) {
    return { bg: PAUSED_GRAY, text: "Paused", textColor: "#FFFFFF" };
  }
  return null;
}

export function AgentTile({
  name,
  avatarSeed,
  frameColorway,
  status,
  recoveryModeApplied,
  recoveryModeActiveUntil,
  onPress,
}: AgentTileProps) {
  const theme = Colors[useColorScheme()];
  const initials = (name ?? "?").slice(0, 2).toUpperCase();
  const badge = resolveBadge(status, recoveryModeApplied, recoveryModeActiveUntil);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.tile,
        { backgroundColor: theme.surface, borderColor: frameColorway },
        pressed && styles.tilePressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.content}>
        {avatarSeed ? (
          <Avatar seed={avatarSeed} backgroundColor={theme.background} />
        ) : (
          <View style={[styles.initialsWrap, { backgroundColor: theme.background }]}>
            <Text style={[styles.initials, { color: theme.textPrimary }]}>{initials}</Text>
          </View>
        )}
        <Text style={[styles.name, { color: theme.textPrimary }]} numberOfLines={2}>
          {name ?? "Unnamed"}
        </Text>
      </View>

      {badge && (
        <View style={[styles.badge, { backgroundColor: badge.bg }]}>
          <Text style={[styles.badgeText, { color: badge.textColor }]}>{badge.text}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 2,
    overflow: "hidden",
  },
  tilePressed: {
    opacity: 0.75,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    gap: 8,
  },
  initialsWrap: {
    width: 60,
    height: 60,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    fontSize: 20,
    fontWeight: "700",
  },
  name: {
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },
  badge: {
    position: "absolute",
    bottom: 8,
    left: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
});
