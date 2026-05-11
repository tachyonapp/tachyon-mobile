import { Colors } from "@/constants/theme";
import {
  SectorFilter,
  type MarketAwareness as Awareness,
} from "@/generated/graphql";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { formatPct } from "@/utils/format-pct";
import React from "react";
import { Section } from "../../components/Section";
import { StatRow } from "../../components/StatRow";
import { Sector } from "./Sectors";

interface MarketAwarenessProps {
  sectors: SectorFilter[] | null | undefined;
  marketAwareness: Awareness | null | undefined;
}

export const MarketAwareness = ({
  sectors,
  marketAwareness,
}: MarketAwarenessProps) => {
  const theme = Colors[useColorScheme()];
  return (
    <Section title="MARKET AWARENESS" theme={theme}>
      <Sector sectors={sectors} theme={theme} />
      <StatRow
        label="Momentum"
        value={formatPct(marketAwareness?.momentum)}
        theme={theme}
      />
      <StatRow
        label="Mean Reversion"
        value={formatPct(marketAwareness?.meanReversion)}
        theme={theme}
      />
      <StatRow
        label="Volatility"
        value={formatPct(marketAwareness?.volatility)}
        theme={theme}
      />
      <StatRow
        label="Trend Following"
        value={formatPct(marketAwareness?.trendFollowing)}
        theme={theme}
      />
    </Section>
  );
};
