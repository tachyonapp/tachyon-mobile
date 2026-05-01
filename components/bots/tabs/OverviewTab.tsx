import { Colors } from "@/constants/theme";
import { type BotQuery } from "@/generated/graphql";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  bot: NonNullable<BotQuery["bot"]>;
}

export function OverviewTab({ bot: _bot }: Props) {
  const theme = Colors[useColorScheme()];
  return (
    <View style={styles.container}>
      <Text style={[styles.placeholder, { color: theme.textSecondary }]}>
        Overview — Task 21
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  placeholder: { fontSize: 14 },
});
