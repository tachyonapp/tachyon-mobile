import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

interface Props {
  onPress: () => void;
}

export function CreateBotFAB({ onPress }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
      onPress={onPress}
    >
      <Text style={styles.icon}>+</Text>
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
    backgroundColor: "#2C6BED",
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
    color: "#FFFFFF",
    fontSize: 28,
    lineHeight: 32,
  },
});
