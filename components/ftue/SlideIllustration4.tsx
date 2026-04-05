import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const easeOutQuad = (t: number): number => {
  "worklet";
  return 1 - (1 - t) * (1 - t);
};

const easeInQuad = (t: number): number => {
  "worklet";
  return t * t;
};

const easeOutBack12 = (t: number): number => {
  "worklet";
  const c1 = 1.2;
  const c3 = c1 + 1;
  const s = 1 - t;
  return 1 - c3 * s * s * s + c1 * s * s;
};

const easeOutBack2 = (t: number): number => {
  "worklet";
  const c1 = 2.0;
  const c3 = c1 + 1;
  const s = 1 - t;
  return 1 - c3 * s * s * s + c1 * s * s;
};

/**
 * Slide 4 — Victory / Choose Winners (Gamified Arena)
 *
 * Animation concept: A leaderboard bar chart where bars grow from bottom to top
 * with staggered timing. After rising, confetti-style dots burst upward from the
 * tallest bar and fade out in a loop. No robot, no podium character.
 * Style: dark background (#0B0F1A), gold (#F5A623), violet (#8B7CFF), electric blue (#2C6BED)
 * Implementation: react-native-reanimated, pure View/Text primitives. No Lottie.
 */

// ---- Bar chart config ----

const BARS = [
  { label: "3rd", maxH: 72, color: "#8B7CFF", delay: 0 },
  { label: "2nd", maxH: 108, color: "#2C6BED", delay: 120 },
  { label: "1st", maxH: 148, color: "#F5A623", delay: 240 },
  { label: "4th", maxH: 52, color: "#3D4566", delay: 360 },
  { label: "5th", maxH: 38, color: "#3D4566", delay: 480 },
];

const BAR_W = 32;
const BAR_GAP = 8;
const CHART_W = BARS.length * (BAR_W + BAR_GAP) - BAR_GAP;
const MAX_BAR = 148;

type ChartBarProps = {
  maxH: number;
  color: string;
  delay: number;
  label: string;
  isTop: boolean;
};

function ChartBar({ maxH, color, delay, label, isTop }: ChartBarProps) {
  const height = useSharedValue(0);

  useEffect(() => {
    height.value = withDelay(
      delay,
      withTiming(maxH, { duration: 600, easing: easeOutBack12 })
    );
  }, []);

  const barStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));

  return (
    <View style={{ alignItems: "center", width: BAR_W }}>
      {isTop && <TopLabel />}
      <Animated.View
        style={[
          {
            width: BAR_W,
            backgroundColor: color,
            borderRadius: 5,
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
          },
          barStyle,
        ]}
      />
      <Text style={[styles.barLabel, isTop && { color: "#F5A623" }]}>{label}</Text>
    </View>
  );
}

// Crown icon above the tallest bar
function TopLabel() {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(
      900,
      withTiming(1, { duration: 300, easing: easeOutBack2 })
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[{ marginBottom: 4 }, animStyle]}>
      <Text style={{ fontSize: 16 }}>👑</Text>
    </Animated.View>
  );
}

// ---- Confetti dot ----

type DotProps = { x: number; delay: number; color: string };

function ConfettiDot({ x, delay, color }: DotProps) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const travel = -(30 + Math.random() * 40);

    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(travel, { duration: 700, easing: easeOutQuad }),
          withTiming(0, { duration: 0 })
        ),
        -1,
        false
      )
    );

    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 200 }),
          withTiming(0, { duration: 500, easing: easeInQuad }),
          withTiming(0, { duration: 0 })
        ),
        -1,
        false
      )
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          left: x,
          bottom: 0,
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: color,
        },
        animStyle,
      ]}
    />
  );
}

// ---- dot config: burst from top of tallest (1st) bar ----
// 1st bar is index 2, left offset = 2 * (BAR_W + BAR_GAP) = 80
const TOP_BAR_LEFT = 2 * (BAR_W + BAR_GAP);
const DOT_COLORS = ["#F5A623", "#8B7CFF", "#2C6BED", "#FFFFFF", "#F5A623", "#8B7CFF"];
const DOTS = DOT_COLORS.map((color, i) => ({
  // spread dots across bar width with slight scatter
  x: TOP_BAR_LEFT + (i * (BAR_W / (DOT_COLORS.length - 1))) - 3,
  delay: 1000 + i * 100,
  color,
}));

export function SlideIllustration4() {
  return (
    <View style={styles.container}>
      {/* Chart area */}
      <View style={{ width: CHART_W, height: MAX_BAR + 48 }}>
        {/* Bars */}
        <View
          style={{
            position: "absolute",
            bottom: 20,
            left: 0,
            flexDirection: "row",
            alignItems: "flex-end",
            gap: BAR_GAP,
            height: MAX_BAR + 28, // room for crown
          }}
        >
          {BARS.map((b, i) => (
            <ChartBar
              key={i}
              maxH={b.maxH}
              color={b.color}
              delay={b.delay}
              label={b.label}
              isTop={b.label === "1st"}
            />
          ))}
        </View>

        {/* Confetti dots — positioned at top of tallest bar */}
        <View
          style={{
            position: "absolute",
            bottom: 20 + MAX_BAR,
            left: 0,
            width: CHART_W,
            height: 50,
            overflow: "visible",
          }}
        >
          {DOTS.map((d, i) => (
            <ConfettiDot key={i} x={d.x} delay={d.delay} color={d.color} />
          ))}
        </View>

        {/* Baseline rule */}
        <View
          style={{
            position: "absolute",
            bottom: 20,
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
  barLabel: {
    color: "#5A6275",
    fontSize: 10,
    fontWeight: "600",
    marginTop: 5,
    letterSpacing: 0.4,
  },
});
