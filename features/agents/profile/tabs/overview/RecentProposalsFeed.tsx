import { type ThemeColors } from "@/constants/theme";
import { type BotQuery, ProposalStatus } from "@/generated/graphql";
import { relativeTime } from "@/utils/relative-time";
import { StyleSheet, Text, View } from "react-native";

type Bot = NonNullable<BotQuery["bot"]>;
type Proposal = NonNullable<Bot["proposals"]>[number];

interface RecentProposalsFeedProps {
  proposals: Proposal[];
  theme: ThemeColors;
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

export const RecentProposalsFeed = ({
  proposals,
  theme,
}: RecentProposalsFeedProps) => {
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
};

const styles = StyleSheet.create({
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
  symbol: {
    fontSize: 18,
    fontWeight: "700",
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
  timestamp: {
    fontSize: 12,
  },
});
