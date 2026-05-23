import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ReactionPickerProps {
  type: "win" | "loss";
  value: string | null;
  onChange: (phrase: string | null) => void;
  options: string[];
}

// TODO: legal review required before App Store submission (e.g. "Numbers don't lie")
export const WIN_REACTIONS = [
  "Win!",
  "Profit secured.",
  "Numbers look good.",
  "Clean entry, clean exit.",
  "Patience pays.",
  "On to the next one.",
  "That's what the setup looked like.",
  "Locked in.",
];

export const LOSS_REACTIONS = [
  "Part of the game.",
  "Cut it and move on.",
  "Market had other plans.",
  "Lesson noted.",
  "No emotion, just data.",
  "The edge is in consistency.",
  "Sizing protects us.",
  "Next setup.",
];

const WIN_ACTIVE = { bg: "#1A3327", text: "#22C55E" };
const LOSS_ACTIVE = { bg: "#3B1A1A", text: "#D64545" };

export function ReactionPicker({
  type,
  value,
  onChange,
  options,
}: ReactionPickerProps) {
  const theme = Colors[useColorScheme()];
  const activeColors = type === "win" ? WIN_ACTIVE : LOSS_ACTIVE;

  const handlePress = (phrase: string) => {
    onChange(value === phrase ? null : phrase);
  };

  // Render in 2-column grid
  const rows: string[][] = [];
  for (let i = 0; i < options.length; i += 2) {
    rows.push(options.slice(i, i + 2));
  }

  return (
    <View style={styles.grid}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((phrase) => {
            const selected = value === phrase;
            return (
              <TouchableOpacity
                key={phrase}
                onPress={() => handlePress(phrase)}
                style={[
                  styles.chip,
                  selected
                    ? { backgroundColor: activeColors.bg }
                    : { backgroundColor: theme.surface },
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.chipText,
                    selected
                      ? { color: activeColors.text }
                      : { color: theme.textSecondary },
                  ]}
                  numberOfLines={2}
                >
                  {phrase}
                </Text>
              </TouchableOpacity>
            );
          })}
          {/* Pad row if odd number of options */}
          {row.length < 2 && <View style={styles.chip} />}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: 8,
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  chip: {
    flex: 1,
    minHeight: 52,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  chipText: {
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 18,
  },
});
