import { Colors } from "@/constants/theme";
import { BotPerformanceDocument } from "@/generated/graphql";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useQuery } from "@apollo/client/react";
import React from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { PLChart } from "./Chart";
import { PerformanceStatsGrid } from "./PerformanceStatsGrid";

interface Props {
  botId: string;
}

export function Performance({ botId }: Props) {
  const theme = Colors[useColorScheme()];

  const { data, loading } = useQuery(BotPerformanceDocument, {
    variables: { id: botId },
    fetchPolicy: "network-only",
  });

  const perf = data?.botPerformance;

  if (loading && !perf) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator color={theme.electricBlue} />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      {/* P&L Chart */}
      <PLChart data={data} />

      {perf && <PerformanceStatsGrid perf={perf} theme={theme} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 12, paddingBottom: 32 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
});
