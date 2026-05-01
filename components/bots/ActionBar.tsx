import { Colors } from "@/constants/theme";
import { BotStatus, type BotQuery } from "@/generated/graphql";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface Props {
  bot: NonNullable<BotQuery["bot"]>;
  onActivate?: () => void;
  onPause?: () => void;
  onDelete?: () => void;
}

export function ActionBar({ bot, onActivate, onPause, onDelete }: Props) {
  const theme = Colors[useColorScheme()];
  const isActive = bot.status === BotStatus.Active;
  const isPaused =
    bot.status === BotStatus.Paused || bot.status === BotStatus.Draft;
  const isStoodDown = bot.status === BotStatus.StoodDown;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.background, borderTopColor: theme.inputBorder },
      ]}
    >
      {isActive && (
        <Pressable
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: theme.surface,
              borderWidth: 1,
              borderColor: theme.warning,
            },
            pressed && styles.pressed,
          ]}
          onPress={onPause}
        >
          <Text style={[styles.buttonText, { color: theme.warning }]}>
            Pause
          </Text>
        </Pressable>
      )}

      {isPaused && (
        <Pressable
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: theme.electricBlue },
            pressed && styles.pressed,
          ]}
          onPress={onActivate}
        >
          <Text style={[styles.buttonText, { color: theme.textPrimary }]}>
            Activate
          </Text>
        </Pressable>
      )}

      {isStoodDown && (
        <View
          style={[
            styles.button,
            {
              backgroundColor: theme.surface,
              borderWidth: 1,
              borderColor: theme.textDisabled,
            },
          ]}
        >
          <Text style={[styles.buttonText, { color: theme.textDisabled, fontSize: 13 }]}>
            Reactivates next trading day
          </Text>
        </View>
      )}

      <Pressable
        style={({ pressed }) => [styles.deleteButton, pressed && styles.pressed]}
        onPress={onDelete}
      >
        <Text style={[styles.deleteButtonText, { color: theme.danger }]}>
          Delete
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
  },
  button: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "600",
  },
  deleteButton: {
    height: 44,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.7,
  },
});
