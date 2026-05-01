import { Colors, type ThemeColors } from "@/constants/theme";
import { BotStatus, ProposalStatus, type BotQuery } from "@/generated/graphql";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

type Bot = NonNullable<BotQuery["bot"]>;
type Position = NonNullable<Bot["activePosition"]>;
type Proposal = NonNullable<Bot["proposals"]>[number];

function relativeTime(date: string | null | undefined): string {
  if (!date) return "";
  const diffMs = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function proposalStatusColor(
  status: ProposalStatus | null | undefined,
  theme: ThemeColors,
): string {
  switch (status) {
    case ProposalStatus.Approved:
      return theme.success;
    case ProposalStatus.Pending:
      return theme.electricBlue;
    case ProposalStatus.Skipped:
      return theme.textSecondary;
    case ProposalStatus.Expired:
      return theme.textDisabled;
    default:
      return theme.textDisabled;
  }
}

function OpenPositionSummary({
  position,
  theme,
}: {
  position: Position;
  theme: ThemeColors;
}) {
  return (
    <View style={[styles.section, { backgroundColor: theme.surface }]}>
      <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
        OPEN POSITION
      </Text>
      <View style={styles.positionRow}>
        <Text style={[styles.symbol, { color: theme.textPrimary }]}>
          {position.symbol}
        </Text>
        <Text style={[styles.positionMeta, { color: theme.textSecondary }]}>
          {position.qty != null ? `${position.qty} shares` : ""}
          {position.avgEntryPrice != null
            ? `  ·  avg $${Number(position.avgEntryPrice).toFixed(2)}`
            : ""}
        </Text>
      </View>
      {position.openedAt && (
        <Text style={[styles.timestamp, { color: theme.textDisabled }]}>
          Opened {relativeTime(position.openedAt)}
        </Text>
      )}
    </View>
  );
}

function ProposalRow({
  proposal,
  theme,
}: {
  proposal: Proposal;
  theme: ThemeColors;
}) {
  const statusColor = proposalStatusColor(proposal.status, theme);
  return (
    <View style={styles.proposalRow}>
      <View style={styles.proposalLeft}>
        <Text style={[styles.symbol, { color: theme.textPrimary }]}>
          {proposal.symbol}
        </Text>
        <Text style={[styles.proposalSide, { color: theme.textSecondary }]}>
          {proposal.side}
        </Text>
      </View>
      <View style={styles.proposalRight}>
        <View style={[styles.statusBadge, { borderColor: statusColor }]}>
          <Text style={[styles.statusBadgeText, { color: statusColor }]}>
            {proposal.status}
          </Text>
        </View>
        <Text style={[styles.timestamp, { color: theme.textDisabled }]}>
          {relativeTime(proposal.createdAt)}
        </Text>
      </View>
    </View>
  );
}

function RecentProposalsFeed({
  proposals,
  theme,
}: {
  proposals: Proposal[];
  theme: ThemeColors;
}) {
  const recent = proposals.slice(0, 10);
  return (
    <View style={[styles.section, { backgroundColor: theme.surface }]}>
      <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
        RECENT PROPOSALS
      </Text>
      {recent.map((p) => (
        <ProposalRow key={p.id} proposal={p} theme={theme} />
      ))}
    </View>
  );
}

function StoodDownPanel({ theme }: { theme: ThemeColors }) {
  return (
    <View style={[styles.section, { backgroundColor: theme.surface }]}>
      <Text style={[styles.stoodDownHeadline, { color: theme.textPrimary }]}>
        Your bot has been stood down
      </Text>
      <Text style={[styles.stoodDownSubtext, { color: theme.textSecondary }]}>
        Reactivates next trading day
      </Text>
      <View
        style={[styles.disabledButton, { backgroundColor: theme.textDisabled }]}
      >
        <Text style={[styles.disabledButtonText, { color: theme.surface }]}>
          Activate — Reactivates next trading day
        </Text>
      </View>
    </View>
  );
}

interface Props {
  bot: Bot;
}

export function OverviewTab({ bot }: Props) {
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
  section: {
    borderRadius: 12,
    padding: 16,
    gap: 10,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  positionRow: {
    gap: 4,
  },
  symbol: {
    fontSize: 18,
    fontWeight: "700",
  },
  positionMeta: {
    fontSize: 13,
  },
  timestamp: {
    fontSize: 12,
  },
  proposalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(160,167,184,0.15)",
  },
  proposalLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  proposalSide: {
    fontSize: 13,
  },
  proposalRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusBadge: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 1,
    paddingHorizontal: 6,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: "600",
  },
  stoodDownHeadline: {
    fontSize: 16,
    fontWeight: "700",
  },
  stoodDownSubtext: {
    fontSize: 13,
  },
  disabledButton: {
    marginTop: 4,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    opacity: 0.5,
  },
  disabledButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
