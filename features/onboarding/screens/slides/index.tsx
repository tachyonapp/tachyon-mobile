import { Colors } from "@/constants/theme";
import { SlideIllustration1 } from "@/features/onboarding/components/SlideIllustration1";
import { SlideIllustration2 } from "@/features/onboarding/components/SlideIllustration2";
import { SlideIllustration3 } from "@/features/onboarding/components/SlideIllustration3";
import { SlideIllustration4 } from "@/features/onboarding/components/SlideIllustration4";
import { SlideIllustration5 } from "@/features/onboarding/components/SlideIllustration5";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useOnboardingState } from "@/hooks/use-onboarding-state";
import { router } from "expo-router";
import { useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { FtueSlide } from "./FtueSlide";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SLIDE_COUNT = 5;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

// Cubic ease-out as a worklet — replaces Easing.out(Easing.ease) which isn't
// safely serializable as a worklet in Reanimated 4.
const slideEasing = (t: number): number => {
  "worklet";
  return 1 - (1 - t) * (1 - t) * (1 - t);
};

const TIMING_CONFIG = {
  duration: 250,
  easing: slideEasing,
};

const SLIDES = [
  {
    headline: "Build AI trading agents",
    Illustration: SlideIllustration1,
  },
  {
    headline: "Customize how they interact with markets",
    Illustration: SlideIllustration2,
  },
  {
    // COMPLIANCE CRITICAL: This copy must not be altered without compliance review.
    headline: "You approve every trade",
    Illustration: SlideIllustration3,
  },
  {
    headline: "Discover agents built by others",
    Illustration: SlideIllustration5,
  },
  {
    headline: "Keep the winners",
    Illustration: SlideIllustration4,
  },
];

export default function OnboardingSlides() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];
  const { markComplete } = useOnboardingState();
  const [currentSlide, setCurrentSlide] = useState(0);

  const translateX = useSharedValue(0);
  const startX = useSharedValue(0);
  // UI thread mirror of currentSlide — safe to read inside gesture handlers
  const currentSlideIndex = useSharedValue(0);

  const goToSlide = (index: number) => {
    translateX.value = withTiming(-index * SCREEN_WIDTH, TIMING_CONFIG);
    currentSlideIndex.value = index;
    setCurrentSlide(index);
  };

  const handleComplete = async () => {
    await markComplete();
    router.replace("/(tabs)");
  };

  const handleNext = () => {
    if (currentSlide < SLIDE_COUNT - 1) {
      goToSlide(currentSlide + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      startX.value = translateX.value;
    })
    .onUpdate((e) => {
      const next = startX.value + e.translationX;
      const minX = -(SLIDE_COUNT - 1) * SCREEN_WIDTH;
      // Apply resistance at boundaries
      if (next > 0 || next < minX) {
        translateX.value = startX.value + e.translationX * 0.2;
      } else {
        translateX.value = next;
      }
    })
    .onEnd((e) => {
      const delta = translateX.value - startX.value;

      if (delta < -SWIPE_THRESHOLD || e.velocityX < -500) {
        // Swipe left → next slide
        const next = Math.min(currentSlideIndex.value + 1, SLIDE_COUNT - 1);
        translateX.value = withTiming(-next * SCREEN_WIDTH, TIMING_CONFIG);
        currentSlideIndex.value = next;
        scheduleOnRN(setCurrentSlide, next);
      } else if (delta > SWIPE_THRESHOLD || e.velocityX > 500) {
        // Swipe right → previous slide
        const prev = Math.max(currentSlideIndex.value - 1, 0);
        translateX.value = withTiming(-prev * SCREEN_WIDTH, TIMING_CONFIG);
        currentSlideIndex.value = prev;
        scheduleOnRN(setCurrentSlide, prev);
      } else {
        // Snap back to current slide
        translateX.value = withTiming(
          -currentSlideIndex.value * SCREEN_WIDTH,
          TIMING_CONFIG,
        );
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.slidesTrack, animatedStyle]}>
          {SLIDES.map((slide, index) => (
            <View key={index} style={styles.slideWrapper}>
              <FtueSlide
                illustration={<slide.Illustration />}
                headline={slide.headline}
                currentSlide={currentSlide}
                totalSlides={SLIDE_COUNT}
                onNext={handleNext}
                onSkip={handleSkip}
                isLastSlide={currentSlide === SLIDE_COUNT - 1}
              />
            </View>
          ))}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
  slidesTrack: {
    flexDirection: "row",
    width: SCREEN_WIDTH * SLIDE_COUNT,
    flex: 1,
  },
  slideWrapper: {
    width: SCREEN_WIDTH,
    flex: 1,
  },
});
