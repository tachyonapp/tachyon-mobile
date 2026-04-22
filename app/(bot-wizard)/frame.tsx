import { FrameCard } from "@/components/wizard/FrameCard";
import { WizardProgressBar } from "@/components/wizard/WizardProgressBar";
import { WizardStepAnimation } from "@/components/wizard/WizardStepAnimation";
import { FRAME_CONFIG } from "@/constants/frameConfig";
import { Colors } from "@/constants/theme";
import { useWizard } from "@/context/WizardContext";
import { BotFrame } from "@/generated/graphql";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { swapLottieColors } from "@/utils/lottie-color-swap";
import { useRouter } from "expo-router";
import { type LottieViewProps } from "lottie-react-native";
import React, { useMemo } from "react";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const BASE_HEADER_ANIMATION = require("@/assets/animations/ftue-bot-builder.json");

// Original accent colors baked into the animation
const ANIM_PRIMARY = "#2C6BEC";
const ANIM_SECONDARY = "#8A7BFF";

const FRAME_ANIMATIONS: Partial<Record<BotFrame, LottieViewProps["source"]>> = {
  [BotFrame.Scout]: require("@/assets/animations/scout.json"),
  [BotFrame.Sniper]: require("@/assets/animations/sniper.json"),
  [BotFrame.Guardian]: require("@/assets/animations/shield.json"),
};

const FRAMES = Object.values(BotFrame);
const TOTAL_STEPS = 13;

export default function FrameScreen() {
  const theme = Colors[useColorScheme()];
  const { state, selectFrame } = useWizard();
  const router = useRouter();

  const headerAnimation = useMemo(() => {
    if (!state.frameName) return BASE_HEADER_ANIMATION;
    const colorway = FRAME_CONFIG[state.frameName].colorway;
    return swapLottieColors(BASE_HEADER_ANIMATION, [
      { from: ANIM_PRIMARY, to: colorway },
      { from: ANIM_SECONDARY, to: colorway },
    ]);
  }, [state.frameName]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <WizardProgressBar currentStep={1} totalSteps={TOTAL_STEPS} />

      <FlatList
        data={FRAMES}
        keyExtractor={(item) => item}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.headerAnimation}>
              <WizardStepAnimation source={headerAnimation} />
            </View>
            <Text style={[styles.title, { color: theme.textPrimary }]}>
              {"Select Your Bot's Personality"}
            </Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              {
                "Each frame defines your bot's trading personality and strategy."
              }
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <FrameCard
              frame={FRAME_CONFIG[item]}
              selected={state.frameName === item}
              onSelect={() => selectFrame(item)}
              animationSource={FRAME_ANIMATIONS[item]}
            />
          </View>
        )}
      />

      <View style={styles.footer}>
        <Pressable
          onPress={() => router.push("/(bot-wizard)/risk")}
          disabled={state.frameName === null}
          style={[
            styles.nextBtn,
            { backgroundColor: theme.electricBlue },
            state.frameName === null && styles.nextBtnDisabled,
          ]}
        >
          <Text style={[styles.nextBtnLabel, { color: theme.textPrimary }]}>
            Next
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    gap: 12,
    marginBottom: 12,
  },
  headerAnimation: {
    marginBottom: 30,
    marginTop: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  columnWrapper: {
    gap: 12,
  },
  cardWrapper: {
    flex: 1,
  },
  footer: {
    padding: 16,
    paddingBottom: 32,
  },
  nextBtn: {
    height: 52,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  nextBtnDisabled: {
    opacity: 0.35,
  },
  nextBtnLabel: {
    fontSize: 16,
    fontWeight: "700",
  },
});
