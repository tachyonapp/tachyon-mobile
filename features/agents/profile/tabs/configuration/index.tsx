import { Colors } from "@/constants/theme";
import { type BotQuery } from "@/generated/graphql";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Brain } from "./Brain";
import { ExitPersonality } from "./ExitPersonality";
import { Identity } from "./Identity";
import { MarketAwareness } from "./MarketAwareness";
import { Parameters } from "./Parameters";
import { SafetySystems } from "./SafetySystems";

type Bot = NonNullable<BotQuery["bot"]>;

interface Props {
  bot: Bot;
}

export function Configuration({ bot }: Props) {
  const theme = Colors[useColorScheme()];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      {/* 1. Frame & Identity */}
      <Identity frame={bot.frame} name={bot.name} />

      {/* 2. Training Parameters */}
      <Parameters
        riskAttitude={bot.riskAttitude}
        tradeTempo={bot.tradeTempo}
        combatPatience={bot.combatPatience}
        allocationPct={bot.allocationPct}
      />

      {/* 3. Safety Systems */}
      <SafetySystems
        dailyMaxGain={bot.dailyMaxGain}
        dailyMaxLoss={bot.dailyMaxLoss}
        stopStyle={bot.stopStyle}
      />

      {/* 4. Market Awareness */}
      <MarketAwareness
        sectors={bot.sectors}
        marketAwareness={bot.marketAwareness}
      />

      {/* 5. Exit Personality */}
      <ExitPersonality exitStyle={bot.exitStyle} />

      {/* 6. Brain */}
      <Brain botBrainConfig={bot.botBrainConfig} />
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
