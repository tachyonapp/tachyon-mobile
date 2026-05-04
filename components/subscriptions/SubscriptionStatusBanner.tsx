import { SubscriptionStatus } from "@/generated/graphql";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  status: SubscriptionStatus.Suspended | SubscriptionStatus.Cancelled;
  onReactivate?: () => void;
}

export function SubscriptionStatusBanner({ status, onReactivate }: Props) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const copy =
    status === SubscriptionStatus.Suspended
      ? "Your subscription has expired. Reactivate to continue using your bots."
      : "Your subscription has been cancelled. Reactivate to continue using your bots.";

  return (
    <View style={styles.banner}>
      <Text style={styles.copy}>{copy}</Text>
      <View style={styles.actions}>
        {onReactivate != null && (
          <TouchableOpacity onPress={onReactivate} style={styles.reactivateBtn}>
            <Text style={styles.reactivateText}>Reactivate</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => setDismissed(true)}
          style={styles.dismissBtn}
        >
          <Text style={styles.dismissText}>Dismiss</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: "#D64545",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  copy: { color: "#FFFFFF", fontSize: 14 },
  actions: { flexDirection: "row", marginTop: 8, gap: 12 },
  reactivateBtn: { padding: 4 },
  reactivateText: { color: "#FFFFFF", fontSize: 13, fontWeight: "600" },
  dismissBtn: { padding: 4 },
  dismissText: { color: "rgba(255,255,255,0.8)", fontSize: 13 },
});
