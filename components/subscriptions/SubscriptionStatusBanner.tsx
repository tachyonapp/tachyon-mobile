import { Colors } from "@/constants/theme";
import { SubscriptionStatus } from "@/generated/graphql";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  status: SubscriptionStatus.Suspended | SubscriptionStatus.Cancelled;
}

export function SubscriptionStatusBanner({ status }: Props) {
  const isSuspended = status === SubscriptionStatus.Suspended;

  return (
    <View
      style={[
        styles.banner,
        {
          backgroundColor: isSuspended
            ? Colors.dark.warning
            : Colors.dark.danger,
        },
      ]}
    >
      <Text style={styles.bannerText}>
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
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
