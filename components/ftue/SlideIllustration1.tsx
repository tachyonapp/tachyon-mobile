import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

// Easing.back + Easing.out are not reliably serializable as worklets in Reanimated 4.
// Define the composed curve as a plain worklet function instead.
const easeOutBack16 = (t: number): number => {
  "worklet";
  const c1 = 1.6;
  const c3 = c1 + 1;
  const s = 1 - t;
  return 1 - c3 * s * s * s + c1 * s * s;
};

/**
 * Slide 1 — Bot Builder / Assembly
 *
 * Animation concept: Geometric "bot frame" — abstract modular UI card tiles
 * snap into a symmetrical 3×3 dashboard grid, one tile at a time, staggered.
 * After the build sequence each tile gently pulses its opacity in idle loop.
 * Style: dark background (#0B0F1A), violet accent (#8B7CFF), electric blue (#2C6BED)
 * Implementation: react-native-reanimated, pure View primitives. No robot, no Lottie.
 */

// --- individual tile ---

type TileProps = {
  color: string;
  delay: number;
  size: number;
  borderRadius?: number;
};

function Tile({ color, delay, size, borderRadius = 6 }: TileProps) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration: 340, easing: easeOutBack16 })
    );
    scale.value = withDelay(
      delay,
      withTiming(1, { duration: 340, easing: easeOutBack16 })
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          width: size,
          height: size,
          borderRadius,
          backgroundColor: color,
        },
        animStyle,
      ]}
    />
  );
}

// --- grid layout data ---

const TILE_GAP = 8;
const SMALL = 52;
const WIDE_W = 52 * 2 + TILE_GAP;
const TALL_H = 52 * 2 + TILE_GAP;

// Each entry: { col, row, width, height, color, delay }
// Grid is 3 cols × 3 rows, 0-indexed, some tiles span 2 units.
const tiles: {
  col: number;
  row: number;
  w: number;
  h: number;
  color: string;
  delay: number;
  radius?: number;
}[] = [
  // top-left wide bar
  { col: 0, row: 0, w: WIDE_W, h: SMALL, color: "#2C6BED", delay: 0, radius: 8 },
  // top-right small square
  { col: 2, row: 0, w: SMALL, h: SMALL, color: "#8B7CFF", delay: 80, radius: 8 },

  // middle-left small square
  { col: 0, row: 1, w: SMALL, h: SMALL, color: "#8B7CFF", delay: 160, radius: 8 },
  // center tall block
  { col: 1, row: 1, w: SMALL, h: TALL_H, color: "#2C6BED", delay: 240, radius: 8 },
  // middle-right small square
  { col: 2, row: 1, w: SMALL, h: SMALL, color: "#3D4566", delay: 320, radius: 8 },

  // bottom-left small square
  { col: 0, row: 2, w: SMALL, h: SMALL, color: "#3D4566", delay: 400, radius: 8 },
  // bottom-right wide bar
  { col: 2, row: 2, w: SMALL, h: SMALL, color: "#8B7CFF", delay: 480, radius: 8 },
];

const UNIT = SMALL + TILE_GAP;
const GRID_W = UNIT * 3 - TILE_GAP; // 52+8+52+8+52 = 172
const GRID_H = UNIT * 3 - TILE_GAP;

export function SlideIllustration1() {
  return (
    <View style={styles.container}>
      <View style={{ width: GRID_W, height: GRID_H }}>
        {tiles.map((t, i) => (
          <View
            key={i}
            style={{
              position: "absolute",
              left: t.col * UNIT,
              top: t.row * UNIT,
              width: t.w,
              height: t.h,
            }}
          >
            <Tile
              color={t.color}
              delay={t.delay}
              size={Math.max(t.w, t.h)}
              borderRadius={t.radius}
            />
          </View>
        ))}
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
