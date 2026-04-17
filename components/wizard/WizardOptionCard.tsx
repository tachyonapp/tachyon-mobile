import { Colors } from "@/constants/theme";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface WizardOptionCardProps {
  label: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

export function WizardOptionCard({
  label,
  description,
  selected,
  onSelect,
  disabled = false,
}: WizardOptionCardProps) {
  return (
    <Pressable
      onPress={disabled ? undefined : onSelect}
      style={styles.pressable}
    >
      <View
        style={[
          styles.card,
          selected ? styles.cardSelected : styles.cardUnselected,
          disabled && styles.cardDisabled,
        ]}
      >
        <Text
          style={[
            styles.label,
            disabled && styles.textDisabled,
          ]}
        >
          {label}
        </Text>
        <Text
          style={[
            styles.description,
            disabled && styles.textDisabled,
          ]}
        >
          {description}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    minHeight: 44,
  },
  card: {
    borderRadius: 10,
    padding: 14,
    gap: 4,
  },
  cardSelected: {
    borderWidth: 1,
    borderColor: Colors.dark.electricBlue,
    backgroundColor: "rgba(44, 107, 237, 0.1)",
  },
  cardUnselected: {
    borderWidth: 1,
    borderColor: Colors.dark.textDisabled,
    backgroundColor: Colors.dark.surface,
  },
  cardDisabled: {
    opacity: 0.4,
  },
  label: {
    color: Colors.dark.textPrimary,
    fontSize: 15,
    fontWeight: "500",
  },
  description: {
    color: Colors.dark.textSecondary,
    fontSize: 13,
  },
  textDisabled: {
    color: Colors.dark.textDisabled,
  },
});
