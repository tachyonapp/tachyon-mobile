import { Colors } from "@/constants/theme";
import React, { useRef, useState } from "react";
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface EducationalTooltipProps {
  title: string;
  body: string;
  trigger?: React.ReactNode;
}

export function EducationalTooltip({ title, body, trigger }: EducationalTooltipProps) {
  const [visible, setVisible] = useState(false);
  const translateY = useRef(new Animated.Value(300)).current;

  function open() {
    setVisible(true);
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 4,
      speed: 14,
    }).start();
  }

  function close() {
    Animated.timing(translateY, {
      toValue: 300,
      duration: 220,
      useNativeDriver: true,
    }).start(() => setVisible(false));
  }

  return (
    <>
      <Pressable onPress={open} hitSlop={12}>
        {trigger ?? <Text style={styles.defaultTrigger}>ℹ️</Text>}
      </Pressable>

      <Modal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={close}
        statusBarTranslucent
      >
        {/* Backdrop — tap to dismiss */}
        <Pressable style={styles.backdrop} onPress={close} />

        <Animated.View
          style={[styles.sheet, { transform: [{ translateY }] }]}
        >
          <View style={styles.handle} />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.body}>{body}</Text>
          <Pressable onPress={close} style={styles.dismissBtn}>
            <Text style={styles.dismissLabel}>Got it</Text>
          </Pressable>
        </Animated.View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  defaultTrigger: {
    fontSize: 16,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.dark.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
    gap: 14,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.dark.textDisabled,
    alignSelf: "center",
    marginBottom: 6,
  },
  title: {
    color: Colors.dark.textPrimary,
    fontSize: 17,
    fontWeight: "700",
  },
  body: {
    color: Colors.dark.textSecondary,
    fontSize: 14,
    lineHeight: 22,
  },
  dismissBtn: {
    height: 44,
    borderRadius: 8,
    backgroundColor: Colors.dark.electricBlue,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },
  dismissLabel: {
    color: Colors.dark.textPrimary,
    fontSize: 15,
    fontWeight: "600",
  },
});
