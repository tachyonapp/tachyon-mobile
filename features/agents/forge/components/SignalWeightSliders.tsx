import { PillSlider } from "@/components/PillSlider";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { type SignalWeights } from "@tachyonapp/tachyon-queue-types/config";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

interface SignalWeightSlidersProps {
  value: SignalWeights;
  onChange: (value: SignalWeights) => void;
}

const SLIDERS: { key: keyof SignalWeights; label: string }[] = [
  { key: "technicals", label: "Technical Signals" },
  { key: "news", label: "News & Sentiment" },
  { key: "fundamentals", label: "Fundamental Factors" },
];

export function SignalWeightSliders({
  value,
  onChange,
}: SignalWeightSlidersProps) {
  const theme = Colors[useColorScheme()];
  const [trackWidth, setTrackWidth] = useState(0);

  const total = value.technicals + value.news + value.fundamentals;
  const isValid = total === 100;

  const handleChange = (key: keyof SignalWeights, raw: number) => {
    onChange({ ...value, [key]: Math.round(raw) });
  };

  return (
    <View
      style={styles.container}
      onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
    >
      {SLIDERS.map(({ key, label }) => (
        <View key={key} style={styles.sliderRow}>
          <View style={styles.labelRow}>
            <Text style={[styles.label, { color: theme.textPrimary }]}>
              {label}
            </Text>
            <Text style={[styles.sliderValue, { color: theme.textSecondary }]}>
              {value[key]}
            </Text>
          </View>
          {/* minHeight: 44 ensures the gesture area meets the 44×44pt touch target spec */}
          <View style={styles.sliderWrapper}>
            <PillSlider
              value={value[key]}
              min={0}
              max={100}
              onChange={(v) => handleChange(key, v)}
              fillColor={theme.electricBlue}
              trackWidth={trackWidth}
            />
          </View>
        </View>
      ))}

      <View style={[styles.totalRow, { borderTopColor: theme.inputBorder }]}>
        <Text style={[styles.totalLabel, { color: theme.textSecondary }]}>
          Total
        </Text>
        <Text
          style={[
            styles.totalValue,
            { color: isValid ? theme.electricBlue : theme.warning },
          ]}
        >
          {isValid ? `${total} / 100 ✓` : `${total} / 100`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  sliderRow: {
    gap: 8,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
  },
  sliderValue: {
    fontSize: 14,
    fontWeight: "600",
    minWidth: 28,
    textAlign: "right",
  },
  sliderWrapper: {
    minHeight: 44,
    justifyContent: "center",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "700",
  },
});
