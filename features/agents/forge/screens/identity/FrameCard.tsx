import { IconSymbol } from "@/components/shared/icon-symbol";
import { type FrameConfig } from "@/constants/frameConfig";
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

interface FrameCardProps {
  frame: FrameConfig;
  selected: boolean;
  onSelect: () => void;
}

export function FrameCard({ frame, selected, onSelect }: FrameCardProps) {
  const theme = Colors[useColorScheme()];
  const scale = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(400)).current;
  const [modalVisible, setModalVisible] = useState(false);

  function handlePress() {
    Animated.sequence([
      Animated.spring(scale, {
        toValue: 1.02,
        useNativeDriver: true,
        speed: 50,
        bounciness: 4,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 50,
        bounciness: 4,
      }),
    ]).start();
    openModal();
  }

  function openModal() {
    setModalVisible(true);
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 4,
      speed: 14,
    }).start();
  }

  function closeModal() {
    Animated.timing(translateY, {
      toValue: 400,
      duration: 220,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  }

  function handleConfirm() {
    onSelect();
    closeModal();
  }

  return (
    <>
      <Pressable onPress={handlePress} style={styles.pressable}>
        <Animated.View
          style={[
            styles.card,
            { backgroundColor: theme.surface },
            selected
              ? { borderWidth: 2, borderColor: frame.colorway }
              : { borderWidth: 1, borderColor: frame.colorway + "80" },
            selected && {
              shadowColor: frame.colorway,
              shadowOpacity: 0.5,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 0 },
              elevation: 8,
            },
            { transform: [{ scale }] },
          ]}
        >
          <View style={styles.content}>
            <Text style={[styles.gamifiedName, { color: theme.textPrimary }]}>
              {frame.gamifiedName}
            </Text>
            <Text style={[styles.strategyName, { color: frame.colorway }]}>
              {frame.strategyName}
            </Text>
            <Text style={[styles.description, { color: theme.textSecondary }]}>
              {frame.shortDescription}
            </Text>
          </View>
          {selected && (
            <View
              style={[styles.checkBadge, { backgroundColor: frame.colorway }]}
            >
              <IconSymbol name="checkmark" size={11} color="#FFFFFF" />
            </View>
          )}
        </Animated.View>
      </Pressable>

      <Modal
        visible={modalVisible}
        transparent
        animationType="none"
        onRequestClose={closeModal}
        statusBarTranslucent
      >
        <Pressable style={styles.backdrop} onPress={closeModal} />
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
          <View
            style={[styles.colorwayAccent, { backgroundColor: frame.colorway }]}
          />
          <Text style={[styles.sheetTitle, { color: theme.textPrimary }]}>
            {frame.gamifiedName}
          </Text>
          <Text style={[styles.sheetStrategy, { color: frame.colorway }]}>
            {frame.strategyName}
          </Text>
          <Text style={[styles.sheetBody, { color: theme.textSecondary }]}>
            {frame.description}
          </Text>
          <Pressable
            onPress={handleConfirm}
            style={[styles.confirmBtn, { backgroundColor: frame.colorway }]}
          >
            <Text style={styles.confirmLabel}>Select {frame.gamifiedName}</Text>
          </Pressable>
          <Pressable onPress={closeModal} style={styles.cancelBtn}>
            <Text style={[styles.cancelLabel, { color: theme.textSecondary }]}>
              Cancel
            </Text>
          </Pressable>
        </Animated.View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
    minHeight: 44,
  },
  card: {
    borderRadius: 10,
    overflow: "hidden",
    flex: 1,
  },
  content: {
    padding: 12,
    gap: 4,
  },
  gamifiedName: {
    fontSize: 15,
    fontWeight: "600",
  },
  strategyName: {
    fontSize: 12,
    fontWeight: "500",
  },
  description: {
    fontSize: 12,
    marginTop: 2,
  },
  checkBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
    gap: 10,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 8,
  },
  colorwayAccent: {
    height: 3,
    borderRadius: 2,
    width: 40,
    marginBottom: 4,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  sheetStrategy: {
    fontSize: 13,
    fontWeight: "500",
  },
  sheetBody: {
    fontSize: 14,
    lineHeight: 22,
    marginTop: 4,
  },
  confirmBtn: {
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  confirmLabel: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  cancelBtn: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelLabel: {
    fontSize: 14,
  },
});
