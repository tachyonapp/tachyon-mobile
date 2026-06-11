import { IconSymbol } from "@/components/shared/icon-symbol";
import { PillSlider } from "@/components/ui/PillSlider";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React, { useState } from "react";
import { LayoutChangeEvent, StyleSheet, Text, View } from "react-native";

interface AllocationControlProps {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  existingTotal: number;
  userCashBalance: number;
}

function formatUsd(amount: number): string {
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function AllocationControl({
  value,
  onChange,
  min,
  max,
  existingTotal,
  userCashBalance,
}: AllocationControlProps) {
  const theme = Colors[useColorScheme()];
  const [trackWidth, setTrackWidth] = useState(0);

  const existingPct = Math.round(existingTotal * 100);
  const currentPct = Math.round(value * 100);
  const availablePct = Math.max(0, 100 - existingPct - currentPct);

  function handleLayout(e: LayoutChangeEvent) {
    setTrackWidth(e.nativeEvent.layout.width);
  }

  const usdEquivalent =
    userCashBalance > 0 ? formatUsd(value * userCashBalance) : null;

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={[styles.label, { color: theme.textPrimary }]}>
          {currentPct}%{usdEquivalent ? ` — ${usdEquivalent}` : ""}
        </Text>
      </View>

      <View style={styles.energyBar}>
        {existingTotal > 0 && (
          <View
            style={[
              styles.segment,
              { flex: existingPct, backgroundColor: theme.warning },
            ]}
          />
        )}
        <View
          style={[
            styles.segment,
            { flex: currentPct, backgroundColor: theme.electricBlue },
          ]}
        />
        {availablePct > 0 && (
          <View
            style={[
              styles.segment,
              { flex: availablePct, backgroundColor: theme.surface },
            ]}
          />
        )}
      </View>

      <View style={styles.legend}>
        {existingTotal > 0 && (
          <View style={styles.legendItem}>
            <View
              style={[styles.legendDot, { backgroundColor: theme.warning }]}
            />
            <Text style={[styles.legendText, { color: theme.textSecondary }]}>
              Other agents {existingPct}%
            </Text>
          </View>
        )}
        <View style={styles.legendItem}>
          <View
            style={[styles.legendDot, { backgroundColor: theme.electricBlue }]}
          />
          <Text style={[styles.legendText, { color: theme.textSecondary }]}>
            This agent {currentPct}%
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendDot, { backgroundColor: theme.inputBorder }]}
          />
          <Text style={[styles.legendText, { color: theme.textSecondary }]}>
            Available {availablePct}%
          </Text>
        </View>
      </View>

      <View onLayout={handleLayout} style={styles.sliderContainer}>
        <PillSlider
          value={value}
          min={min}
          max={max}
          onChange={onChange}
          trackWidth={trackWidth}
        />
        <View style={styles.rangeLabelsRow}>
          <Text style={[styles.rangeLabel, { color: theme.textSecondary }]}>
            Min {Math.round(min * 100)}%
          </Text>
          <Text style={[styles.rangeLabel, { color: theme.textSecondary }]}>
            Max {Math.round(max * 100)}%
          </Text>
        </View>
      </View>

      {userCashBalance === 0 && (
        <View style={styles.fundingPromptContainer}>
          <IconSymbol size={22} name="warning" color={theme.warning} />
          <Text style={[styles.fundingPrompt, { color: theme.warning }]}>
            Fund your account to activate this agent!
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12, marginTop: 15 },
  labelRow: { flexDirection: "row", alignItems: "center" },
  label: { fontSize: 16, fontWeight: "600" },
  energyBar: {
    flexDirection: "row",
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  segment: { height: "100%" },
  legend: { flexDirection: "row", gap: 16, flexWrap: "wrap" },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 12 },
  sliderContainer: { width: "100%" },
  rangeLabelsRow: {
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rangeLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  fundingPromptContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 15,
  },
  fundingPrompt: { fontSize: 15 },
});
