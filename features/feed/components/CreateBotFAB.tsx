import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

interface Props {
  onPress: () => void;
}

export function CreateBotFAB({ onPress }: Props) {
  const theme = Colors[useColorScheme()];

  return (
    <Pressable
      style={({ pressed }) => [
        styles.fab,
        { backgroundColor: theme.electricBlue },
        pressed && styles.fabPressed,
      ]}
      onPress={onPress}
    >
      <Text style={[styles.icon, { color: theme.textPrimary }]}>+</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  fabPressed: {
    opacity: 0.8,
  },
  icon: {
    fontSize: 28,
    lineHeight: 32,
  },
});
