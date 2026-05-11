import { Colors } from "@/constants/theme";
import { BotStatus, type BotQuery } from "@/generated/graphql";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { OpenPositionSummary } from "./OpenPositionSummary";
import { RecentProposalsFeed } from "./RecentProposalsFeed";
import { StoodDownPanel } from "./StoodDownPanel";

type Agent = NonNullable<BotQuery["bot"]>;

interface OverviewProps {
  agent: Agent;
}

export function Overview({ agent }: OverviewProps) {
  const theme = Colors[useColorScheme()];
  const proposals = agent.proposals ?? [];
  const hasPosition = agent.activePosition != null;
  const hasProposals = proposals.length > 0;
  const isStoodDown = agent.status === BotStatus.StoodDown;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      {hasPosition && (
        <OpenPositionSummary position={agent.activePosition!} theme={theme} />
      )}
      {hasProposals && (
        <RecentProposalsFeed proposals={proposals} theme={theme} />
      )}
      {isStoodDown && <StoodDownPanel theme={theme} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 12 },
});
