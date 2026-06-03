import { ReactivationBottomSheet } from "@/components/subscriptions/ReactivationBottomSheet";
import { SubscriptionStatusBanner } from "@/components/subscriptions/SubscriptionStatusBanner";
import { Colors } from "@/constants/theme";
import { AgentCard } from "@/features/feed/components/AgentCard";
import { CreateAgentFab } from "@/features/feed/components/CreateAgentFab";
import { EmptyAgentList } from "@/features/feed/components/EmptyAgentList";
import {
  BotsDocument,
  BotStatus,
  MeSubscriptionDocument,
  SubscriptionStatus,
} from "@/generated/graphql";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useQuery } from "@apollo/client/react";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";

export default function FeedScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];
  const [refreshing, setRefreshing] = useState(false);
  const [reactivationVisible, setReactivationVisible] = useState(false);

  const {
    data: botsData,
    loading,
    refetch,
  } = useQuery(BotsDocument, {
    fetchPolicy: "cache-and-network",
  });
  const { data: meData } = useQuery(MeSubscriptionDocument);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const subscriptionStatus = meData?.me?.subscriptionStatus;
  const isBlocked =
    subscriptionStatus === SubscriptionStatus.Suspended ||
    subscriptionStatus === SubscriptionStatus.Cancelled;

  const handleCreateAgent = useCallback(() => {
    const tier = meData?.me?.subscriptionTier;

    if (!tier) {
      router.push("/(subscription)/tier-selection");
      return;
    }
    if (isBlocked) {
      setReactivationVisible(true);
      return;
    }
    router.push("/(agent-forge)");
  }, [meData, isBlocked]);

  const bots = (botsData?.bots ?? []).filter(
    (b) => b.status !== BotStatus.Archived,
  );
  const showBanner = isBlocked;

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      {showBanner && (
        <SubscriptionStatusBanner
          status={subscriptionStatus!}
          onReactivate={() => setReactivationVisible(true)}
        />
      )}
      <FlatList
        data={bots}
        keyExtractor={(item) => item.id ?? ""}
        renderItem={({ item }) => (
          <AgentCard
            bot={item}
            onPress={() => {
              if (!item.id) return;
              router.push(`/(agent-detail)/${item.id}`);
            }}
          />
        )}
        ListEmptyComponent={
          !loading ? (
            <EmptyAgentList
              subscriptionTier={meData?.me?.subscriptionTier}
              subscriptionStatus={meData?.me?.subscriptionStatus}
              onCreateAgent={handleCreateAgent}
            />
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            // Keep pull-to-refresh gesture/state, but hide the native spinner
            // so only the centered overlay indicator is visible.
            tintColor="transparent"
            colors={["transparent"]}
            progressBackgroundColor="transparent"
          />
        }
        contentContainerStyle={
          bots.length === 0 ? styles.emptyContainer : styles.listContent
        }
      />
      {refreshing && (
        <View pointerEvents="none" style={styles.refreshOverlay}>
          <ActivityIndicator size="large" color={theme.electricBlue} />
        </View>
      )}
      <CreateAgentFab onPress={handleCreateAgent} />
      {isBlocked && (
        <ReactivationBottomSheet
          visible={reactivationVisible}
          onDismiss={() => setReactivationVisible(false)}
          status={subscriptionStatus!}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 100,
    gap: 12,
  },
  emptyContainer: { flex: 1 },
  refreshOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
});
