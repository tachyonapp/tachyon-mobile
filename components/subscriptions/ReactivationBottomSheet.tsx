import { Colors } from "@/constants/theme";
import { SubscriptionStatus } from "@/generated/graphql";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { router } from "expo-router";
import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

interface Props {
  visible: boolean;
  onDismiss: () => void;
  status: SubscriptionStatus.Suspended | SubscriptionStatus.Cancelled;
}

export function ReactivationBottomSheet({ visible, onDismiss, status }: Props) {
  const theme = Colors[useColorScheme()];

  const isSuspended = status === SubscriptionStatus.Suspended;

  const headline = isSuspended
    ? "Your subscription is suspended"
    : "Your subscription is cancelled";

  const body = isSuspended
    ? "Your trial or subscription has expired. Reactivate to create new bots and activate existing ones."
    : "Your subscription has been cancelled. Reactivate to restore full access.";

  const handleReactivate = () => {
    onDismiss();
    router.push("/(subscription)/tier-selection" as never);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onDismiss}
    >
      <Pressable style={styles.overlay} onPress={onDismiss}>
        <Pressable style={[styles.sheet, { backgroundColor: theme.surface }]}>
          <Text style={[styles.headline, { color: theme.textPrimary }]}>
            {headline}
          </Text>

          <Text style={[styles.body, { color: theme.textSecondary }]}>
            {body}
          </Text>

          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: theme.electricBlue }]}
            onPress={handleReactivate}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryBtnText}>Reactivate Subscription</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryBtn} onPress={onDismiss}>
            <Text
              style={[styles.secondaryBtnText, { color: theme.textSecondary }]}
            >
              Not Now
            </Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 24,
    gap: 16,
  },
  headline: {
    fontSize: 20,
    fontWeight: "700",
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
  },
  primaryBtn: {
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  secondaryBtn: {
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryBtnText: {
    fontSize: 15,
    fontWeight: "500",
  },
});
