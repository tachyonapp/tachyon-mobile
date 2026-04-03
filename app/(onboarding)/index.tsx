import { RingWave } from "@/components/animated/ring-wave";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export default function OnboardingIntroScreen() {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.container}>
      {/* Logo placeholder — replace with actual <Image> or SVG logo asset */}
      <Text style={styles.logo}>TACHYON</Text>

      {/* RingWave: animated signal wave */}
      <View style={styles.waveContainer}>
        <RingWave ringCount={4} color="#2C6BED" />
      </View>

      {/* Hero copy */}
      <Text style={styles.heroCopy}>
        Assemble your AI trading robots.{"\n"}Keep the winners, destroy the
        losers.{"\n"}You decide when they trade.
      </Text>

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
        <Animated.View style={[styles.ctaButton, animatedStyle]}>
          <Text style={styles.ctaText}>Begin</Text>
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0F1A",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 32,
  },
  logo: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: 4,
  },
  waveContainer: {
    height: 120,
    width: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  heroCopy: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 32,
  },
  ctaButton: {
    backgroundColor: "#2C6BED",
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
