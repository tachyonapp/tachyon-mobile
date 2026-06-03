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
          <Text style={[styles.label, { color: theme.textSecondary }]}>
            Sectors
          </Text>
          <View style={styles.right}>
            <Text style={[styles.count, { color: theme.textPrimary }]}>
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
        <View style={styles.list}>
          {formatted.map((label) => (
            <View key={label} style={styles.listItem}>
              <View
                style={[styles.dot, { backgroundColor: theme.electricBlue }]}
              />
              <Text
                style={[styles.listItemText, { color: theme.textPrimary }]}
                numberOfLines={1}
              >
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
  label: {
    fontSize: 13,
    flexShrink: 0,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flexShrink: 1,
  },
  count: {
    fontSize: 13,
    fontWeight: "600",
  },
  list: {
    paddingTop: 4,
    paddingBottom: 6,
    paddingLeft: 4,
    gap: 8,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    flexShrink: 0,
  },
  listItemText: {
    fontSize: 13,
    fontWeight: "500",
    flexShrink: 1,
  },
});
