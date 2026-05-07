import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React, { useCallback, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Reanimated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const TRACK_HEIGHT = 28;
const THUMB_SIZE = 22;
const THUMB_INSET = (TRACK_HEIGHT - THUMB_SIZE) / 2;

interface PillSliderProps {
  value: number; // 0.0 – 1.0 normalized position
  min: number; // raw min (e.g. 0.05)
  max: number; // raw max (e.g. 0.50)
  onChange: (raw: number) => void;
  fillColor?: string;
  trackWidth: number; // must be measured by parent via onLayout
}

export function PillSlider({
  value,
  min,
  max,
  onChange,
  fillColor,
  trackWidth,
}: PillSliderProps) {
  const theme = Colors[useColorScheme()];
  const resolvedFillColor = fillColor ?? theme.electricBlue;
  const usableWidth = Math.max(0, trackWidth - THUMB_SIZE);

  const clampNumber = (v: number, lo: number, hi: number) =>
    Math.min(hi, Math.max(lo, v));
  const safeRange = Math.max(max - min, Number.EPSILON);
  const clampedValue = clampNumber(value, min, max);
  // normalized 0–1
  const normalized = (clampedValue - min) / safeRange;
  const thumbX = useSharedValue(normalized * usableWidth);

  const clamp = (v: number, lo: number, hi: number) => {
    "worklet";
    return Math.min(hi, Math.max(lo, v));
  };

  const emitValue = useCallback(
    (x: number) => {
      const norm = clamp(x / usableWidth, 0, 1);
      const raw = min + norm * safeRange;
      // snap to nearest 0.01
      const snapped = Math.round(raw * 100) / 100;
      onChange(clampNumber(snapped, min, max));
    },
    [usableWidth, min, max, onChange, safeRange],
  );

  const startX = useSharedValue(0);

  useEffect(() => {
    // Keep the visual thumb in sync with the controlled `value` prop.
    // This prevents stale thumb position after remounts and layout changes.
    const clampedNorm = Math.min(1, Math.max(0, normalized));
    thumbX.value = clampedNorm * usableWidth;
  }, [normalized, thumbX, usableWidth]);

  const pan = Gesture.Pan()
    .onBegin(() => {
      startX.value = thumbX.value;
    })
    .onUpdate((e) => {
      thumbX.value = clamp(startX.value + e.translationX, 0, usableWidth);
    })
    .onEnd(() => {
      runOnJS(emitValue)(thumbX.value);
    })
    .onFinalize(() => {
      runOnJS(emitValue)(thumbX.value);
    });

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: thumbX.value }],
  }));

  const fillStyle = useAnimatedStyle(() => ({
    width: thumbX.value + THUMB_SIZE + 5,
  }));

  if (trackWidth === 0) return null;

  return (
    <GestureDetector gesture={pan}>
      <View
        style={[
          styles.track,
          { width: trackWidth, backgroundColor: theme.surface },
        ]}
      >
        <Reanimated.View
          style={[
            styles.fill,
            { backgroundColor: resolvedFillColor },
            fillStyle,
          ]}
        />
        <Reanimated.View
          style={[
            styles.thumb,
            { backgroundColor: theme.textPrimary },
            thumbStyle,
          ]}
        />
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  track: {
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    overflow: "hidden",
    justifyContent: "center",
  },
  fill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: TRACK_HEIGHT / 2,
  },
  thumb: {
    position: "absolute",
    left: THUMB_INSET,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
});
