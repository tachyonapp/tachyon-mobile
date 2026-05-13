import { Colors } from "@/constants/theme";
import { SectorFilter } from "@/generated/graphql";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { type SectorDefinition } from "@tachyonapp/tachyon-queue-types/config";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

// Maps SectorFilter enum values to parentSector strings from the API taxonomy
const SECTOR_FILTER_TO_PARENT: Partial<Record<SectorFilter, string>> = {
  [SectorFilter.Tech]: "Technology",
  [SectorFilter.Energy]: "Energy",
  [SectorFilter.Financials]: "Financials",
  [SectorFilter.Healthcare]: "Healthcare",
};

interface SubSectorExpansionPanelProps {
  selectedSectors: SectorFilter[];
  parentSectorsData: SectorDefinition[];
  subSectors: string[];
  onChange: (subSectors: string[]) => void;
}

interface PanelProps {
  parentSector: string;
  subSectorOptions: string[];
  selectedSubSectors: string[];
  onToggle: (subSector: string) => void;
}

function SectorPanel({
  parentSector,
  subSectorOptions,
  selectedSubSectors,
  onToggle,
}: PanelProps) {
  const theme = Colors[useColorScheme()];
  const [expanded, setExpanded] = useState(false);

  const selectedCount = subSectorOptions.filter((s) =>
    selectedSubSectors.includes(s),
  ).length;

  return (
    <View
      style={[
        styles.panel,
        { backgroundColor: theme.surface, borderColor: theme.inputBorder },
      ]}
    >
      <Pressable
        onPress={() => setExpanded((v) => !v)}
        style={styles.panelHeader}
      >
        <View style={styles.panelHeaderText}>
          <Text style={[styles.panelTitle, { color: theme.textPrimary }]}>
            {parentSector}
          </Text>
          {selectedCount > 0 && (
            <Text style={[styles.panelCount, { color: theme.electricBlue }]}>
              {selectedCount} sub-sector{selectedCount > 1 ? "s" : ""} selected
            </Text>
          )}
          {selectedCount === 0 && (
            <Text style={[styles.panelHint, { color: theme.textDisabled }]}>
              All {parentSector} stocks
            </Text>
          )}
        </View>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={18}
          color={theme.textSecondary}
        />
      </Pressable>

      {expanded && (
        <View style={styles.subSectorGrid}>
          {subSectorOptions.map((sub) => {
            const selected = selectedSubSectors.includes(sub);
            return (
              <Pressable
                key={sub}
                onPress={() => onToggle(sub)}
                style={[
                  styles.subSectorChip,
                  { borderColor: theme.inputBorder, backgroundColor: theme.inputBackground },
                  selected && {
                    borderColor: theme.electricBlue,
                    backgroundColor: "rgba(44,107,237,0.1)",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.subSectorLabel,
                    { color: theme.textSecondary },
                    selected && { color: theme.electricBlue, fontWeight: "600" },
                  ]}
                >
                  {sub}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

export function SubSectorExpansionPanel({
  selectedSectors,
  parentSectorsData,
  subSectors,
  onChange,
}: SubSectorExpansionPanelProps) {
  if (parentSectorsData.length === 0) return null;

  // Only show panels for selected sectors that have a known taxonomy mapping
  const panels = selectedSectors
    .map((filter) => {
      const parentName = SECTOR_FILTER_TO_PARENT[filter];
      if (!parentName) return null;
      const definition = parentSectorsData.find(
        (d) => d.parentSector === parentName,
      );
      if (!definition) return null;
      return { parentSector: parentName, subSectorOptions: definition.subSectors };
    })
    .filter((p): p is { parentSector: string; subSectorOptions: string[] } => p !== null);

  if (panels.length === 0) return null;

  const handleToggle = (subSector: string) => {
    if (subSectors.includes(subSector)) {
      onChange(subSectors.filter((s) => s !== subSector));
    } else {
      onChange([...subSectors, subSector]);
    }
  };

  return (
    <View style={styles.container}>
      {panels.map(({ parentSector, subSectorOptions }) => (
        <SectorPanel
          key={parentSector}
          parentSector={parentSector}
          subSectorOptions={subSectorOptions}
          selectedSubSectors={subSectors}
          onToggle={handleToggle}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  panel: {
    borderRadius: 10,
    borderWidth: 1,
    overflow: "hidden",
  },
  panelHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 44,
  },
  panelHeaderText: {
    flex: 1,
    gap: 2,
  },
  panelTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  panelCount: {
    fontSize: 12,
  },
  panelHint: {
    fontSize: 12,
  },
  subSectorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  subSectorChip: {
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 10,
    minHeight: 32,
    justifyContent: "center",
  },
  subSectorLabel: {
    fontSize: 12,
  },
});
