import { Colors } from "@/constants/theme";
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, Easing, StyleSheet, View } from "react-native";

interface WizardProgressBarProps {
  currentStep: number; // 1-indexed
  totalSteps: number; // 13 (12 config steps + summary)
}

const SCREEN_WIDTH = Dimensions.get("window").width;

export function WizardProgressBar({
  currentStep,
  totalSteps,
}: WizardProgressBarProps) {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const targetWidth = (currentStep / totalSteps) * SCREEN_WIDTH;
    Animated.timing(animatedWidth, {
      toValue: targetWidth,
      duration: 200,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [currentStep, totalSteps, animatedWidth]);

  return (
    <View style={styles.track}>
      <Animated.View style={[styles.fill, { width: animatedWidth }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: "100%",
    height: 3,
    backgroundColor: Colors.dark.surface, // #1A2133
  },
  fill: {
    height: 3,
    backgroundColor: Colors.dark.electricBlue, // #2C6BED
  },
});
