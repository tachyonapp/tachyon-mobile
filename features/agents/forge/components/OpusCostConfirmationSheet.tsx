import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface OpusCostConfirmationSheetProps {
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function OpusCostConfirmationSheet({
  isVisible,
  onConfirm,
  onCancel,
}: OpusCostConfirmationSheetProps) {
  const theme = Colors[useColorScheme()];

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Pressable style={[styles.sheet, { backgroundColor: theme.surface }]}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            Opus uses more compute
          </Text>

          <Text style={[styles.body, { color: theme.textSecondary }]}>
            Opus is Anthropic's most capable model and will use more API credits
            per scan than Haiku or Sonnet. You are responsible for any costs
            incurred on your BYOK API key.
          </Text>

          <TouchableOpacity
            style={[styles.confirmBtn, { backgroundColor: theme.electricBlue }]}
            onPress={onConfirm}
            activeOpacity={0.8}
          >
            <Text style={styles.confirmText}>I understand, use Opus</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.cancelBtn, { borderColor: theme.inputBorder }]}
            onPress={onCancel}
          >
            <Text style={[styles.cancelText, { color: theme.textSecondary }]}>
              Cancel
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
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
  },
  confirmBtn: {
    height: 48,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  cancelBtn: {
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  cancelText: {
    fontSize: 15,
    fontWeight: "500",
  },
});
