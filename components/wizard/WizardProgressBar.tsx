import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useWizard } from "@/context/WizardContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

interface WizardProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const SCREEN_WIDTH = Dimensions.get("window").width;

export function WizardProgressBar({
  currentStep,
  totalSteps,
}: WizardProgressBarProps) {
  const theme = Colors[useColorScheme()];
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const { clearDraft } = useWizard();

  useEffect(() => {
    const targetWidth = (currentStep / totalSteps) * SCREEN_WIDTH;
    Animated.timing(animatedWidth, {
      toValue: targetWidth,
      duration: 200,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [currentStep, totalSteps, animatedWidth]);

  function handleBack() {
    router.back();
  }

  function handleClose() {
    Alert.alert("Exit Bot Wizard?", "Your progress will not be saved.", [
      { text: "Keep Building", style: "cancel" },
      {
        text: "Exit",
        style: "destructive",
        onPress: async () => {
          await clearDraft();
          router.replace("/(tabs)");
        },
      },
    ]);
  }

  return (
    <View>
      <View style={[styles.track, { backgroundColor: theme.surface }]}>
        <Animated.View
          style={[
            styles.fill,
            { width: animatedWidth, backgroundColor: theme.electricBlue },
          ]}
        />
      </View>
      <View style={styles.headerRow}>
        <Pressable onPress={handleBack} style={styles.navBtn} hitSlop={10}>
          <IconSymbol
            name="chevron.left"
            size={22}
            color={theme.textSecondary}
          />
        </Pressable>
        <Pressable onPress={handleClose} style={styles.navBtn} hitSlop={10}>
          <IconSymbol name="xmark" size={18} color={theme.textSecondary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: "100%",
    height: 3,
  },
  fill: {
    height: 3,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 4,
  },
  navBtn: {
    padding: 4,
  },
});
