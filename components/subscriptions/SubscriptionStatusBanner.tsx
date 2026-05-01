import { Colors } from "@/constants/theme";
import { SubscriptionStatus } from "@/generated/graphql";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  status: SubscriptionStatus.Suspended | SubscriptionStatus.Cancelled;
}

export function SubscriptionStatusBanner({ status }: Props) {
  const theme = Colors[useColorScheme()];
  const isSuspended = status === SubscriptionStatus.Suspended;

  return (
    <View
      style={[
        styles.banner,
        { backgroundColor: isSuspended ? theme.warning : theme.danger },
      ]}
    >
      <Text style={[styles.bannerText, { color: theme.textPrimary }]}>
        {isSuspended
          ? "Your subscription is suspended. Reactivate to resume trading."
          : "Your subscription has been cancelled."}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    minHeight: 44,
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: "center",
  },
  bannerText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
