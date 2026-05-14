// TODO: This file is duplicated in tachyon-api/src/config/frameConfig.ts.
// Extract to a shared @tachyon/frame-config package when the project warrants it.
import {
  BotFrame,
  CombatPatience,
  ExitPersonalityName,
  RiskAttitude,
  StopStyleName,
  TradeTempo,
  type ExitPersonalityInput,
  type MarketAwarenessInput,
  type StopLossStyleInput,
} from "@/generated/graphql";

export interface FrameConfig {
  gamifiedName: string;
  strategyName: string;
  shortDescription: string;
  description: string;
  colorway: string;
  bounds: {
    riskAttitude: RiskAttitude[];
    tradeTempo: TradeTempo[];
    combatPatience: CombatPatience[];
    allocationPct: { min: number; max: number };
    dailyMaxLoss: { minPct: number; maxPct: number };
    marketAwareness: {
      momentum: { min: number; max: number };
      meanReversion: { min: number; max: number };
      volatility: { min: number; max: number };
      trendFollowing: { min: number; max: number };
    };
  };
  defaults: {
    allocationPct: number;
    dailyMaxLoss: number;
    riskAttitude: RiskAttitude;
    tradeTempo: TradeTempo;
    combatPatience: CombatPatience;
    exitPersonality: ExitPersonalityInput;
    stopLossStyle: StopLossStyleInput;
    marketAwareness: MarketAwarenessInput;
  };
}

export const FRAME_CONFIG: Record<BotFrame, FrameConfig> = {
  [BotFrame.SCOUT]: {
    gamifiedName: "Scout",
    strategyName: "Momentum Confirmation",
    shortDescription: "Quick reactions, low risk. Fires on momentum signals.",
    description:
      "Quick reactions, low risk. Fires on momentum signals. Enters on confirmed momentum — price above key moving averages with increasing volume. Exits when momentum flattens or reversal signals emerge.",
    colorway: "#2C6BED",
    bounds: {
      riskAttitude: [
        RiskAttitude.CAUTIOUS,
        RiskAttitude.BALANCED,
        RiskAttitude.AGGRESSIVE,
      ],
      tradeTempo: [
        TradeTempo.OPPORTUNISTIC,
        TradeTempo.ACTIVE,
        TradeTempo.RELENTLESS,
      ],
      combatPatience: [
        CombatPatience.IMPULSIVE,
        CombatPatience.CALCULATED,
        CombatPatience.PATIENT,
      ],
      allocationPct: { min: 0.05, max: 0.5 },
      dailyMaxLoss: { minPct: 0.04, maxPct: 0.15 },
      marketAwareness: {
        momentum: { min: 0.5, max: 1.0 },
        meanReversion: { min: 0.0, max: 0.3 },
        volatility: { min: 0.2, max: 0.7 },
        trendFollowing: { min: 0.5, max: 1.0 },
      },
    },
    defaults: {
      allocationPct: 0.2,
      dailyMaxLoss: 0.1,
      riskAttitude: RiskAttitude.BALANCED,
      tradeTempo: TradeTempo.ACTIVE,
      combatPatience: CombatPatience.CALCULATED,
      exitPersonality: { name: ExitPersonalityName.Balanced },
      stopLossStyle: { name: StopStyleName.Flexible },
      marketAwareness: {
        momentum: 0.75,
        meanReversion: 0.15,
        volatility: 0.45,
        trendFollowing: 0.75,
      },
    },
  },
  [BotFrame.SNIPER]: {
    gamifiedName: "Sniper",
    strategyName: "Breakout Trading",
    shortDescription:
      "Selective, precision trades. Waits for the perfect setup.",
    description:
      "Selective, precision trades. Waits for the perfect setup. Enters on a clean breakout above a defined resistance level with volume confirmation. Holds until price target is reached or a hard stop triggers. Low trade frequency, high selectivity.",
    colorway: "#E8F4FF",
    bounds: {
      riskAttitude: [
        RiskAttitude.CAUTIOUS,
        RiskAttitude.BALANCED,
        RiskAttitude.AGGRESSIVE,
      ],
      tradeTempo: [TradeTempo.OPPORTUNISTIC, TradeTempo.ACTIVE],
      combatPatience: [
        CombatPatience.CALCULATED,
        CombatPatience.PATIENT,
        CombatPatience.STRATEGIC,
      ],
      allocationPct: { min: 0.05, max: 0.6 },
      dailyMaxLoss: { minPct: 0.03, maxPct: 0.15 },
      marketAwareness: {
        momentum: { min: 0.3, max: 0.8 },
        meanReversion: { min: 0.0, max: 0.2 },
        volatility: { min: 0.1, max: 0.6 },
        trendFollowing: { min: 0.4, max: 0.9 },
      },
    },
    defaults: {
      allocationPct: 0.2,
      dailyMaxLoss: 0.1,
      riskAttitude: RiskAttitude.BALANCED,
      tradeTempo: TradeTempo.OPPORTUNISTIC,
      combatPatience: CombatPatience.PATIENT,
      exitPersonality: { name: ExitPersonalityName.Patient },
      stopLossStyle: { name: StopStyleName.Hard },
      marketAwareness: {
        momentum: 0.55,
        meanReversion: 0.1,
        volatility: 0.35,
        trendFollowing: 0.65,
      },
    },
  },
  [BotFrame.GUARDIAN]: {
    gamifiedName: "Guardian",
    strategyName: "Mean Reversion",
    shortDescription:
      "Defensive, capital-preserving. Low risk, mean reversion focus.",
    description:
      "Defensive, capital-preserving. Low risk, mean reversion focus. Buys oversold conditions when price reverts toward its statistical mean after an extended deviation. Exits near mean or when reversion stalls. Avoids trending markets; sized conservatively.",
    colorway: "#1C9C61",
    bounds: {
      riskAttitude: [RiskAttitude.CAUTIOUS, RiskAttitude.BALANCED],
      tradeTempo: [TradeTempo.OPPORTUNISTIC, TradeTempo.ACTIVE],
      combatPatience: [
        CombatPatience.CALCULATED,
        CombatPatience.PATIENT,
        CombatPatience.STRATEGIC,
      ],
      allocationPct: { min: 0.03, max: 0.4 },
      dailyMaxLoss: { minPct: 0.02, maxPct: 0.08 },
      marketAwareness: {
        momentum: { min: 0.0, max: 0.3 },
        meanReversion: { min: 0.6, max: 1.0 },
        volatility: { min: 0.0, max: 0.4 },
        trendFollowing: { min: 0.0, max: 0.4 },
      },
    },
    defaults: {
      allocationPct: 0.15,
      dailyMaxLoss: 0.05,
      riskAttitude: RiskAttitude.CAUTIOUS,
      tradeTempo: TradeTempo.OPPORTUNISTIC,
      combatPatience: CombatPatience.PATIENT,
      exitPersonality: { name: ExitPersonalityName.Balanced },
      stopLossStyle: { name: StopStyleName.Flexible },
      marketAwareness: {
        momentum: 0.15,
        meanReversion: 0.8,
        volatility: 0.2,
        trendFollowing: 0.2,
      },
    },
  },
  [BotFrame.BRUISER]: {
    gamifiedName: "Bruiser",
    strategyName: "Trend Following",
    shortDescription:
      "Slower, higher conviction. Rides trends for maximum capture.",
    description:
      "Slower, higher conviction. Rides trends for maximum capture. Enters established uptrends on pullbacks to support, targeting continuation of the primary trend. Holds through minor noise; exits on trend structure break.",
    colorway: "#F2B705",
    bounds: {
      riskAttitude: [RiskAttitude.BALANCED, RiskAttitude.AGGRESSIVE],
      tradeTempo: [TradeTempo.OPPORTUNISTIC, TradeTempo.ACTIVE],
      combatPatience: [
        CombatPatience.CALCULATED,
        CombatPatience.PATIENT,
        CombatPatience.STRATEGIC,
      ],
      allocationPct: { min: 0.1, max: 0.7 },
      dailyMaxLoss: { minPct: 0.06, maxPct: 0.2 },
      marketAwareness: {
        momentum: { min: 0.2, max: 0.7 },
        meanReversion: { min: 0.0, max: 0.2 },
        volatility: { min: 0.0, max: 0.5 },
        trendFollowing: { min: 0.6, max: 1.0 },
      },
    },
    defaults: {
      allocationPct: 0.25,
      dailyMaxLoss: 0.12,
      riskAttitude: RiskAttitude.BALANCED,
      tradeTempo: TradeTempo.ACTIVE,
      combatPatience: CombatPatience.STRATEGIC,
      exitPersonality: { name: ExitPersonalityName.Patient },
      stopLossStyle: { name: StopStyleName.Flexible },
      marketAwareness: {
        momentum: 0.45,
        meanReversion: 0.1,
        volatility: 0.25,
        trendFollowing: 0.8,
      },
    },
  },
  [BotFrame.BERSERKER]: {
    gamifiedName: "Berserker",
    strategyName: "Volatility Trading",
    shortDescription:
      "Aggressive, high volatility. High risk, fast in and out.",
    description:
      "Aggressive, high volatility. High risk, fast in and out. Targets high-volatility conditions — wide ATR, elevated IV, or momentum surges. Enters on breakouts or volume spikes; exits fast when volatility compresses. Adaptive stops accommodate wide intraday swings.",
    colorway: "#D64545",
    bounds: {
      riskAttitude: [RiskAttitude.BALANCED, RiskAttitude.AGGRESSIVE],
      tradeTempo: [TradeTempo.ACTIVE, TradeTempo.RELENTLESS],
      combatPatience: [CombatPatience.IMPULSIVE, CombatPatience.CALCULATED],
      allocationPct: { min: 0.05, max: 0.4 },
      dailyMaxLoss: { minPct: 0.1, maxPct: 0.25 },
      marketAwareness: {
        momentum: { min: 0.4, max: 1.0 },
        meanReversion: { min: 0.0, max: 0.2 },
        volatility: { min: 0.6, max: 1.0 },
        trendFollowing: { min: 0.2, max: 0.8 },
      },
    },
    defaults: {
      allocationPct: 0.15,
      dailyMaxLoss: 0.15,
      riskAttitude: RiskAttitude.AGGRESSIVE,
      tradeTempo: TradeTempo.RELENTLESS,
      combatPatience: CombatPatience.IMPULSIVE,
      exitPersonality: { name: ExitPersonalityName.QuickFinisher },
      stopLossStyle: { name: StopStyleName.Adaptive },
      marketAwareness: {
        momentum: 0.7,
        meanReversion: 0.1,
        volatility: 0.85,
        trendFollowing: 0.5,
      },
    },
  },
  [BotFrame.BRAWLER]: {
    gamifiedName: "Brawler",
    strategyName: "Swing Trading",
    shortDescription:
      "Enters early, balanced risk. Medium-duration swing trades.",
    description:
      "Enters early, balanced risk. Medium-duration swing trades. Targets early-stage swing setups — bullish structure at support with neutral-to-improving momentum. Holds for multi-day price expansion toward resistance.",
    colorway: "#8B7CFF",
    bounds: {
      riskAttitude: [
        RiskAttitude.CAUTIOUS,
        RiskAttitude.BALANCED,
        RiskAttitude.AGGRESSIVE,
      ],
      tradeTempo: [
        TradeTempo.OPPORTUNISTIC,
        TradeTempo.ACTIVE,
        TradeTempo.RELENTLESS,
      ],
      combatPatience: [
        CombatPatience.IMPULSIVE,
        CombatPatience.CALCULATED,
        CombatPatience.PATIENT,
      ],
      allocationPct: { min: 0.05, max: 0.55 },
      dailyMaxLoss: { minPct: 0.05, maxPct: 0.15 },
      marketAwareness: {
        momentum: { min: 0.2, max: 0.8 },
        meanReversion: { min: 0.1, max: 0.5 },
        volatility: { min: 0.2, max: 0.7 },
        trendFollowing: { min: 0.2, max: 0.8 },
      },
    },
    defaults: {
      allocationPct: 0.2,
      dailyMaxLoss: 0.1,
      riskAttitude: RiskAttitude.BALANCED,
      tradeTempo: TradeTempo.ACTIVE,
      combatPatience: CombatPatience.CALCULATED,
      exitPersonality: { name: ExitPersonalityName.Balanced },
      stopLossStyle: { name: StopStyleName.Flexible },
      marketAwareness: {
        momentum: 0.5,
        meanReversion: 0.3,
        volatility: 0.45,
        trendFollowing: 0.5,
      },
    },
  },
};
