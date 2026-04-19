import { WizardProgressBar } from "@/components/wizard/WizardProgressBar";
import { WizardStepAnimation } from "@/components/wizard/WizardStepAnimation";
import { Colors } from "@/constants/theme";
import { useWizard } from "@/context/WizardContext";
import { useRouter } from "expo-router";
import React from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

const TOTAL_STEPS = 13;

export default function RulesScreen() {
  const { state, updateField, persistDraft } = useWizard();
  const router = useRouter();

  async function handleNext() {
    await persistDraft();
    router.push("/(bot-wizard)/identity");
  }

  return (
    <SafeAreaView style={styles.safe}>
      <WizardProgressBar currentStep={10} totalSteps={TOTAL_STEPS} />
      <ScrollView contentContainerStyle={styles.content}>
        <WizardStepAnimation source={null} />
        <Text style={styles.title}>Rules of Engagement</Text>
        <Text style={styles.subtitle}>
          Set the operating rules your bot must follow.
        </Text>

        <View style={styles.toggleGroup}>
          {/* Overnight holding */}
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Allow overnight holding</Text>
            <Switch
              value={state.rulesOfEngagement.overnightHoldAllowed}
              onValueChange={(on) =>
                updateField("rulesOfEngagement", {
                  ...state.rulesOfEngagement,
                  overnightHoldAllowed: on,
                })
              }
              trackColor={{
                true: Colors.dark.electricBlue,
                false: Colors.dark.surface,
              }}
              thumbColor={Colors.dark.textPrimary}
            />
          </View>

          {/* No same-day exit */}
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>
              Avoid same-day exits unless stop-loss triggered
            </Text>
            <Switch
              value={state.rulesOfEngagement.noSameDayExitUnlessStopLoss}
              onValueChange={(on) =>
                updateField("rulesOfEngagement", {
                  ...state.rulesOfEngagement,
                  noSameDayExitUnlessStopLoss: on,
                })
              }
              trackColor={{
                true: Colors.dark.electricBlue,
                false: Colors.dark.surface,
              }}
              thumbColor={Colors.dark.textPrimary}
            />
          </View>

          {/* One trade at a time — locked / read-only */}
          <View style={[styles.toggleRow, styles.toggleRowLocked]}>
            <View style={styles.lockedLabelGroup}>
              <Text style={styles.toggleLabel}>One trade at a time</Text>
              <Text style={styles.lockIcon}>🔒</Text>
              <Text style={styles.lockedHint}>
                Required in MVP. Your bot will only hold one position at a time.
              </Text>
            </View>
            <Switch
              value={true}
              disabled={true}
              trackColor={{
                true: Colors.dark.electricBlue,
                false: Colors.dark.surface,
              }}
              thumbColor={Colors.dark.textPrimary}
            />
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Pressable onPress={handleNext} style={styles.nextBtn}>
          <Text style={styles.nextBtnLabel}>Next</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.dark.background },
  content: { padding: 16, gap: 16 },
  title: {
    color: Colors.dark.textPrimary,
    fontSize: 22,
    fontWeight: "700",
  },
  subtitle: { color: Colors.dark.textSecondary, fontSize: 14 },
  toggleGroup: {
    gap: 4,
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 52,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.dark.inputBorder,
  },
  toggleRowLocked: {
    opacity: 0.7,
  },
  toggleLabel: {
    color: Colors.dark.textPrimary,
    fontSize: 14,
    flex: 1,
    marginRight: 12,
  },
  lockedLabelGroup: {
    flex: 1,
    marginRight: 12,
    gap: 4,
  },
  lockIcon: {
    fontSize: 12,
  },
  lockedHint: {
    color: Colors.dark.textSecondary,
    fontSize: 12,
    lineHeight: 16,
  },
  footer: { padding: 16, paddingBottom: 32 },
  nextBtn: {
    height: 52,
    borderRadius: 10,
    backgroundColor: Colors.dark.electricBlue,
    justifyContent: "center",
    alignItems: "center",
  },
  nextBtnLabel: {
    color: Colors.dark.textPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
});
