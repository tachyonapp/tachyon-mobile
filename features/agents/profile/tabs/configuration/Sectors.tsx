import { IconSymbol } from "@/components/shared/icon-symbol";
import { type ThemeColors } from "@/constants/theme";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { StatRow } from "../../components/StatRow";

interface SectorsProps {
  sectors: readonly string[] | null | undefined;
  theme: ThemeColors;
}

export const Sector = ({ sectors, theme }: SectorsProps) => {
  const [open, setOpen] = useState(false);

  if (!sectors || sectors.length === 0) {
    return <StatRow label="Sectors" value="—" theme={theme} />;
  }

  const formatted = sectors.map((s) =>
    s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
  );

  return (
    <View>
      <Pressable onPress={() => setOpen((v) => !v)} hitSlop={8}>
        <View style={styles.row}>
          <Text style={[styles.rowLabel, { color: theme.textSecondary }]}>
            Sectors
          </Text>
          <View style={styles.sectorsRight}>
            <Text style={[styles.rowValue, { color: theme.textPrimary }]}>
              {sectors.length} selected
            </Text>
            <IconSymbol
              name={open ? "chevron.up" : "chevron.down"}
              size={14}
              color={theme.textSecondary}
            />
          </View>
        </View>
      </Pressable>
      {open && (
        <View style={styles.sectorPills}>
          {formatted.map((label) => (
            <View
              key={label}
              style={[
                styles.pill,
                {
                  backgroundColor: theme.inputBackground,
                  borderColor: theme.inputBorder,
                },
              ]}
            >
              <Text style={[styles.pillText, { color: theme.textPrimary }]}>
                {label}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(160,167,184,0.15)",
  },
  rowLabel: {
    fontSize: 13,
  },
  rowValue: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: "right",
    flex: 1,
    marginLeft: 16,
  },
  sectorsRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  sectorPills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    paddingTop: 8,
    paddingBottom: 4,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  pillText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
