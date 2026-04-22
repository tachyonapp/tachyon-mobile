import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const ALL_SECTORS = [
  "Tech",
  "Energy",
  "Financials",
  "Healthcare",
  "ETFs Only",
  "Mega Caps Only",
  "Liquid Large Caps",
];

const SELECT_ALL_LABEL = "Any liquid battlefield";

interface SectorGridProps {
  selected: string[];
  onChange: (sectors: string[]) => void;
  showError?: boolean;
}

export function SectorGrid({
  selected,
  onChange,
  showError = false,
}: SectorGridProps) {
  const theme = Colors[useColorScheme()];
  const allSelected = ALL_SECTORS.every((s) => selected.includes(s));
  const hasError = showError && selected.length === 0;

  function toggleSelectAll() {
    onChange(allSelected ? [] : [...ALL_SECTORS]);
  }

  function toggleSector(sector: string) {
    if (selected.includes(sector)) {
      onChange(selected.filter((s) => s !== sector));
    } else {
      onChange([...selected, sector]);
    }
  }

  return (
    <View style={styles.container}>
      <Pressable
        onPress={toggleSelectAll}
        style={[
          styles.tile,
          styles.tileFullWidth,
          { borderColor: theme.textDisabled, backgroundColor: theme.surface },
          allSelected && {
            borderColor: theme.electricBlue,
            backgroundColor: "rgba(44, 107, 237, 0.1)",
          },
        ]}
      >
        <Text
          style={[
            styles.tileLabel,
            { color: theme.textSecondary },
            allSelected && { color: theme.electricBlue, fontWeight: "600" },
          ]}
        >
          {SELECT_ALL_LABEL}
        </Text>
      </Pressable>

      <View style={styles.grid}>
        {ALL_SECTORS.map((sector) => {
          const isSelected = selected.includes(sector);
          return (
            <Pressable
              key={sector}
              onPress={() => toggleSector(sector)}
              style={[
                styles.tile,
                styles.tileGridItem,
                {
                  borderColor: theme.textDisabled,
                  backgroundColor: theme.surface,
                },
                isSelected && {
                  borderColor: theme.electricBlue,
                  backgroundColor: "rgba(44, 107, 237, 0.1)",
                },
              ]}
            >
              <Text
                style={[
                  styles.tileLabel,
                  { color: theme.textSecondary },
                  isSelected && {
                    color: theme.electricBlue,
                    fontWeight: "600",
                  },
                ]}
              >
                {sector}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {hasError && (
        <Text style={[styles.errorText, { color: theme.danger }]}>
          Select at least one sector
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  tile: {
    minHeight: 44,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  tileFullWidth: {
    width: "100%",
  },
  tileGridItem: {
    flexBasis: "30.67%",
    flexGrow: 1,
  },
  tileLabel: {
    fontSize: 13,
    textAlign: "center",
  },
  errorText: {
    fontSize: 13,
  },
});
