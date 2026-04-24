import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
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

export function EducationalTooltip({
  title,
  body,
  trigger,
}: EducationalTooltipProps) {
  const theme = Colors[useColorScheme()];
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
      <Pressable onPress={open} hitSlop={16}>
        {trigger ?? (
          <IconSymbol
            name="info.circle"
            size={22}
            color={theme.textSecondary}
          />
        )}
      </Pressable>

      <Modal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={close}
        statusBarTranslucent
      >
        <Pressable style={styles.backdrop} onPress={close} />

        <Animated.View
          style={[
            styles.sheet,
            { backgroundColor: theme.surface },
            { transform: [{ translateY }] },
          ]}
        >
          <View
            style={[styles.handle, { backgroundColor: theme.textDisabled }]}
          />
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            {title}
          </Text>
          <Text style={[styles.body, { color: theme.textSecondary }]}>
            {body}
          </Text>
          <Pressable
            onPress={close}
            style={[styles.dismissBtn, { backgroundColor: theme.electricBlue }]}
          >
            <Text style={styles.dismissLabel}>Got it</Text>
          </Pressable>
        </Animated.View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
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
    alignSelf: "center",
    marginBottom: 6,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
  },
  body: {
    fontSize: 14,
    lineHeight: 22,
  },
  dismissBtn: {
    height: 44,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },
  dismissLabel: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});
