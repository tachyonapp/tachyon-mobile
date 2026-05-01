import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  botId: string;
}

export function PerformanceTab({ botId: _botId }: Props) {
  const theme = Colors[useColorScheme()];
  return (
    <View style={styles.container}>
      <Text style={[styles.placeholder, { color: theme.textSecondary }]}>
        Performance — Task 22
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  placeholder: { fontSize: 14 },
});
