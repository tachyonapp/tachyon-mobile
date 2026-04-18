import { Colors } from "@/constants/theme";
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
}

export function SectorGrid({ selected, onChange }: SectorGridProps) {
  const allSelected = ALL_SECTORS.every((s) => selected.includes(s));
  const hasError = selected.length === 0;

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
      {/* Select-all tile — spans full row */}
      <Pressable
        onPress={toggleSelectAll}
        style={[styles.tile, styles.tileFullWidth, allSelected && styles.tileSelected]}
      >
        <Text style={[styles.tileLabel, allSelected && styles.tileLabelSelected]}>
          {SELECT_ALL_LABEL}
        </Text>
      </Pressable>

      {/* 3-column grid */}
      <View style={styles.grid}>
        {ALL_SECTORS.map((sector) => {
          const isSelected = selected.includes(sector);
          return (
            <Pressable
              key={sector}
              onPress={() => toggleSector(sector)}
              style={[styles.tile, styles.tileGridItem, isSelected && styles.tileSelected]}
            >
              <Text style={[styles.tileLabel, isSelected && styles.tileLabelSelected]}>
                {sector}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {hasError && (
        <Text style={styles.errorText}>Select at least one sector</Text>
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
    borderColor: Colors.dark.textDisabled,
    backgroundColor: Colors.dark.surface,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  tileFullWidth: {
    width: "100%",
  },
  tileGridItem: {
    // 3 columns: (100% - 2 gaps of 10) / 3 ≈ 30.67%
    flexBasis: "30.67%",
    flexGrow: 1,
  },
  tileSelected: {
    borderColor: Colors.dark.electricBlue,
    backgroundColor: "rgba(44, 107, 237, 0.1)",
  },
  tileLabel: {
    color: Colors.dark.textSecondary,
    fontSize: 13,
    textAlign: "center",
  },
  tileLabelSelected: {
    color: Colors.dark.electricBlue,
    fontWeight: "600",
  },
  errorText: {
    color: Colors.dark.danger,
    fontSize: 13,
  },
});
