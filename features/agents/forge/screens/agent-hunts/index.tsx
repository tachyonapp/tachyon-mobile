import { Colors } from "@/constants/theme";
import { useWizard } from "@/context/WizardContext";
import { ForgeNavBar } from "@/features/agents/forge/components/ForgeNavBar";
import { ForgeOptionCard } from "@/features/agents/forge/components/ForgeOptionCard";
import { ForgeSection } from "@/features/agents/forge/components/ForgeSection";
import { FrameAdvisoryBanner } from "@/features/agents/forge/components/FrameAdvisoryBanner";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  type DayOfWeek,
  type SessionPreference,
  type VolatilityEnvPreference,
} from "@tachyonapp/tachyon-queue-types/config";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const SESSION_OPTIONS: {
  value: SessionPreference;
  label: string;
  description: string;
}[] = [
  {
    value: "FULL_SESSION",
    label: "Full Session",
    description:
      "Trades throughout the entire market session (9:30am–4pm ET).",
  },
  {
    value: "MORNING_HUNTER",
    label: "Morning Hunter (9:30–12pm)",
    description:
      "Focuses activity in the morning when volume and price discovery are highest.",
  },
  {
    value: "AFTERNOON_HUNTER",
    label: "Afternoon Hunter (12–4pm)",
    description:
      "Focuses activity in the afternoon session after morning noise settles.",
  },
  {
    value: "AVOID_FIRST_30",
    label: "Avoid First 30 Min",
    description:
      "Skips the opening 30 minutes to avoid erratic spreads. Trades from 10am onward.",
  },
];

const VOLATILITY_OPTIONS: {
  value: VolatilityEnvPreference;
  label: string;
  description: string;
}[] = [
  {
    value: "PREFERS_LOW_VIX",
    label: "Prefers Calm Markets",
    description:
      "More active when the VIX is low. Pulls back in high-volatility environments.",
  },
  {
    value: "PREFERS_HIGH_VIX",
    label: "Prefers Volatile Markets",
    description:
      "Thrives when the VIX is elevated. Seeks larger intraday moves.",
  },
  {
    value: "NO_PREFERENCE",
    label: "No Preference",
    description: "Trades in any volatility environment without adjustment.",
  },
];

const DAYS: { key: DayOfWeek; label: string }[] = [
  { key: "MONDAY", label: "MON" },
  { key: "TUESDAY", label: "TUE" },
  { key: "WEDNESDAY", label: "WED" },
  { key: "THURSDAY", label: "THU" },
  { key: "FRIDAY", label: "FRI" },
];

export default function AgentHunts() {
  const { state, updateField, persistDraft, hasActiveTradingDay } = useWizard();
  const router = useRouter();
  const theme = Colors[useColorScheme()];
  const [dismissedAdvisories, setDismissedAdvisories] = useState<string[]>([]);

  const visibleAdvisories = state.activeAdvisories.filter(
    (a) => !dismissedAdvisories.includes(a.code),
  );

  const handleDismiss = (code: string) => {
    setDismissedAdvisories((prev) => [...prev, code]);
  };

  function toggleDayAvoidance(day: DayOfWeek) {
    const current = state.dayAvoidance;
    const updated = current.includes(day)
      ? current.filter((d) => d !== day)
      : [...current, day];
    updateField("dayAvoidance", updated);
  }

  async function handleNext() {
    await persistDraft();
    router.push("/(agent-forge)/step-5-brain");
  }

  async function handleBack() {
    await persistDraft();
    router.back();
  }

  return (
    <>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.scrollContent}
      >
        {/* Session Preference */}
        <ForgeSection
          title="Session Preference"
          subtitle="Which part of the trading day should your agent focus on?"
        >
          {SESSION_OPTIONS.map((opt) => (
            <ForgeOptionCard
              key={opt.value}
              label={opt.label}
              description={opt.description}
              selected={state.sessionPreference === opt.value}
              onSelect={() => updateField("sessionPreference", opt.value)}
            />
          ))}
          {visibleAdvisories
            .filter((a) => a.field === "sessionPreference")
            .map((a) => (
              <View key={a.code} style={styles.advisorySpacing}>
                <FrameAdvisoryBanner advisory={a} onDismiss={handleDismiss} />
              </View>
            ))}
        </ForgeSection>

        {/* Day Avoidance */}
        <ForgeSection
          title="Day Avoidance"
          subtitle="Select days your agent should never trade. Leave all active to trade every weekday."
        >
          <View style={styles.dayRow}>
            {DAYS.map(({ key, label }) => {
              const isAvoided = state.dayAvoidance.includes(key);
              return (
                <Pressable
                  key={key}
                  onPress={() => toggleDayAvoidance(key)}
                  style={[
                    styles.dayChip,
                    {
                      backgroundColor: isAvoided
                        ? theme.electricBlue
                        : theme.surface,
                      borderColor: isAvoided
                        ? theme.electricBlue
                        : theme.textDisabled,
                    },
                  ]}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: isAvoided }}
                  accessibilityLabel={`${label}: ${isAvoided ? "avoided" : "active"}`}
                >
                  <Text
                    style={[
                      styles.dayLabel,
                      {
                        color: isAvoided ? "#FFFFFF" : theme.textSecondary,
                      },
                    ]}
                  >
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          {!hasActiveTradingDay && (
            <Text style={[styles.validationHint, { color: theme.warning }]}>
              Your agent will never trade — please leave at least one active
              day.
            </Text>
          )}
          {visibleAdvisories
            .filter((a) => a.field === "dayAvoidance")
            .map((a) => (
              <View key={a.code} style={styles.advisorySpacing}>
                <FrameAdvisoryBanner advisory={a} onDismiss={handleDismiss} />
              </View>
            ))}
        </ForgeSection>

        {/* Volatility Environment Preference */}
        <ForgeSection
          title="Volatility Environment"
          subtitle="How should your agent respond to broad market volatility conditions?"
        >
          {VOLATILITY_OPTIONS.map((opt) => (
            <ForgeOptionCard
              key={opt.value}
              label={opt.label}
              description={opt.description}
              selected={state.volatilityEnvPreference === opt.value}
              onSelect={() => updateField("volatilityEnvPreference", opt.value)}
            />
          ))}
          {visibleAdvisories
            .filter((a) => a.field === "volatilityEnvPreference")
            .map((a) => (
              <View key={a.code} style={styles.advisorySpacing}>
                <FrameAdvisoryBanner advisory={a} onDismiss={handleDismiss} />
              </View>
            ))}
        </ForgeSection>
      </ScrollView>

      <ForgeNavBar
        onBack={handleBack}
        onNext={handleNext}
        nextDisabled={!hasActiveTradingDay}
      />
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    gap: 28,
    paddingBottom: 16,
  },
  dayRow: {
    flexDirection: "row",
    gap: 8,
  },
  dayChip: {
    flex: 1,
    minHeight: 44,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  advisorySpacing: {
    marginTop: 8,
  },
  validationHint: {
    fontSize: 13,
    marginTop: 6,
  },
});
