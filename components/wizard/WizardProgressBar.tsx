import { IconSymbol } from "@/components/ui/icon-symbol";
import { FRAME_CONFIG } from "@/constants/frameConfig";
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
  Text,
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
  const { state, clearDraft } = useWizard();
  const frameConfig = state.frameName ? FRAME_CONFIG[state.frameName] : null;

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
        {frameConfig && (
          <View
            style={[styles.frameBadge, { borderColor: frameConfig.colorway }]}
          >
            <View
              style={[
                styles.frameDot,
                { backgroundColor: frameConfig.colorway },
              ]}
            />
            <Text style={[styles.frameLabel, { color: frameConfig.colorway }]}>
              {frameConfig.gamifiedName}
            </Text>
          </View>
        )}
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
  frameBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  frameDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  frameLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
});
