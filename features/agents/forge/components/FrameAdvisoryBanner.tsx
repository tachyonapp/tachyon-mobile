import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { type FrameAdvisory } from "@tachyonapp/tachyon-queue-types/config";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface FrameAdvisoryBannerProps {
  advisory: FrameAdvisory;
  onDismiss: (code: string) => void;
}

export function FrameAdvisoryBanner({
  advisory,
  onDismiss,
}: FrameAdvisoryBannerProps) {
  const theme = Colors[useColorScheme()];

  return (
    <View
      style={[
        styles.banner,
        { backgroundColor: theme.surface, borderLeftColor: theme.warning },
      ]}
    >
      <Text style={[styles.message, { color: theme.textSecondary }]}>
        {advisory.message}
      </Text>
      <TouchableOpacity
        onPress={() => onDismiss(advisory.code)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={styles.dismiss}
      >
        <Text style={[styles.dismissText, { color: theme.textDisabled }]}>
          ×
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingVertical: 10,
    paddingLeft: 12,
    paddingRight: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  message: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  dismiss: {
    paddingTop: 1,
  },
  dismissText: {
    fontSize: 18,
    fontWeight: "400",
    lineHeight: 20,
  },
});
