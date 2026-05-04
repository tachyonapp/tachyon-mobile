import { ActionBar } from "@/components/bots/ActionBar";
import { BotDetailHero } from "@/components/bots/BotDetailHero";
import { BotDetailTabs, type TabName } from "@/components/bots/BotDetailTabs";
import { DeleteConfirmationDialog } from "@/components/bots/DeleteConfirmationDialog";
import { EditIdentitySheet } from "@/components/bots/EditIdentitySheet";
import { BrainTab } from "@/components/bots/tabs/BrainTab";
import { ConfigurationTab } from "@/components/bots/tabs/ConfigurationTab";
import { OverviewTab } from "@/components/bots/tabs/OverviewTab";
import { PerformanceTab } from "@/components/bots/tabs/PerformanceTab";
import { ReactivationBottomSheet } from "@/components/subscriptions/ReactivationBottomSheet";
import { Colors } from "@/constants/theme";
import {
  BotDocument,
  MeSubscriptionDocument,
  SubscriptionStatus,
} from "@/generated/graphql";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useQuery } from "@apollo/client/react";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function BotDetailScreen() {
  const theme = Colors[useColorScheme()];
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<TabName>("Overview");
  const [editSheetVisible, setEditSheetVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [reactivationVisible, setReactivationVisible] = useState(false);

  const { data, loading } = useQuery(BotDocument, {
    variables: { id },
    fetchPolicy: "cache-and-network",
  });

  const { data: meData } = useQuery(MeSubscriptionDocument);

  const bot = data?.bot;
  const subscriptionStatus = meData?.me?.subscriptionStatus;
  const isBlocked =
    subscriptionStatus === SubscriptionStatus.Suspended ||
    subscriptionStatus === SubscriptionStatus.Cancelled;

  const handleActivate = () => {
    if (isBlocked) {
      setReactivationVisible(true);
      return;
    }
    router.push(`/(bot-detail)/${id}/activate` as any);
  };

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
        onActivate={handleActivate}
        onPause={() => router.push(`/(bot-detail)/${id}/pause` as any)}
        onDelete={() => setDeleteDialogVisible(true)}
        onEditIdentity={() => setEditSheetVisible(true)}
      />
      <EditIdentitySheet
        bot={bot}
        visible={editSheetVisible}
        onDismiss={() => setEditSheetVisible(false)}
      />
      <DeleteConfirmationDialog
        bot={bot}
        visible={deleteDialogVisible}
        onDismiss={() => setDeleteDialogVisible(false)}
      />
      {isBlocked && subscriptionStatus != null && (
        <ReactivationBottomSheet
          visible={reactivationVisible}
          onDismiss={() => setReactivationVisible(false)}
          status={subscriptionStatus}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: { flex: 1, alignItems: "center", justifyContent: "center" },
  tabContent: { flex: 1 },
});
