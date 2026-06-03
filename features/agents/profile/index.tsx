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
import { buildRebuildInitialState, useWizard } from "@/context/WizardContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useQuery } from "@apollo/client/react";
import { router, useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { Hero } from "./components/Hero";
import { Tabs, type TabName } from "./tabs";
import { Configuration } from "./tabs/configuration";
import { Overview } from "./tabs/overview";
import { Performance } from "./tabs/performance";
import { Subscription } from "./tabs/subscription";

const TAB_ORDER: TabName[] = ["Overview", "Performance", "Configuration", "Brain"];

export default function AgentProfile() {
  const theme = Colors[useColorScheme()];
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width } = useWindowDimensions();
  const pagerRef = useRef<ScrollView>(null);
  const [activeTab, setActiveTab] = useState<TabName>("Overview");
  const [editSheetVisible, setEditSheetVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [reactivationVisible, setReactivationVisible] = useState(false);

  const { data, loading, error } = useQuery(BotDocument, {
    variables: { id: id! },
    skip: !id,
    fetchPolicy: "cache-and-network",
  });

  const { data: meData } = useQuery(MeSubscriptionDocument);
  const { initWithState } = useWizard();

  const agent = data?.bot;
  const subscriptionStatus = meData?.me?.subscriptionStatus;
  const isBlocked =
    subscriptionStatus === SubscriptionStatus.Suspended ||
    subscriptionStatus === SubscriptionStatus.Cancelled;

  const handleTabChange = (tab: TabName) => {
    const index = TAB_ORDER.indexOf(tab);
    pagerRef.current?.scrollTo({ x: index * width, animated: true });
    setActiveTab(tab);
  };

  const handlePagerScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    const tab = TAB_ORDER[index];
    if (tab && tab !== activeTab) setActiveTab(tab);
  };

  const handleRebuild = () => {
    if (!agent) return;
    initWithState(buildRebuildInitialState(agent));
    router.push("/(agent-forge)" as any);
  };

  const handleActivate = () => {
    if (isBlocked) {
      setReactivationVisible(true);
      return;
    }
    router.push(`/(bot-detail)/${id}/activate` as any);
  };

  if (!id || (loading && !agent)) {
    return (
      <View style={[styles.loading, { backgroundColor: theme.background }]}>
        <ActivityIndicator color={theme.electricBlue} />
      </View>
    );
  }

  if (!agent) {
    return (
      <View style={[styles.loading, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.textSecondary }}>
          {error ? "Unable to load agent." : "Agent not found."}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Hero agent={agent} />
      <Tabs activeTab={activeTab} onTabChange={handleTabChange} />
      <ScrollView
        ref={pagerRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handlePagerScroll}
        style={styles.pager}
      >
        <View style={[styles.page, { width }]}>
          <Overview agent={agent} />
        </View>
        <View style={[styles.page, { width }]}>
          <Performance agentId={id} />
        </View>
        <View style={[styles.page, { width }]}>
          <Configuration agent={agent} onRebuild={handleRebuild} />
        </View>
        <View style={[styles.page, { width }]}>
          <Subscription agent={agent} />
        </View>
      </ScrollView>
      <ActionBar
        agent={agent}
        onActivate={handleActivate}
        onPause={() => router.push(`/(bot-detail)/${id}/pause` as any)}
        onDelete={() => setDeleteDialogVisible(true)}
        onEditIdentity={() => setEditSheetVisible(true)}
        onRebuild={handleRebuild}
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
  pager: { flex: 1 },
  page: { flex: 1 },
});
