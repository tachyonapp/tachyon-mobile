import { ActionBar } from "@/components/bots/ActionBar";
import { BotDetailHero } from "@/components/bots/BotDetailHero";
import { BotDetailTabs, type TabName } from "@/components/bots/BotDetailTabs";
import { BrainTab } from "@/components/bots/tabs/BrainTab";
import { ConfigurationTab } from "@/components/bots/tabs/ConfigurationTab";
import { OverviewTab } from "@/components/bots/tabs/OverviewTab";
import { PerformanceTab } from "@/components/bots/tabs/PerformanceTab";
import { Colors } from "@/constants/theme";
import { BotDocument } from "@/generated/graphql";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useQuery } from "@apollo/client/react";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function BotDetailScreen() {
  const theme = Colors[useColorScheme()];
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<TabName>("Overview");

  const { data, loading } = useQuery(BotDocument, {
    variables: { id },
    fetchPolicy: "cache-and-network",
  });

  const bot = data?.bot;

  if (loading && !bot) {
    return (
      <View style={[styles.loading, { backgroundColor: theme.background }]}>
        <ActivityIndicator color={theme.electricBlue} />
      </View>
    );
  }

  if (!bot) return null;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <BotDetailHero bot={bot} />
      <BotDetailTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <View style={styles.tabContent}>
        {activeTab === "Overview" && <OverviewTab bot={bot} />}
        {activeTab === "Performance" && <PerformanceTab botId={id} />}
        {activeTab === "Configuration" && <ConfigurationTab bot={bot} />}
        {activeTab === "Brain" && <BrainTab bot={bot} />}
      </View>
      <ActionBar
        bot={bot}
        onActivate={() => router.push(`/(bot-detail)/${id}/activate` as any)}
        onPause={() => router.push(`/(bot-detail)/${id}/pause` as any)}
        onDelete={() => router.push(`/(bot-detail)/${id}/delete` as any)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: { flex: 1, alignItems: "center", justifyContent: "center" },
  tabContent: { flex: 1 },
});
