import React from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface FtueSlideProps {
  illustration: React.ReactNode;
  headline: string;
  currentSlide: number; // 0-indexed
  totalSlides: number;
  onNext: () => void;
  onSkip: () => void;
  isLastSlide: boolean;
}

function AnimatedButton({
  onPress,
  style,
  textStyle,
  label,
}: {
  onPress: () => void;
  style: object;
  textStyle: object;
  label: string;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPressIn={() => {
        scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15, stiffness: 300 });
      }}
      onPress={onPress}
    >
      <Animated.View style={[style, animatedStyle]}>
        <Text style={textStyle}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

export function FtueSlide({
  illustration,
  headline,
  currentSlide,
  totalSlides,
  onNext,
  onSkip,
  isLastSlide,
}: FtueSlideProps) {
  return (
    <View style={styles.container}>
      {/* Illustration area — top 40% */}
      <View style={styles.illustrationArea}>{illustration}</View>

      {/* Headline */}
      <View style={styles.headlineArea}>
        <Text style={styles.headline}>{headline}</Text>
      </View>

      {/* Bottom nav: dots + skip + next */}
      <View style={styles.navArea}>
        {/* Dot pagination */}
        <View style={styles.dots}>
          {Array.from({ length: totalSlides }).map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === currentSlide && styles.dotActive]}
            />
          ))}
        </View>

        <AnimatedButton
          onPress={onSkip}
          style={styles.skipButton}
          textStyle={styles.skipText}
          label="Skip"
        />

        <AnimatedButton
          onPress={onNext}
          style={styles.nextButton}
          textStyle={styles.nextText}
          label={isLastSlide ? "Build My Bot" : "Next"}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0F1A",
  },
  illustrationArea: {
    height: SCREEN_HEIGHT * 0.4,
    alignItems: "center",
    justifyContent: "center",
  },
  headlineArea: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: "center",
  },
  headline: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 36,
  },
  navArea: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 48,
    gap: 12,
  },
  dots: {
    flexDirection: "row",
    flex: 1,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#5A6275",
  },
  dotActive: {
    backgroundColor: "#2C6BED",
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipText: {
    color: "#A0A7B8",
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: "#2C6BED",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  nextText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
