import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const ANIMATION_DURATION = 3400;

interface WaveRingProps {
  ringCount: number;
  color: string;
}

interface RingProps {
  ringCount: number;
  index: number;
  color: string;
}

const Ring = ({ index, color, ringCount }: RingProps) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const STAGGER = ANIMATION_DURATION / ringCount; // 600ms between rings

  useEffect(() => {
    const delay = index * STAGGER;
    const easing = Easing.out(Easing.ease);

    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0, { duration: 0 }),
          withTiming(1.8, { duration: ANIMATION_DURATION, easing }),
        ),
        -1,
        false,
      ),
    );

    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.45, { duration: 0 }),
          withTiming(0, { duration: ANIMATION_DURATION, easing }),
        ),
        -1,
        false,
      ),
    );
  }, [scale, ringCount, opacity, STAGGER, index]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));
  return (
    <Animated.View
      key={index}
      style={[styles.ring, { borderColor: color }, animatedStyle]}
    />
  );
};

export const RingWave = ({ ringCount, color }: WaveRingProps) => {
  return (
    <View style={styles.waveContainer} pointerEvents="none">
      {Array.from({ length: ringCount }).map((_, i) => (
        <Ring key={i} index={i} color={color} ringCount={ringCount} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  ring: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1.5,
  },
  waveContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});
