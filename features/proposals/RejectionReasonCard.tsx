import { REJECTION_REASON_COPY } from "@/constants/rejectionReasonCopy";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  status: string | null | undefined;
  rejectionReason: string | null | undefined;
}

export function RejectionReasonCard({ status, rejectionReason }: Props) {
  const theme = Colors[useColorScheme()];

  if (status !== "REJECTED") return null;

  const bodyText =
    (rejectionReason && REJECTION_REASON_COPY[rejectionReason]) ??
    "This proposal was blocked by the rule engine.";

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.warning + "18",
          borderColor: theme.warning + "40",
        },
      ]}
    >
      <Text style={[styles.label, { color: theme.textSecondary }]}>
        WHY WAS THIS BLOCKED?
      </Text>
      <Text style={[styles.body, { color: theme.textSecondary }]}>
        {bodyText}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 14,
    gap: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
  },
});
