import { type FrameConfig } from "@/constants/frameConfig";
import { Colors } from "@/constants/theme";
import React, { useRef } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface FrameCardProps {
  frame: FrameConfig;
  selected: boolean;
  onSelect: () => void;
}

export function FrameCard({ frame, selected, onSelect }: FrameCardProps) {
  const scale = useRef(new Animated.Value(1)).current;

  function handlePress() {
    Animated.sequence([
      Animated.spring(scale, {
        toValue: 1.02,
        useNativeDriver: true,
        speed: 50,
        bounciness: 4,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 50,
        bounciness: 4,
      }),
    ]).start();
    onSelect();
  }

  return (
    <Pressable onPress={handlePress} style={styles.pressable}>
      <Animated.View
        style={[
          styles.card,
          selected ? styles.cardSelected : styles.cardUnselected,
          selected && {
            shadowColor: frame.colorway,
            shadowOpacity: 0.5,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 0 },
            elevation: 8,
          },
          { transform: [{ scale }] },
        ]}
      >
        <View style={[styles.colorwayBar, { backgroundColor: frame.colorway }]} />
        <View style={styles.content}>
          <Text style={styles.gamifiedName}>{frame.gamifiedName}</Text>
          <Text style={styles.strategyName}>{frame.strategyName}</Text>
          <Text style={styles.description}>{frame.description}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
    minHeight: 44,
  },
  card: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 10,
    overflow: "hidden",
    flex: 1,
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: Colors.dark.electricBlue,
  },
  cardUnselected: {
    borderWidth: 1,
    borderColor: Colors.dark.textDisabled,
  },
  colorwayBar: {
    height: 4,
    width: "100%",
  },
  content: {
    padding: 12,
    gap: 4,
  },
  gamifiedName: {
    color: Colors.dark.textPrimary,
    fontSize: 15,
    fontWeight: "600",
  },
  strategyName: {
    color: Colors.dark.electricBlue,
    fontSize: 12,
    fontWeight: "500",
  },
  description: {
    color: Colors.dark.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
});
