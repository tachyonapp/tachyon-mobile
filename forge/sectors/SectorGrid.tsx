import { Colors } from "@/constants/theme";
import { SectorFilter } from "@/generated/graphql";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const SECTOR_OPTIONS: { value: SectorFilter; label: string }[] = [
  { value: SectorFilter.Tech, label: "Tech" },
  { value: SectorFilter.Energy, label: "Energy" },
  { value: SectorFilter.Financials, label: "Financials" },
  { value: SectorFilter.Healthcare, label: "Healthcare" },
  { value: SectorFilter.EtfsOnly, label: "ETFs Only" },
  { value: SectorFilter.MegaCapsOnly, label: "Mega Caps Only" },
  { value: SectorFilter.LiquidLargeCaps, label: "Liquid Large Caps" },
];

const ALL_SECTOR_VALUES = SECTOR_OPTIONS.map((s) => s.value);
const SELECT_ALL_LABEL = "Any liquid battlefield";

interface SectorGridProps {
  selected: SectorFilter[];
  onChange: (sectors: SectorFilter[]) => void;
  showError?: boolean;
}

export function SectorGrid({
  selected,
  onChange,
  showError = false,
}: SectorGridProps) {
  const theme = Colors[useColorScheme()];
  const allSelected = ALL_SECTOR_VALUES.every((v) => selected.includes(v));
  const hasError = showError && selected.length === 0;

  function toggleSelectAll() {
    onChange(allSelected ? [] : [...ALL_SECTOR_VALUES]);
  }

  function toggleSector(value: SectorFilter) {
    if (selected.includes(value)) {
      onChange(selected.filter((s) => s !== value));
    } else {
      onChange([...selected, value]);
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
        {SECTOR_OPTIONS.map(({ value, label }) => {
          const isSelected = selected.includes(value);
          return (
            <Pressable
              key={value}
              onPress={() => toggleSector(value)}
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
                    fontWeight: "300",
                  },
                ]}
              >
                {label}
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
