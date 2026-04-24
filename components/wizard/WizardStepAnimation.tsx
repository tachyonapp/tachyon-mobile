import { Colors } from "@/constants/theme";
import LottieView, { type LottieViewProps } from "lottie-react-native";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

interface WizardStepAnimationProps {
  source: LottieViewProps["source"] | null;
  autoPlay?: boolean;
  loop?: boolean;
  height?: number;
  colorFilters?: LottieViewProps["colorFilters"];
}

export const WizardStepAnimation = React.forwardRef<
  LottieView,
  WizardStepAnimationProps
>(function WizardStepAnimation(
  { source, autoPlay = true, loop = true, height = 250, colorFilters },
  ref,
) {
  const shimmerOpacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (source !== null) return;

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerOpacity, {
          toValue: 0.8,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerOpacity, {
          toValue: 0.3,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [source, shimmerOpacity]);

  if (source !== null) {
    return (
      <LottieView
        ref={ref}
        source={source}
        autoPlay={autoPlay}
        loop={loop}
        style={[styles.lottie, { height }]}
        colorFilters={colorFilters}
      />
    );
  }

  return (
    <View style={[styles.shimmerContainer, { height }]}>
      <Animated.View
        style={[styles.shimmerForeground, { opacity: shimmerOpacity }]}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  lottie: {
    width: "100%",
    height: 300,
  },
  shimmerContainer: {
    width: "100%",
    height: 300,
    backgroundColor: Colors.dark.surface, // #1A2133
    overflow: "hidden",
  },
  shimmerForeground: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: Colors.dark.electricBlue, // #2C6BED
  },
});
