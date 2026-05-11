import { Colors } from "@/constants/theme";
import { BotStatus, type BotQuery } from "@/generated/graphql";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { OpenPositionSummary } from "./OpenPositionSummary";
import { RecentProposalsFeed } from "./RecentProposalsFeed";
import { StoodDownPanel } from "./StoodDownPanel";

type Bot = NonNullable<BotQuery["bot"]>;

interface OverviewProps {
  bot: Bot;
}

export function Overview({ bot }: OverviewProps) {
  const theme = Colors[useColorScheme()];
  const proposals = bot.proposals ?? [];
  const hasPosition = bot.activePosition != null;
  const hasProposals = proposals.length > 0;
  const isStoodDown = bot.status === BotStatus.StoodDown;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      {hasPosition && (
        <OpenPositionSummary position={bot.activePosition!} theme={theme} />
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
