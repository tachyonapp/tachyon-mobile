import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React, { useState } from "react";
import { LayoutChangeEvent, StyleSheet, Text, View } from "react-native";
import { PillSlider } from "./PillSlider";

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
              Other bots {existingPct}%
            </Text>
          </View>
        )}
        <View style={styles.legendItem}>
          <View
            style={[styles.legendDot, { backgroundColor: theme.electricBlue }]}
          />
          <Text style={[styles.legendText, { color: theme.textSecondary }]}>
            This bot {currentPct}%
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
      </View>

      {userCashBalance === 0 && (
        <Text style={[styles.fundingPrompt, { color: theme.warning }]}>
          Fund your account to activate this bot.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
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
  fundingPrompt: { fontSize: 13, marginTop: 30 },
});
