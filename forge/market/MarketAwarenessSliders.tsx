import { type FrameConfig } from "@/constants/frameConfig";
import { Colors } from "@/constants/theme";
import { type MarketAwarenessInput } from "@/generated/graphql";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React, { useState } from "react";
import { LayoutChangeEvent, StyleSheet, Text, View } from "react-native";
import { EducationalTooltip } from "../../components/EducationalTooltip";
import { PillSlider } from "../../components/PillSlider";

interface MarketAwarenessSlidersProps {
  value: MarketAwarenessInput;
  onChange: (v: MarketAwarenessInput) => void;
  bounds: FrameConfig["bounds"]["marketAwareness"];
}

const SLIDER_LABELS: Record<keyof MarketAwarenessInput, string> = {
  momentum: "Momentum Sensitivity",
  meanReversion: "Mean Reversion Bias",
  volatility: "Volatility Attraction",
  trendFollowing: "Trend-Following Bias",
};

const SLIDER_TOOLTIPS: Record<
  keyof MarketAwarenessInput,
  { title: string; body: string }
> = {
  momentum: {
    title: "Momentum Sensitivity",
    body: "Controls how strongly your bot reacts to recent price movement. At 1.0 it heavily weights stocks already trending in a direction. At 0.0 it ignores momentum entirely and treats each signal equally.",
  },
  meanReversion: {
    title: "Mean Reversion Bias",
    body: "Determines how much your bot expects prices to snap back after an extreme move. At 1.0 it looks to buy dips and fade large rallies. At 0.0 it does not factor in reversion — letting other signals dominate.",
  },
  volatility: {
    title: "Volatility Attraction",
    body: "Sets how much your bot prefers high-volatility securities. At 1.0 it actively seeks stocks with large price swings for bigger potential gains (and bigger risk). At 0.0 it is indifferent to volatility.",
  },
  trendFollowing: {
    title: "Trend-Following Bias",
    body: "Controls how strictly your bot aligns with the long-term trend. At 1.0 it only considers trades in the direction the stock has been moving for weeks. At 0.0 it considers both trend-aligned and counter-trend signals equally.",
  },
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
  const theme = Colors[useColorScheme()];
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
              <View style={styles.labelWithInfo}>
                <Text style={[styles.label, { color: theme.textPrimary }]}>
                  {SLIDER_LABELS[field]}
                </Text>
                <EducationalTooltip
                  title={SLIDER_TOOLTIPS[field].title}
                  body={SLIDER_TOOLTIPS[field].body}
                />
              </View>
              <Text style={[styles.valueText, { color: theme.electricBlue }]}>
                {clampedValue.toFixed(2)}
              </Text>
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
  labelWithInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
  },
  valueText: {
    fontSize: 14,
    fontWeight: "600",
    minWidth: 36,
    textAlign: "right",
  },
});
