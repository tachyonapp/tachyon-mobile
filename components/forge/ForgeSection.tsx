import { EducationalTooltip } from "@/components/wizard/EducationalTooltip";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface ForgeSectionProps {
  title: string;
  subtitle?: string;
  tooltip?: { title: string; body: string };
  children: React.ReactNode;
  locked?: boolean;
  lockedMessage?: string;
}

export function ForgeSection({
  title,
  subtitle,
  tooltip,
  children,
  locked,
  lockedMessage,
}: ForgeSectionProps) {
  const theme = Colors[useColorScheme()];
  return (
    <View style={styles.section}>
      <View style={[styles.header, locked && styles.headerLocked]}>
        <View style={styles.titleRow}>
          <Text
            style={[
              styles.title,
              { color: locked ? theme.textDisabled : theme.textPrimary },
            ]}
          >
            {title}
          </Text>
          {tooltip && !locked && (
            <EducationalTooltip title={tooltip.title} body={tooltip.body} />
          )}
        </View>
        {subtitle && (
          <Text
            style={[
              styles.subtitle,
              { color: locked ? theme.textDisabled : theme.textSecondary },
            ]}
          >
            {subtitle}
          </Text>
        )}
      </View>
      {locked ? (
        <View
          style={[
            styles.lockedPlaceholder,
            {
              backgroundColor: theme.surface,
              borderColor: theme.inputBorder,
            },
          ]}
        >
          <Text style={[styles.lockedText, { color: theme.textDisabled }]}>
            {lockedMessage ?? "Complete the previous step to continue."}
          </Text>
        </View>
      ) : (
        children
      )}
      <View style={[styles.divider, { backgroundColor: theme.inputBorder }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 14,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginTop: 15,
    marginHorizontal: -16,
  },
  header: {
    gap: 4,
  },
  headerLocked: {
    opacity: 0.5,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    flex: 1,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  lockedPlaceholder: {
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 14,
    alignItems: "center",
  },
  lockedText: {
    fontSize: 13,
  },
});
