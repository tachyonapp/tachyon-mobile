import { REJECTION_REASON_COPY } from "@/constants/rejectionReasonCopy";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
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
  rejectionReason: string | null | undefined;
}

export function PreSubmissionRejectionModal({
  visible,
  onDismiss,
  rejectionReason,
}: Props) {
  const theme = Colors[useColorScheme()];

  const bodyText =
    (rejectionReason && REJECTION_REASON_COPY[rejectionReason]) ??
    "This proposal was blocked by the rule engine.";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onDismiss}
    >
      <Pressable style={styles.overlay} onPress={onDismiss}>
        <Pressable style={[styles.sheet, { backgroundColor: theme.surface }]}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            ${"Your approval couldn't be processed"}
          </Text>

          <Text style={[styles.body, { color: theme.textSecondary }]}>
            {bodyText}
          </Text>

          <TouchableOpacity
            style={[styles.dismissBtn, { backgroundColor: theme.electricBlue }]}
            onPress={onDismiss}
            activeOpacity={0.8}
          >
            <Text style={styles.dismissBtnText}>Got it</Text>
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
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
  },
  dismissBtn: {
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  dismissBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});
