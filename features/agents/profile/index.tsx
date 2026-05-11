import { ReactivationBottomSheet } from "@/components/subscriptions/ReactivationBottomSheet";
import { Colors } from "@/constants/theme";
import { ActionBar } from "@/features/agents/profile/components/ActionBar";
import { DeleteConfirmationDialog } from "@/features/agents/profile/components/DeleteConfirmationDialog";
import { EditIdentitySheet } from "@/features/agents/profile/components/EditIdentitySheet";
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
import { Hero } from "./components/Hero";
import { Tabs, type TabName } from "./tabs";
import { Configuration } from "./tabs/configuration";
import { Overview } from "./tabs/overview";
import { Performance } from "./tabs/performance";
import { Subscription } from "./tabs/subscription";

export default function AgentProfile() {
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

  const agent = data?.bot;
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

  if (loading && !agent) {
    return (
      <View style={[styles.loading, { backgroundColor: theme.background }]}>
        <ActivityIndicator color={theme.electricBlue} />
      </View>
    );
  }

  if (!agent) return null;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Hero agent={agent} />
      <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
      <View style={styles.tabContent}>
        {activeTab === "Overview" && <Overview agent={agent} />}
        {activeTab === "Performance" && <Performance agentId={id} />}
        {activeTab === "Configuration" && <Configuration agent={agent} />}
        {activeTab === "Brain" && <Subscription agent={agent} />}
      </View>
      <ActionBar
        agent={agent}
        onActivate={handleActivate}
        onPause={() => router.push(`/(bot-detail)/${id}/pause` as any)}
        onDelete={() => setDeleteDialogVisible(true)}
        onEditIdentity={() => setEditSheetVisible(true)}
      />
      <EditIdentitySheet
        agent={agent}
        visible={editSheetVisible}
        onDismiss={() => setEditSheetVisible(false)}
      />
      <DeleteConfirmationDialog
        agent={agent}
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
