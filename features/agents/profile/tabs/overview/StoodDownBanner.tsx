import { RecoveryModeEducationSheet } from "@/components/shared/RecoveryModeEducationSheet";
import { REJECTION_REASON_COPY } from "@/constants/rejectionReasonCopy";
import { Colors } from "@/constants/theme";
import { BotStatus } from "@/generated/graphql";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const STOOD_DOWN_RED = "#D64545";

interface Props {
  status: BotStatus | null | undefined;
  standdownReason: string | null | undefined;
  recoveryModeApplied: string | null | undefined;
  recoveryModeActiveUntil: string | null | undefined;
}

function daysUntil(dateValue: string | null | undefined): number {
  if (!dateValue) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const until = new Date(dateValue);
  until.setHours(0, 0, 0, 0);
  return Math.max(
    0,
    Math.ceil((until.getTime() - today.getTime()) / 86_400_000),
  );
}

export function StoodDownBanner({
  status,
  standdownReason,
  recoveryModeApplied,
  recoveryModeActiveUntil,
}: Props) {
  const theme = Colors[useColorScheme()];
  const [sheetVisible, setSheetVisible] = useState(false);

  if (status !== BotStatus.StoodDown) return null;

  const reasonText =
    (standdownReason && REJECTION_REASON_COPY[standdownReason]) ??
    "Your agent stood down for the day.";

  const showRecoveryLine = recoveryModeApplied === "MORE_CONSERVATIVE_2D";
  const days = showRecoveryLine ? daysUntil(recoveryModeActiveUntil) : 0;

  return (
    <>
      <View
        style={[
          styles.banner,
          { backgroundColor: theme.surface, borderLeftColor: STOOD_DOWN_RED },
        ]}
      >
        <Text style={[styles.reasonText, { color: theme.textPrimary }]}>
          {reasonText}
        </Text>

        <Text style={[styles.resetLine, { color: theme.textSecondary }]}>
          Resets at next market open (9:30 AM ET)
        </Text>

        {showRecoveryLine && (
          <Pressable onPress={() => setSheetVisible(true)}>
            <Text style={[styles.recoveryLine, { color: theme.warning }]}>
              Recovery Mode active: Half position sizing for {days} more trading
              days ›
            </Text>
          </Pressable>
        )}
      </View>

      <RecoveryModeEducationSheet
        visible={sheetVisible}
        onDismiss={() => setSheetVisible(false)}
        recoveryModeApplied={recoveryModeApplied}
      />
    </>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderRadius: 10,
    borderLeftWidth: 4,
    padding: 14,
    paddingLeft: 12,
    gap: 6,
  },
  reasonText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
  },
  resetLine: {
    fontSize: 13,
  },
  recoveryLine: {
    fontSize: 13,
    fontWeight: "600",
  },
});
