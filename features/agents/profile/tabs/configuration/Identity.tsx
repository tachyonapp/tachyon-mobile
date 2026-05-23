import { FRAME_CONFIG } from "@tachyonapp/tachyon-queue-types/config";
import { Colors } from "@/constants/theme";
import { BotFrame } from "@/generated/graphql";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Section } from "../../components/Section";
import { StatRow } from "../../components/StatRow";

interface IdentityProps {
  frame: BotFrame | null | undefined;
  name: string | undefined | null;
}

export const Identity = ({ frame, name }: IdentityProps) => {
  const theme = Colors[useColorScheme()];

  const frameConfig = frame ? FRAME_CONFIG[frame] : null;
  const colorway = frameConfig?.colorway ?? theme.electricBlue;

  return (
    <Section title="FRAME & IDENTITY" theme={theme}>
      <View style={styles.identityRow}>
        <View style={[styles.colorwaySwatch, { backgroundColor: colorway }]} />
        <View style={styles.identityText}>
          <Text style={[styles.frameName, { color: theme.textPrimary }]}>
            {frameConfig?.gamifiedName ?? frame ?? "—"}
          </Text>
          {frameConfig?.strategyName != null && (
            <Text style={[styles.strategyName, { color: theme.textSecondary }]}>
              {frameConfig.strategyName}
            </Text>
          )}
        </View>
      </View>
      <StatRow label="Agent Name" value={name ?? "—"} theme={theme} />
    </Section>
  );
};

const styles = StyleSheet.create({
  identityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 4,
  },
  colorwaySwatch: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  identityText: {
    flex: 1,
    gap: 2,
  },
  frameName: {
    fontSize: 15,
    fontWeight: "700",
  },
  strategyName: {
    fontSize: 12,
  },
});
