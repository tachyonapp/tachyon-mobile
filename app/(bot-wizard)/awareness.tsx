import { EducationalTooltip } from "@/components/wizard/EducationalTooltip";
import { MarketAwarenessSliders } from "@/components/wizard/MarketAwarenessSliders";
import { WizardProgressBar } from "@/components/wizard/WizardProgressBar";
import { WizardStepAnimation } from "@/components/wizard/WizardStepAnimation";
import { FRAME_CONFIG } from "@/constants/frameConfig";
import { Colors } from "@/constants/theme";
import { useWizard } from "@/context/WizardContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
import React from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const BRAIN_ANIMATION = require("@/assets/animations/brain.json");

const TOTAL_STEPS = 13;

export default function AwarenessScreen() {
  const theme = Colors[useColorScheme()];
  const { state, updateField, persistDraft } = useWizard();
  const router = useRouter();

  const bounds = state.frameName
    ? FRAME_CONFIG[state.frameName].bounds.marketAwareness
    : {
        momentum: { min: 0, max: 1 },
        meanReversion: { min: 0, max: 1 },
        volatility: { min: 0, max: 1 },
        trendFollowing: { min: 0, max: 1 },
      };

  async function handleNext() {
    await persistDraft();
    router.push("/(bot-wizard)/sectors");
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <WizardProgressBar currentStep={6} totalSteps={TOTAL_STEPS} />
      <ScrollView contentContainerStyle={styles.content}>
        <WizardStepAnimation source={BRAIN_ANIMATION} />
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            Configure Intelligence
          </Text>
          <EducationalTooltip
            title="Market Awareness"
            body="These weights tune how your bot weighs different market signals. They are independent — they do not need to add up to anything."
          />
        </View>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          {"Tune your bot's market perception signals."}
        </Text>
        <MarketAwarenessSliders
          value={state.marketAwareness}
          onChange={(v) => updateField("marketAwareness", v)}
          bounds={bounds}
        />
      </ScrollView>
      <View style={styles.footer}>
        <Pressable
          onPress={handleNext}
          style={[styles.nextBtn, { backgroundColor: theme.electricBlue }]}
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
  safe: { flex: 1 },
  content: { padding: 16, gap: 16 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  title: { fontSize: 22, fontWeight: "700", flex: 1 },
  subtitle: { fontSize: 14 },
  footer: { padding: 16, paddingBottom: 32 },
  nextBtn: {
    height: 52,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  nextBtnLabel: { fontSize: 16, fontWeight: "700" },
});
