import { type ThemeColors } from "@/constants/theme";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface SecondaryButtonProps {
  label: string;
  onPress: () => void;
  theme: ThemeColors;
}

export const SecondaryButton = ({
  label,
  onPress,
  theme,
}: SecondaryButtonProps) => {
  return (
    <TouchableOpacity
      style={[styles.buttonSecondary, { borderColor: theme.electricBlue }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.buttonTextSecondary, { color: theme.electricBlue }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonSecondary: {
    borderRadius: 10,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    borderWidth: 1,
  },
  buttonTextSecondary: {
    fontSize: 14,
    fontWeight: "600",
  },
});
