import { Colors } from "@/constants/theme";
import { type BotQuery } from "@/generated/graphql";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import AdvancedConfigSection from "../../components/AdvancedConfigSection";
import { Brain } from "./Brain";
import { ExitPersonality } from "./ExitPersonality";
import { Identity } from "./Identity";
import { MarketAwareness } from "./MarketAwareness";
import { Parameters } from "./Parameters";
import { SafetySystems } from "./SafetySystems";

type Agent = NonNullable<BotQuery["bot"]>;

interface Props {
  agent: Agent;
  onRebuild: () => void;
}

export function Configuration({ agent, onRebuild }: Props) {
  const theme = Colors[useColorScheme()];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      {/* 1. Frame & Identity */}
      <Identity frame={agent.frame} name={agent.name} />

      {/* 2. Training Parameters */}
      <Parameters
        riskAttitude={agent.riskAttitude}
        tradeTempo={agent.tradeTempo}
        combatPatience={agent.combatPatience}
        allocationPct={agent.allocationPct}
      />

      {/* 3. Safety Systems */}
      <SafetySystems
        dailyMaxGain={agent.dailyMaxGain}
        dailyMaxLoss={agent.dailyMaxLoss}
        stopStyle={agent.stopStyle}
      />

      {/* 4. Market Awareness */}
      <MarketAwareness
        sectors={agent.sectors}
        marketAwareness={agent.marketAwareness}
      />

      {/* 5. Exit Personality */}
      <ExitPersonality exitStyle={agent.exitStyle} />

      {/* 6. Brain */}
      <Brain agentBrainConfig={agent.botBrainConfig} />

      {/* 7. Advanced Configuration */}
      <AdvancedConfigSection agent={agent} onRebuild={onRebuild} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 12, paddingBottom: 32 },
  section: {
    borderRadius: 12,
    padding: 16,
    gap: 10,
  },
});
