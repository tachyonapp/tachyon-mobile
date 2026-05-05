import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const DOT_DURATION = 500;
const DOT_STAGGER = 160;

export function AuthLoadingState() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "dark"];

  const dot0 = useSharedValue(0.25);
  const dot1 = useSharedValue(0.25);
  const dot2 = useSharedValue(0.25);

  useEffect(() => {
    dot0.value = withRepeat(
      withTiming(1, { duration: DOT_DURATION }),
      -1,
      true,
    );
    dot1.value = withDelay(
      DOT_STAGGER,
      withRepeat(withTiming(1, { duration: DOT_DURATION }), -1, true),
    );
    dot2.value = withDelay(
      DOT_STAGGER * 2,
      withRepeat(withTiming(1, { duration: DOT_DURATION }), -1, true),
    );
  }, []);

  const dot0Style = useAnimatedStyle(() => ({ opacity: dot0.value }));
  const dot1Style = useAnimatedStyle(() => ({ opacity: dot1.value }));
  const dot2Style = useAnimatedStyle(() => ({ opacity: dot2.value }));

  return (
    <View
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <Text style={[styles.wordmark, { color: theme.textPrimary }]}>
        TACHYON
      </Text>
      <View style={styles.dotsRow}>
        <Animated.View
          style={[styles.dot, { backgroundColor: theme.electricBlue }, dot0Style]}
        />
        <Animated.View
          style={[styles.dot, { backgroundColor: theme.electricBlue }, dot1Style]}
        />
        <Animated.View
          style={[styles.dot, { backgroundColor: theme.electricBlue }, dot2Style]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 32,
  },
  wordmark: {
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: 4,
  },
  dotsRow: {
    flexDirection: "row",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
