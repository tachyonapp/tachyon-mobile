import { Colors } from "@/constants/theme";
import { BotStatus, type BotQuery } from "@/generated/graphql";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { OpenPositionSummary } from "./OpenPositionSummary";
import { RecentProposalsFeed } from "./RecentProposalsFeed";
import { StoodDownBanner } from "./StoodDownBanner";

type Agent = NonNullable<BotQuery["bot"]>;

interface OverviewProps {
  agent: Agent;
}

function getEmptyMessage(status: BotStatus | null | undefined): string {
  switch (status) {
    case BotStatus.Draft:
      return "Activate your agent to start receiving trade proposals.";
    case BotStatus.Active:
      return "Your agent is scanning the market. Proposals will appear here.";
    case BotStatus.Paused:
      return "Your agent is paused. Activate it to resume scanning.";
    default:
      return "No activity yet.";
  }
}

export function Overview({ agent }: OverviewProps) {
  const theme = Colors[useColorScheme()];
  const proposals = agent.proposals ?? [];
  const hasPosition = agent.activePosition != null;
  const hasProposals = proposals.length > 0;
  const isStoodDown = agent.status === BotStatus.StoodDown;
  const isEmpty = !hasPosition && !hasProposals && !isStoodDown;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={[styles.content, isEmpty && styles.emptyContent]}
    >
      <StoodDownBanner
        status={agent.status}
        standdownReason={null}
        recoveryModeApplied={agent.recoveryModeApplied}
        recoveryModeActiveUntil={agent.recoveryModeActiveUntil}
      />
      {hasPosition && (
        <OpenPositionSummary position={agent.activePosition!} theme={theme} />
      )}
      {hasProposals && (
        <RecentProposalsFeed proposals={proposals} theme={theme} />
      )}
      {isEmpty && (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            {getEmptyMessage(agent.status)}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 12 },
  emptyContent: { flex: 1 },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
});
