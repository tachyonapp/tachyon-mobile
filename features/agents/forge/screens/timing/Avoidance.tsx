import { Colors } from "@/constants/theme";
import type { WizardState } from "@/context/WizardContext";
import { ForgeSection } from "@/features/agents/forge/components/ForgeSection";
import { FrameAdvisoryBanner } from "@/features/agents/forge/components/FrameAdvisoryBanner";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  DayOfWeek,
  FrameAdvisory,
} from "@tachyonapp/tachyon-queue-types/config";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface AvoidanceProps {
  visibleAdvisories: FrameAdvisory[];
  dayAvoidance: DayOfWeek[];
  hasActiveTradingDay: boolean;
  updateField: <K extends keyof WizardState>(
    field: K,
    value: WizardState[K],
  ) => void;
  handleDismiss: (code: string) => void;
}

const DAYS: { key: DayOfWeek; label: string }[] = [
  { key: DayOfWeek.MONDAY, label: "MON" },
  { key: DayOfWeek.TUESDAY, label: "TUE" },
  { key: DayOfWeek.WEDNESDAY, label: "WED" },
  { key: DayOfWeek.THURSDAY, label: "THU" },
  { key: DayOfWeek.FRIDAY, label: "FRI" },
];

export const Avoidance = ({
  visibleAdvisories,
  dayAvoidance,
  hasActiveTradingDay,
  updateField,
  handleDismiss,
}: AvoidanceProps) => {
  const theme = Colors[useColorScheme()];

  function toggleDayAvoidance(day: DayOfWeek) {
    const current = dayAvoidance;
    const updated = current.includes(day)
      ? current.filter((d) => d !== day)
      : [...current, day];
    updateField("dayAvoidance", updated);
  }

  return (
    <ForgeSection
      title="Day Avoidance"
      subtitle="Select days your agent should never trade. Leave all active to trade every weekday."
    >
      <View style={styles.dayRow}>
        {DAYS.map(({ key, label }) => {
          const isAvoided = dayAvoidance.includes(key);
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
          Your agent will never trade — please leave at least one active day.
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
  );
};

const styles = StyleSheet.create({
  dayRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 15,
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
