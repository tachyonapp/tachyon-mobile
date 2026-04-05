import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const easeInOutSine = (t: number): number => {
  "worklet";
  return -(Math.cos(Math.PI * t) - 1) / 2;
};

const easeInOutQuad = (t: number): number => {
  "worklet";
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
};

/**
 * Slide 2 — Market Scanning
 *
 * Animation concept: A row of candlestick/bar chart columns pulse up and down
 * with staggered timing to simulate live market data. A horizontal scan line
 * sweeps left-to-right in a seamless loop over the bars. No robot, no Lottie.
 * Style: dark background (#0B0F1A), violet (#8B7CFF), electric blue (#2C6BED)
 * Implementation: react-native-reanimated, pure View primitives.
 */

const BAR_COUNT = 9;
const BAR_WIDTH = 18;
const BAR_GAP = 8;
const MAX_BAR_H = 120;
const MIN_BAR_H = 24;
const CHART_W = BAR_COUNT * (BAR_WIDTH + BAR_GAP) - BAR_GAP; // 206
const CHART_H = MAX_BAR_H + 20;

// Base heights that define the waveform shape
const BASE_HEIGHTS = [40, 72, 55, 100, 65, 88, 44, 112, 60];
// Pulse target heights (shifted variant)
const PULSE_HEIGHTS = [60, 55, 80, 72, 100, 55, 70, 88, 90];

// Bar color alternates between blue and violet
const BAR_COLORS = ["#2C6BED", "#8B7CFF"];

type BarProps = { index: number; baseH: number; targetH: number };

function Bar({ index, baseH, targetH }: BarProps) {
  const height = useSharedValue(MIN_BAR_H);

  useEffect(() => {
    const delay = index * 120;
    height.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(baseH, { duration: 600, easing: easeInOutSine }),
          withTiming(targetH, { duration: 700, easing: easeInOutSine }),
          withTiming(baseH, { duration: 600, easing: easeInOutSine })
        ),
        -1,
        false
      )
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));

  const color = BAR_COLORS[index % 2];

  return (
    <View
      style={{
        width: BAR_WIDTH,
        height: MAX_BAR_H,
        justifyContent: "flex-end",
        marginRight: index < BAR_COUNT - 1 ? BAR_GAP : 0,
      }}
    >
      <Animated.View
        style={[
          {
            width: BAR_WIDTH,
            backgroundColor: color,
            borderRadius: 4,
            opacity: 0.9,
          },
          animStyle,
        ]}
      />
    </View>
  );
}

function ScanLine() {
  const translateX = useSharedValue(-10);

  useEffect(() => {
    translateX.value = withRepeat(
      withSequence(
        withTiming(CHART_W + 10, {
          duration: 1800,
          easing: easeInOutQuad,
        }),
        withTiming(-10, { duration: 0 })
      ),
      -1,
      false
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          top: 0,
          left: 0,
          width: 2,
          height: MAX_BAR_H,
          backgroundColor: "#FFFFFF",
          opacity: 0.55,
          borderRadius: 1,
          shadowColor: "#FFFFFF",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.8,
          shadowRadius: 6,
        },
        animStyle,
      ]}
    />
  );
}

export function SlideIllustration2() {
  return (
    <View style={styles.container}>
      <View style={{ width: CHART_W, height: CHART_H }}>
        {/* Bars row — pinned to bottom of chart area */}
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            flexDirection: "row",
            alignItems: "flex-end",
            height: MAX_BAR_H,
            width: CHART_W,
          }}
        >
          {BASE_HEIGHTS.map((h, i) => (
            <Bar key={i} index={i} baseH={h} targetH={PULSE_HEIGHTS[i]} />
          ))}
        </View>

        {/* Scan line — sits over bars */}
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: CHART_W,
            height: MAX_BAR_H,
            overflow: "hidden",
          }}
        >
          <ScanLine />
        </View>

        {/* Baseline rule */}
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: CHART_W,
            height: 1,
            backgroundColor: "#3D4566",
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 260,
    height: 260,
    alignItems: "center",
    justifyContent: "center",
  },
});
