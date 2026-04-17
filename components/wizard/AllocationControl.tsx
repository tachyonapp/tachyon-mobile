import { Colors } from "@/constants/theme";
import React, { useState } from "react";
import { LayoutChangeEvent, StyleSheet, Text, View } from "react-native";
import { PillSlider } from "./PillSlider";

interface AllocationControlProps {
  value: number;           // current allocationPct (0.01–1.00)
  onChange: (v: number) => void;
  min: number;             // from FRAME_CONFIG[frame].bounds.allocationPct.min
  max: number;             // Math.min(FRAME_CONFIG[frame].bounds.allocationPct.max, 1.0 - existingTotal)
  existingTotal: number;   // sum of other bots' allocationPct
  userCashBalance: number; // may be 0
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
  const [trackWidth, setTrackWidth] = useState(0);

  const existingPct = Math.round(existingTotal * 100);
  const currentPct = Math.round(value * 100);
  const availablePct = Math.max(0, 100 - existingPct - currentPct);

  function handleLayout(e: LayoutChangeEvent) {
    setTrackWidth(e.nativeEvent.layout.width);
  }

  const usdEquivalent = userCashBalance > 0
    ? formatUsd(value * userCashBalance)
    : null;

  return (
    <View style={styles.container}>
      {/* Label row */}
      <View style={styles.labelRow}>
        <Text style={styles.label}>
          {currentPct}%{usdEquivalent ? ` — ${usdEquivalent}` : ""}
        </Text>
      </View>

      {/* Energy bar */}
      <View style={styles.energyBar}>
        {existingTotal > 0 && (
          <View style={[styles.segment, { flex: existingPct, backgroundColor: Colors.dark.warning }]} />
        )}
        <View style={[styles.segment, { flex: currentPct, backgroundColor: Colors.dark.electricBlue }]} />
        {availablePct > 0 && (
          <View style={[styles.segment, { flex: availablePct, backgroundColor: Colors.dark.surface }]} />
        )}
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        {existingTotal > 0 && (
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.dark.warning }]} />
            <Text style={styles.legendText}>Other bots {existingPct}%</Text>
          </View>
        )}
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.dark.electricBlue }]} />
          <Text style={styles.legendText}>This bot {currentPct}%</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.dark.inputBorder }]} />
          <Text style={styles.legendText}>Available {availablePct}%</Text>
        </View>
      </View>

      {/* Pill slider */}
      <View onLayout={handleLayout} style={styles.sliderContainer}>
        <PillSlider
          value={value}
          min={min}
          max={max}
          onChange={onChange}
          trackWidth={trackWidth}
        />
      </View>

      {/* Zero-balance funding prompt */}
      {userCashBalance === 0 && (
        <Text style={styles.fundingPrompt}>
          Fund your account to activate this bot.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    color: Colors.dark.textPrimary,
    fontSize: 16,
    fontWeight: "600",
  },
  energyBar: {
    flexDirection: "row",
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  segment: {
    height: "100%",
  },
  legend: {
    flexDirection: "row",
    gap: 16,
    flexWrap: "wrap",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    color: Colors.dark.textSecondary,
    fontSize: 12,
  },
  sliderContainer: {
    width: "100%",
  },
  fundingPrompt: {
    color: Colors.dark.warning,
    fontSize: 13,
  },
});
