import { AllocationControl } from "@/components/wizard/AllocationControl";
import { WizardProgressBar } from "@/components/wizard/WizardProgressBar";
import { FRAME_CONFIG } from "@/constants/frameConfig";
import { Colors } from "@/constants/theme";
import { useWizard } from "@/context/WizardContext";
import { BalanceDocument, type BalanceQuery } from "@/generated/graphql";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useQuery } from "@apollo/client/react";
import { useFocusEffect, useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useCallback, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const BATTERY_ANIMATION = require("@/assets/animations/battery.json");
// The animation's fill bars physically exit the battery casing top before the
// mathematical scale peak (frame 53), creating a visual discharge effect from
// frame ~48 onward. Frame 47 is the last frame where the battery looks visually
// full before the bars begin leaving the casing.
const BATTERY_FULL_PROGRESS = 47 / 104;

const TOTAL_STEPS = 13;

export default function AllocationScreen() {
  const theme = Colors[useColorScheme()];
  const { state, updateField, persistDraft } = useWizard();
  const router = useRouter();
  const [zeroBalanceAcknowledged, setZeroBalanceAcknowledged] = useState(false);
  // batteryPct is 0–1 and drives the animation independently of allocationPct.
  // It resets to 0 each time the screen comes into focus.
  const [batteryPct, setBatteryPct] = useState(0);

  const { data } = useQuery<BalanceQuery>(BalanceDocument, {
    fetchPolicy: "cache-first",
  });

  const userCashBalance = parseFloat(
    (data?.balance?.cashBalance as string | null | undefined) ?? "0",
  );

  const frameBounds = state.frameName
    ? FRAME_CONFIG[state.frameName].bounds.allocationPct
    : { min: 0.01, max: 1.0 };

  const allocationMax = Math.min(
    frameBounds.max,
    Math.max(0, 1.0 - state.existingAllocationTotal),
  );

  useFocusEffect(
    useCallback(() => {
      setBatteryPct(0);
    }, []),
  );

  function handleAllocationChange(v: number) {
    updateField("allocationPct", v);
    const pct = allocationMax > 0 ? v / allocationMax : 0;
    setBatteryPct(Math.min(1, Math.max(0, pct)));
  }

  async function handleNext() {
    await persistDraft();
    router.push("/(bot-wizard)/awareness");
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <WizardProgressBar currentStep={5} totalSteps={TOTAL_STEPS} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.batteryWrapper}>
          <LottieView
            source={BATTERY_ANIMATION}
            progress={batteryPct * BATTERY_FULL_PROGRESS}
            loop={false}
            style={styles.batteryLottie}
          />
          <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
            <View style={styles.dollarContainer}>
              <Text style={[styles.dollarSign, { color: theme.textPrimary }]}>
                $
              </Text>
            </View>
          </View>
        </View>
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          Power Up Your Bot
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          How much of your account funds does this bot control?
        </Text>
        <AllocationControl
          value={state.allocationPct}
          onChange={handleAllocationChange}
          min={frameBounds.min}
          max={allocationMax}
          existingTotal={state.existingAllocationTotal}
          userCashBalance={userCashBalance}
        />
        {userCashBalance === 0 && (
          <Pressable
            style={[styles.acknowledgeRow, { borderColor: theme.warning }]}
            onPress={() => setZeroBalanceAcknowledged((v) => !v)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: zeroBalanceAcknowledged }}
          >
            <View
              style={[
                styles.checkbox,
                { borderColor: theme.warning },
                zeroBalanceAcknowledged && { backgroundColor: theme.warning },
              ]}
            >
              {zeroBalanceAcknowledged && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </View>
            <Text style={[styles.acknowledgeText, { color: theme.warning }]}>
              I understand this bot cannot activate until my account is funded.
            </Text>
          </Pressable>
        )}
      </ScrollView>
      <View style={styles.footer}>
        <Pressable
          onPress={handleNext}
          disabled={userCashBalance === 0 && !zeroBalanceAcknowledged}
          style={[
            styles.nextBtn,
            userCashBalance === 0 &&
              !zeroBalanceAcknowledged &&
              styles.nextBtnDisabled,
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
  safe: { flex: 1 },
  content: { padding: 16, gap: 16 },
  batteryWrapper: {
    alignSelf: "center",
    width: 200,
    height: 200,
  },
  batteryLottie: {
    width: 200,
    height: 200,
  },
  dollarContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dollarSign: {
    fontSize: 36,
    fontWeight: "700",
  },
  title: { fontSize: 22, fontWeight: "700" },
  subtitle: { fontSize: 14 },
  footer: { padding: 16, paddingBottom: 32 },
  nextBtn: {
    height: 52,
    borderRadius: 10,
    backgroundColor: Colors.dark.electricBlue,
    justifyContent: "center",
    alignItems: "center",
  },
  nextBtnLabel: { fontSize: 16, fontWeight: "700" },
  nextBtnDisabled: { opacity: 0.35 },
  acknowledgeRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: "rgba(242, 183, 5, 0.08)",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 1,
  },
  checkmark: { color: "#000", fontSize: 12, fontWeight: "700" },
  acknowledgeText: { fontSize: 13, flex: 1, lineHeight: 18 },
});
