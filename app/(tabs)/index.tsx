import { FRAME_CONFIG } from "@/constants/frameConfig";
import { Colors } from "@/constants/theme";
import { BotsDocument, BotStatus, type BotsQuery } from "@/generated/graphql";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useQuery } from "@apollo/client/react";
import { router } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Bot = NonNullable<NonNullable<BotsQuery["bots"]>[number]>;

function statusLabel(status: BotStatus | null | undefined): string {
  switch (status) {
    case BotStatus.Active:
      return "Active";
    case BotStatus.Paused:
      return "Paused";
    case BotStatus.Draft:
      return "Draft";
    default:
      return "Unknown";
  }
}

function statusColor(
  status: BotStatus | null | undefined,
  theme: typeof Colors.dark,
) {
  switch (status) {
    case BotStatus.Active:
      return theme.success;
    case BotStatus.Paused:
      return theme.warning;
    default:
      return theme.textDisabled;
  }
}

function BotCard({ bot, theme }: { bot: Bot; theme: typeof Colors.dark }) {
  const frameKey = bot.frame;
  const frameCfg = frameKey ? FRAME_CONFIG[frameKey] : null;

  return (
    <View style={[styles.card, { backgroundColor: theme.surface }]}>
      {frameCfg && (
        <View
          style={[styles.colorwayBar, { backgroundColor: frameCfg.colorway }]}
        />
      )}
      <View style={styles.cardBody}>
        <View style={styles.cardHeader}>
          <Text
            style={[styles.botName, { color: theme.textPrimary }]}
            numberOfLines={1}
          >
            {bot.name ?? "Unnamed Bot"}
          </Text>
          <View
            style={[
              styles.statusPill,
              { borderColor: statusColor(bot.status, theme) },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: statusColor(bot.status, theme) },
              ]}
            >
              {statusLabel(bot.status)}
            </Text>
          </View>
        </View>
        {frameCfg && (
          <Text style={[styles.frameLabel, { color: theme.textSecondary }]}>
            {frameCfg.gamifiedName} · {frameCfg.strategyName}
          </Text>
        )}
        {bot.allocationPct != null && (
          <Text style={[styles.allocationText, { color: theme.textSecondary }]}>
            {Math.round(parseFloat(bot.allocationPct) * 100)}% allocation
          </Text>
        )}
      </View>
    </View>
  );
}

function EmptyState({ theme }: { theme: typeof Colors.dark }) {
  return (
    <View style={styles.emptyState}>
      <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
        No bots yet
      </Text>
      <Text style={[styles.emptyBody, { color: theme.textSecondary }]}>
        Build your first bot to start receiving trade proposals.
      </Text>
    </View>
  );
}

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];

  const { data, loading, error, refetch } = useQuery(BotsDocument, {
    fetchPolicy: "cache-and-network",
  });

  const bots = (data?.bots ?? []).filter(
    (b) => b.status !== BotStatus.Archived,
  );

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
          My Bots
        </Text>
        <Pressable
          style={({ pressed }) => [
            styles.createButton,
            { backgroundColor: theme.electricBlue },
            pressed && styles.createButtonPressed,
          ]}
          onPress={() => router.push("/(bot-wizard)/frame")}
          accessibilityRole="button"
          accessibilityLabel="Create a new bot"
        >
          <Text style={styles.createButtonText}>+ Create Bot</Text>
        </Pressable>
      </View>

      {loading && !data ? (
        <View style={styles.centered}>
          <ActivityIndicator color={theme.electricBlue} />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={[styles.errorText, { color: theme.danger }]}>
            Failed to load bots.
          </Text>
          <Pressable onPress={() => refetch()} style={styles.retryButton}>
            <Text style={[styles.retryText, { color: theme.electricBlue }]}>
              Retry
            </Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={
            bots.length === 0 ? styles.scrollEmpty : styles.scrollContent
          }
          showsVerticalScrollIndicator={false}
        >
          {bots.length === 0 ? (
            <EmptyState theme={theme} />
          ) : (
            bots.map((bot) => <BotCard key={bot.id} bot={bot} theme={theme} />)
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
  },
  createButton: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  createButtonPressed: {
    opacity: 0.8,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  errorText: {
    fontSize: 14,
  },
  retryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  retryText: {
    fontSize: 14,
    fontWeight: "600",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 12,
  },
  scrollEmpty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  emptyState: {
    alignItems: "center",
    gap: 10,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  emptyBody: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  card: {
    borderRadius: 12,
    overflow: "hidden",
    flexDirection: "row",
  },
  colorwayBar: {
    width: 4,
  },
  cardBody: {
    flex: 1,
    padding: 14,
    gap: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  botName: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  statusPill: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  frameLabel: {
    fontSize: 13,
  },
  allocationText: {
    fontSize: 12,
  },
});
