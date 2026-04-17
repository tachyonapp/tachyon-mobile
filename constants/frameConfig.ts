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
  description: string;
  colorway: string;
  bounds: {
    allocationPct: { min: number; max: number };
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
  [BotFrame.Scout]: {
    gamifiedName: "The Scout",
    strategyName: "Momentum Confirmation",
    description:
      "Quick reactions, low risk. Fires on momentum signals. Enters on confirmed momentum — price above key moving averages with increasing volume. Exits when momentum flattens or reversal signals emerge.",
    colorway: "#2C6BED",
    bounds: { allocationPct: { min: 0.05, max: 0.50 } },
    defaults: {
      allocationPct: 0.2,
      dailyMaxLoss: 0.1,
      riskAttitude: RiskAttitude.Balanced,
      tradeTempo: TradeTempo.Active,
      combatPatience: CombatPatience.Calculated,
      exitPersonality: { name: ExitPersonalityName.Balanced },
      stopLossStyle: { name: StopStyleName.Flexible },
      marketAwareness: { momentum: 0.75, meanReversion: 0.15, volatility: 0.45, trendFollowing: 0.75 },
    },
  },
  [BotFrame.Sniper]: {
    gamifiedName: "The Sniper",
    strategyName: "Breakout Trading",
    description:
      "Selective, precision trades. Waits for the perfect setup. Enters on a clean breakout above a defined resistance level with volume confirmation. Holds until price target is reached or a hard stop triggers. Low trade frequency, high selectivity.",
    colorway: "#E8F4FF",
    bounds: { allocationPct: { min: 0.05, max: 0.60 } },
    defaults: {
      allocationPct: 0.2,
      dailyMaxLoss: 0.1,
      riskAttitude: RiskAttitude.Balanced,
      tradeTempo: TradeTempo.Opportunistic,
      combatPatience: CombatPatience.Patient,
      exitPersonality: { name: ExitPersonalityName.Patient },
      stopLossStyle: { name: StopStyleName.Hard },
      marketAwareness: { momentum: 0.55, meanReversion: 0.1, volatility: 0.35, trendFollowing: 0.65 },
    },
  },
  [BotFrame.Guardian]: {
    gamifiedName: "The Guardian",
    strategyName: "Mean Reversion",
    description:
      "Defensive, capital-preserving. Low risk, mean reversion focus. Buys oversold conditions when price reverts toward its statistical mean after an extended deviation. Exits near mean or when reversion stalls. Avoids trending markets; sized conservatively.",
    colorway: "#1C9C61",
    bounds: { allocationPct: { min: 0.03, max: 0.40 } },
    defaults: {
      allocationPct: 0.15,
      dailyMaxLoss: 0.05,
      riskAttitude: RiskAttitude.Cautious,
      tradeTempo: TradeTempo.Opportunistic,
      combatPatience: CombatPatience.Patient,
      exitPersonality: { name: ExitPersonalityName.Balanced },
      stopLossStyle: { name: StopStyleName.Flexible },
      marketAwareness: { momentum: 0.15, meanReversion: 0.8, volatility: 0.2, trendFollowing: 0.2 },
    },
  },
  [BotFrame.Bruiser]: {
    gamifiedName: "The Bruiser",
    strategyName: "Trend Following",
    description:
      "Slower, higher conviction. Rides trends for maximum capture. Enters established uptrends on pullbacks to support, targeting continuation of the primary trend. Holds through minor noise; exits on trend structure break.",
    colorway: "#F2B705",
    bounds: { allocationPct: { min: 0.10, max: 0.70 } },
    defaults: {
      allocationPct: 0.25,
      dailyMaxLoss: 0.12,
      riskAttitude: RiskAttitude.Balanced,
      tradeTempo: TradeTempo.Active,
      combatPatience: CombatPatience.Strategic,
      exitPersonality: { name: ExitPersonalityName.Patient },
      stopLossStyle: { name: StopStyleName.Flexible },
      marketAwareness: { momentum: 0.45, meanReversion: 0.1, volatility: 0.25, trendFollowing: 0.8 },
    },
  },
  [BotFrame.Berserker]: {
    gamifiedName: "The Berserker",
    strategyName: "Volatility Trading",
    description:
      "Aggressive, high volatility. High risk, fast in and out. Targets high-volatility conditions — wide ATR, elevated IV, or momentum surges. Enters on breakouts or volume spikes; exits fast when volatility compresses. Adaptive stops accommodate wide intraday swings.",
    colorway: "#D64545",
    bounds: { allocationPct: { min: 0.05, max: 0.40 } },
    defaults: {
      allocationPct: 0.15,
      dailyMaxLoss: 0.15,
      riskAttitude: RiskAttitude.Aggressive,
      tradeTempo: TradeTempo.Relentless,
      combatPatience: CombatPatience.Impulsive,
      exitPersonality: { name: ExitPersonalityName.QuickFinisher },
      stopLossStyle: { name: StopStyleName.Adaptive },
      marketAwareness: { momentum: 0.7, meanReversion: 0.1, volatility: 0.85, trendFollowing: 0.5 },
    },
  },
  [BotFrame.Brawler]: {
    gamifiedName: "The Brawler",
    strategyName: "Swing Trading",
    description:
      "Enters early, balanced risk. Medium-duration swing trades. Targets early-stage swing setups — bullish structure at support with neutral-to-improving momentum. Holds for multi-day price expansion toward resistance.",
    colorway: "#8B7CFF",
    bounds: { allocationPct: { min: 0.05, max: 0.55 } },
    defaults: {
      allocationPct: 0.2,
      dailyMaxLoss: 0.1,
      riskAttitude: RiskAttitude.Balanced,
      tradeTempo: TradeTempo.Active,
      combatPatience: CombatPatience.Calculated,
      exitPersonality: { name: ExitPersonalityName.Balanced },
      stopLossStyle: { name: StopStyleName.Flexible },
      marketAwareness: { momentum: 0.5, meanReversion: 0.3, volatility: 0.45, trendFollowing: 0.5 },
    },
  },
};
