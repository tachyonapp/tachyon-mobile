import { type FrameConfig } from "@/constants/frameConfig";
import { Colors } from "@/constants/theme";
import { type MarketAwarenessInput } from "@/generated/graphql";
import React, { useState } from "react";
import { LayoutChangeEvent, StyleSheet, Text, View } from "react-native";
import { PillSlider } from "./PillSlider";

interface MarketAwarenessSlidersProps {
  value: MarketAwarenessInput;
  onChange: (v: MarketAwarenessInput) => void;
  bounds: FrameConfig["bounds"]["marketAwareness"];
}

const SLIDER_LABELS: Record<keyof MarketAwarenessInput, string> = {
  momentum: "📈 Momentum Sensitivity",
  meanReversion: "🔄 Mean Reversion Bias",
  volatility: "⚡ Volatility Attraction",
  trendFollowing: "🧭 Trend-Following Bias",
};

const FIELDS: (keyof MarketAwarenessInput)[] = [
  "momentum",
  "meanReversion",
  "volatility",
  "trendFollowing",
];

export function MarketAwarenessSliders({
  value,
  onChange,
  bounds,
}: MarketAwarenessSlidersProps) {
  const [trackWidth, setTrackWidth] = useState(0);

  function handleLayout(e: LayoutChangeEvent) {
    setTrackWidth(e.nativeEvent.layout.width);
  }

  function handleChange(field: keyof MarketAwarenessInput, raw: number) {
    onChange({ ...value, [field]: raw });
  }

  return (
    <View style={styles.container} onLayout={handleLayout}>
      {FIELDS.map((field) => {
        const fieldBounds = bounds[field];
        const clampedValue = Math.min(
          fieldBounds.max,
          Math.max(fieldBounds.min, value[field]),
        );

        return (
          <View key={field} style={styles.row}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>{SLIDER_LABELS[field]}</Text>
              <Text style={styles.valueText}>{clampedValue.toFixed(2)}</Text>
            </View>
            <PillSlider
              value={clampedValue}
              min={fieldBounds.min}
              max={fieldBounds.max}
              onChange={(raw) => handleChange(field, raw)}
              trackWidth={trackWidth}
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  row: {
    gap: 8,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    color: Colors.dark.textPrimary,
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  valueText: {
    color: Colors.dark.electricBlue,
    fontSize: 14,
    fontWeight: "600",
    minWidth: 36,
    textAlign: "right",
  },
});
