import { TradeTempo } from "@/generated/graphql";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

// Opportunistic: sparse, tall single peak — infrequent high-conviction signal
// Active: regular rhythm — steady moderate pulse
// Relentless: dense, rapid — constant activity
export const WAVEFORM_PATTERNS: Record<TradeTempo, number[]> = {
  [TradeTempo.Opportunistic]: [0.2, 0.5, 1.0, 0.5, 0.2],
  [TradeTempo.Active]: [0.4, 0.7, 0.5, 1.0, 0.6, 0.9, 0.5, 0.7, 0.4],
  [TradeTempo.Relentless]: [
    0.5, 0.8, 0.4, 1.0, 0.5, 0.7, 0.3, 0.9, 0.6, 1.0, 0.4, 0.7, 0.5,
  ],
};

// Total loop duration in ms per tempo
export const WAVEFORM_DURATIONS: Record<TradeTempo, number> = {
  [TradeTempo.Opportunistic]: 2400,
  [TradeTempo.Active]: 1800,
  [TradeTempo.Relentless]: 1100,
};

const TEMPO_COLORS: Record<TradeTempo, string> = {
  [TradeTempo.Opportunistic]: "#1ACDAD",
  [TradeTempo.Active]: "#F2B705",
  [TradeTempo.Relentless]: "#FF6535",
};

// Ring is 208px tall, centered in a 200px animationWrapper.
// Ring top Y = (200 - 208) / 2 = -4 from animationWrapper top.
const RING_TOP_Y = -4;
const INDICATOR_MAX_HEIGHT = 22;

interface TempoWaveformProps {
  tradeTempo: TradeTempo;
  barWidth?: number;
  gap?: number;
  maxHeight?: number;
}

export function TempoWaveform({
  tradeTempo,
  barWidth = 2,
  gap = 1.5,
  maxHeight = 16,
}: TempoWaveformProps) {
  const bars = WAVEFORM_PATTERNS[tradeTempo];
  const color = TEMPO_COLORS[tradeTempo];

  return (
    <View style={[styles.row, { height: maxHeight, gap }]}>
      {bars.map((amp, i) => (
        <View
          key={i}
          style={{
            width: barWidth,
            height: Math.max(2, amp * maxHeight),
            borderRadius: barWidth / 2,
            backgroundColor: color,
          }}
        />
      ))}
    </View>
  );
}

interface TempoWaveformIndicatorProps {
  tradeTempo: TradeTempo;
}

export function TempoWaveformIndicator({
  tradeTempo,
}: TempoWaveformIndicatorProps) {
  const top = RING_TOP_Y - INDICATOR_MAX_HEIGHT / 2;

  return (
    <View pointerEvents="none" style={[styles.wrapper, { top }]}>
      <TempoWaveform
        tradeTempo={tradeTempo}
        barWidth={2.5}
        gap={2}
        maxHeight={INDICATOR_MAX_HEIGHT}
      />
    </View>
  );
}

// Fallback pattern when no tempo is selected — slow neutral pulse
const DEFAULT_PATTERN = [0.3, 0.5, 0.7, 0.5, 0.3, 0.5, 0.7, 0.5, 0.3];
const DEFAULT_DURATION = 3000;
const DEFAULT_COLOR = "#4A5568";

interface AnimatedTempoWaveformProps {
  tradeTempo: TradeTempo | null;
  barWidth?: number;
  gap?: number;
  maxHeight?: number;
}

export function AnimatedTempoWaveform({
  tradeTempo,
  barWidth = 10,
  gap = 10,
  maxHeight = 175,
}: AnimatedTempoWaveformProps) {
  const bars = tradeTempo ? WAVEFORM_PATTERNS[tradeTempo] : DEFAULT_PATTERN;
  const duration = tradeTempo
    ? WAVEFORM_DURATIONS[tradeTempo]
    : DEFAULT_DURATION;
  const color = tradeTempo ? TEMPO_COLORS[tradeTempo] : DEFAULT_COLOR;

  const animValues = useRef<Animated.Value[]>([]);

  // Ensure we have enough Animated.Values for the current bar count
  if (animValues.current.length !== bars.length) {
    animValues.current = bars.map(() => new Animated.Value(0));
  }

  useEffect(() => {
    const stagger = duration / bars.length;
    const animations = animValues.current.map((anim, i) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(i * stagger),
          Animated.loop(
            Animated.sequence([
              Animated.timing(anim, {
                toValue: 1,
                duration: duration / 2,
                useNativeDriver: false,
              }),
              Animated.timing(anim, {
                toValue: 0,
                duration: duration / 2,
                useNativeDriver: false,
              }),
            ]),
          ),
        ]),
      );
    });

    const composite = Animated.parallel(animations);
    composite.start();
    return () => composite.stop();
  }, [tradeTempo, duration, bars, maxHeight]);

  return (
    <View style={[styles.animRow, { height: maxHeight, gap }]}>
      {bars.map((amp, i) => {
        const targetHeight = amp * maxHeight;
        const minHeight = Math.max(4, targetHeight * 0.25);
        const animatedHeight = animValues.current[i]?.interpolate({
          inputRange: [0, 1],
          outputRange: [minHeight, targetHeight],
        });

        return (
          <Animated.View
            key={i}
            style={{
              width: barWidth,
              height: animatedHeight,
              borderRadius: barWidth / 2,
              backgroundColor: color,
            }}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  wrapper: {
    position: "absolute",
    alignSelf: "center",
  },
  animRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
