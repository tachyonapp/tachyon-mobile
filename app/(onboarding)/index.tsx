import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const STAGGER = 250;
const DURATION = 1420;
const SLIDE_DISTANCE = 14;

const HERO_LINES = [
  "Customize your own AI trading bots.",
  "Decide when and how they trade.",
];

export default function OnboardingIntroScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];
  const scale = useSharedValue(1);

  // --- hero line animation values (explicit — no hooks in loops) ---
  const opacity0 = useSharedValue(0);
  const opacity1 = useSharedValue(0);
  const translateY0 = useSharedValue(SLIDE_DISTANCE);
  const translateY1 = useSharedValue(SLIDE_DISTANCE);

  useEffect(() => {
    opacity0.value = withTiming(1, { duration: DURATION });
    translateY0.value = withTiming(0, { duration: DURATION });
    opacity1.value = withDelay(STAGGER, withTiming(1, { duration: DURATION }));
    translateY1.value = withDelay(
      STAGGER,
      withTiming(0, { duration: DURATION }),
    );
  }, []);

  const lineStyle0 = useAnimatedStyle(() => ({
    opacity: opacity0.value,
    transform: [{ translateY: translateY0.value }],
  }));
  const lineStyle1 = useAnimatedStyle(() => ({
    opacity: opacity1.value,
    transform: [{ translateY: translateY1.value }],
  }));

  const lineAnimatedStyles = [lineStyle0, lineStyle1];

  // --- CTA press animation ---
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Logo placeholder — replace with actual <Image> or SVG logo asset */}
      <Text style={[styles.logo, { color: theme.textPrimary }]}>TACHYON</Text>

      <LottieView
        source={require("@/assets/animations/ftue-bot-builder.json")}
        autoPlay
        loop
        style={styles.animation}
      />

      {/* Hero copy — each line fades in and slides up with stagger */}
      <View style={styles.heroCopyContainer}>
        {HERO_LINES.map((line, i) => (
          <Animated.Text
            key={i}
            style={[styles.heroCopy, { color: theme.textPrimary }, lineAnimatedStyles[i]]}
          >
            {line}
          </Animated.Text>
        ))}
      </View>

      {/* CTA */}
      <Pressable
        onPressIn={() => {
          scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 15, stiffness: 300 });
        }}
        onPress={() => router.push("/(onboarding)/slides")}
      >
        <Animated.View style={[styles.ctaButton, { backgroundColor: theme.electricBlue }, animatedStyle]}>
          <Text style={styles.ctaText}>Begin</Text>
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 32,
  },
  logo: {
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: 4,
  },
  animation: {
    width: 300,
    height: 300,
  },
  heroCopyContainer: {
    alignItems: "center",
    gap: 6,
  },
  heroCopy: {
    fontSize: 22,
    fontWeight: "200",
    lineHeight: 32,
  },
  ctaButton: {
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 8,
    marginTop: 8,
  },
  ctaText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
