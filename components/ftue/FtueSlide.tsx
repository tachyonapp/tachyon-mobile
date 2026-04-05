import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
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
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Illustration area — top 40% */}
      <View style={styles.illustrationArea}>{illustration}</View>

      {/* Headline */}
      <View style={styles.headlineArea}>
        <Text style={[styles.headline, { color: theme.textPrimary }]}>{headline}</Text>
      </View>

      {/* Bottom nav: dots + skip + next */}
      <View style={styles.navArea}>
        {/* Dot pagination */}
        <View style={styles.dots}>
          {Array.from({ length: totalSlides }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                { backgroundColor: theme.textDisabled },
                i === currentSlide && { backgroundColor: theme.electricBlue },
              ]}
            />
          ))}
        </View>

        <AnimatedButton
          onPress={onSkip}
          style={styles.skipButton}
          textStyle={[styles.skipText, { color: theme.textSecondary }]}
          label="Skip"
        />

        <AnimatedButton
          onPress={onNext}
          style={[styles.nextButton, { backgroundColor: theme.electricBlue }]}
          textStyle={[styles.nextText, { color: theme.textPrimary }]}
          label={isLastSlide ? "Build My Bot" : "Next"}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 300,
  },
  illustrationArea: {
    height: SCREEN_HEIGHT * 0.3,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "red"
  },
  headlineArea: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: "center",
  },
  headline: {
    fontSize: 28,
    fontWeight: "300",
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
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipText: {
    fontSize: 16,
  },
  nextButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  nextText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
