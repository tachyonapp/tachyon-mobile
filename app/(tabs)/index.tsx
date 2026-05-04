import { BotCard } from "@/components/bots/BotCard";
import { CreateBotFAB } from "@/components/bots/CreateBotFAB";
import { EmptyBotListState } from "@/components/bots/EmptyBotListState";
import { ReactivationBottomSheet } from "@/components/subscriptions/ReactivationBottomSheet";
import { SubscriptionStatusBanner } from "@/components/subscriptions/SubscriptionStatusBanner";
import { Colors } from "@/constants/theme";
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
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function BotListScreen() {
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

  const handleCreateBot = useCallback(() => {
    const tier = meData?.me?.subscriptionTier;

    if (!tier) {
      router.push("/(subscription)/tier-selection");
      return;
    }
    if (isBlocked) {
      setReactivationVisible(true);
      return;
    }
    router.push("/(bot-forge)");
  }, [meData, isBlocked]);

  const bots = (botsData?.bots ?? []).filter(
    (b) => b.status !== BotStatus.Archived,
  );
  const showBanner = isBlocked;

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
          My Bots
        </Text>
      </View>
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
          <BotCard
            bot={item}
            onPress={() => router.push(`/(bot-detail)/${item.id}` as any)}
          />
        )}
        ListEmptyComponent={
          !loading ? (
            <EmptyBotListState
              subscriptionTier={meData?.me?.subscriptionTier}
              subscriptionStatus={meData?.me?.subscriptionStatus}
              onCreateBot={handleCreateBot}
            />
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.electricBlue}
          />
        }
        contentContainerStyle={
          bots.length === 0 ? styles.emptyContainer : styles.listContent
        }
      />
      <CreateBotFAB onPress={handleCreateBot} />
      {isBlocked && (
        <ReactivationBottomSheet
          visible={reactivationVisible}
          onDismiss={() => setReactivationVisible(false)}
          status={subscriptionStatus!}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 100,
    gap: 12,
  },
  emptyContainer: { flex: 1 },
});
