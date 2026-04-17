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

export interface FrameWizardDefaults {
  colorway: string;
  allocationPct: number;
  dailyMaxLoss: number;
  riskAttitude: RiskAttitude;
  tradeTempo: TradeTempo;
  combatPatience: CombatPatience;
  exitPersonality: ExitPersonalityInput;
  stopLossStyle: StopLossStyleInput;
  marketAwareness: MarketAwarenessInput;
}

export const FRAME_DEFAULTS: Record<BotFrame, FrameWizardDefaults> = {
  [BotFrame.Scout]: {
    colorway: "#2C6BED",
    allocationPct: 0.2,
    dailyMaxLoss: 0.1,
    riskAttitude: RiskAttitude.Balanced,
    tradeTempo: TradeTempo.Active,
    combatPatience: CombatPatience.Calculated,
    exitPersonality: { name: ExitPersonalityName.Balanced },
    stopLossStyle: { name: StopStyleName.Flexible },
    marketAwareness: {
      momentum: 0.75,
      meanReversion: 0.15,
      volatility: 0.45,
      trendFollowing: 0.75,
    },
  },
  [BotFrame.Sniper]: {
    colorway: "#E8F4FF",
    allocationPct: 0.2,
    dailyMaxLoss: 0.1,
    riskAttitude: RiskAttitude.Balanced,
    tradeTempo: TradeTempo.Opportunistic,
    combatPatience: CombatPatience.Patient,
    exitPersonality: { name: ExitPersonalityName.Patient },
    stopLossStyle: { name: StopStyleName.Hard },
    marketAwareness: {
      momentum: 0.55,
      meanReversion: 0.1,
      volatility: 0.35,
      trendFollowing: 0.65,
    },
  },
  [BotFrame.Guardian]: {
    colorway: "#1C9C61",
    allocationPct: 0.15,
    dailyMaxLoss: 0.05,
    riskAttitude: RiskAttitude.Cautious,
    tradeTempo: TradeTempo.Opportunistic,
    combatPatience: CombatPatience.Patient,
    exitPersonality: { name: ExitPersonalityName.Balanced },
    stopLossStyle: { name: StopStyleName.Flexible },
    marketAwareness: {
      momentum: 0.15,
      meanReversion: 0.8,
      volatility: 0.2,
      trendFollowing: 0.2,
    },
  },
  [BotFrame.Bruiser]: {
    colorway: "#F2B705",
    allocationPct: 0.25,
    dailyMaxLoss: 0.12,
    riskAttitude: RiskAttitude.Balanced,
    tradeTempo: TradeTempo.Active,
    combatPatience: CombatPatience.Strategic,
    exitPersonality: { name: ExitPersonalityName.Patient },
    stopLossStyle: { name: StopStyleName.Flexible },
    marketAwareness: {
      momentum: 0.45,
      meanReversion: 0.1,
      volatility: 0.25,
      trendFollowing: 0.8,
    },
  },
  [BotFrame.Berserker]: {
    colorway: "#D64545",
    allocationPct: 0.15,
    dailyMaxLoss: 0.15,
    riskAttitude: RiskAttitude.Aggressive,
    tradeTempo: TradeTempo.Relentless,
    combatPatience: CombatPatience.Impulsive,
    exitPersonality: { name: ExitPersonalityName.QuickFinisher },
    stopLossStyle: { name: StopStyleName.Adaptive },
    marketAwareness: {
      momentum: 0.7,
      meanReversion: 0.1,
      volatility: 0.85,
      trendFollowing: 0.5,
    },
  },
  [BotFrame.Brawler]: {
    colorway: "#8B7CFF",
    allocationPct: 0.2,
    dailyMaxLoss: 0.1,
    riskAttitude: RiskAttitude.Balanced,
    tradeTempo: TradeTempo.Active,
    combatPatience: CombatPatience.Calculated,
    exitPersonality: { name: ExitPersonalityName.Balanced },
    stopLossStyle: { name: StopStyleName.Flexible },
    marketAwareness: {
      momentum: 0.5,
      meanReversion: 0.3,
      volatility: 0.45,
      trendFollowing: 0.5,
    },
  },
};
