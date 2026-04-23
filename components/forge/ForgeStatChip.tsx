import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text } from "react-native";

interface ForgeStatChipProps {
  label: string;
  value: string | null;
  colorway?: string | null;
}

export function ForgeStatChip({ label, value, colorway }: ForgeStatChipProps) {
  const theme = Colors[useColorScheme()];
  const isSet = value !== null && value !== "";
  const opacity = useRef(new Animated.Value(isSet ? 1 : 0.25)).current;
  const scale = useRef(new Animated.Value(isSet ? 1 : 0.93)).current;

  useEffect(() => {
    if (isSet) {
      Animated.parallel([
        Animated.spring(opacity, {
          toValue: 1,
          useNativeDriver: true,
          speed: 20,
          bounciness: 6,
        }),
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          speed: 20,
          bounciness: 6,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0.25,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.93,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isSet, opacity, scale]);

  const borderColor = isSet && colorway ? colorway : theme.inputBorder;
  const valueColor = isSet
    ? (colorway ?? theme.textPrimary)
    : theme.textDisabled;

  return (
    <Animated.View
      style={[
        styles.chip,
        { backgroundColor: theme.surface, borderColor },
        { opacity, transform: [{ scale }] },
      ]}
    >
      <Text style={[styles.label, { color: theme.textDisabled }]}>{label}</Text>
      <Text style={[styles.value, { color: valueColor }]} numberOfLines={1}>
        {value ?? "—"}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 7,
    gap: 2,
    height: 66,
    justifyContent: "center",
  },
  label: {
    fontSize: 9,
    fontWeight: "600",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  value: {
    fontSize: 12,
    fontWeight: "700",
  },
});
