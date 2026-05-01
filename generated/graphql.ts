/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  DateTime: { input: any; output: any };
  Decimal: { input: any; output: any };
};

/** A user broker connection */
export type Account = {
  __typename?: "Account";
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  id?: Maybe<Scalars["ID"]["output"]>;
  providerName?: Maybe<Scalars["String"]["output"]>;
  status?: Maybe<BrokerConnStatus>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
};

export type ApproveProposalResult = AuthError | NotFoundError | Proposal;

export type AuthError = BaseError & {
  __typename?: "AuthError";
  message?: Maybe<Scalars["String"]["output"]>;
};

/** Computed balance summary for the authenticated user */
export type Balance = {
  __typename?: "Balance";
  cashBalance?: Maybe<Scalars["Decimal"]["output"]>;
  dayPnl?: Maybe<Scalars["Decimal"]["output"]>;
  dayPnlPercent?: Maybe<Scalars["Decimal"]["output"]>;
  investedValue?: Maybe<Scalars["Decimal"]["output"]>;
  totalValue?: Maybe<Scalars["Decimal"]["output"]>;
};

export type BaseError = {
  message?: Maybe<Scalars["String"]["output"]>;
};

/** A user-configured AI trading bot */
export type Bot = {
  __typename?: "Bot";
  activePosition?: Maybe<Position>;
  allocationPct?: Maybe<Scalars["Decimal"]["output"]>;
  botBrainConfig?: Maybe<BotBrainConfig>;
  brain?: Maybe<BotBrainConfig>;
  combatPatience?: Maybe<CombatPatience>;
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  dailyMaxGain?: Maybe<Scalars["Decimal"]["output"]>;
  dailyMaxLoss?: Maybe<Scalars["Decimal"]["output"]>;
  frame?: Maybe<BotFrame>;
  id?: Maybe<Scalars["ID"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  owner?: Maybe<User>;
  proposals?: Maybe<Array<Proposal>>;
  riskAttitude?: Maybe<RiskAttitude>;
  scanCapRemaining?: Maybe<Scalars["Int"]["output"]>;
  scanCapUsed?: Maybe<Scalars["Int"]["output"]>;
  status?: Maybe<BotStatus>;
  tradeTempo?: Maybe<TradeTempo>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
};

/** A user-configured AI trading bot */
export type BotProposalsArgs = {
  status?: InputMaybe<ProposalStatus>;
};

export type BotBrainConfig = {
  __typename?: "BotBrainConfig";
  brainType?: Maybe<Scalars["String"]["output"]>;
  keyPreview?: Maybe<Scalars["String"]["output"]>;
  modelId?: Maybe<Scalars["String"]["output"]>;
  provider?: Maybe<Scalars["String"]["output"]>;
};

export enum BotFrame {
  Berserker = "BERSERKER",
  Brawler = "BRAWLER",
  Bruiser = "BRUISER",
  Guardian = "GUARDIAN",
  Scout = "SCOUT",
  Sniper = "SNIPER",
}

export type BotPerformanceResult = {
  __typename?: "BotPerformanceResult";
  approvalRatePct?: Maybe<Scalars["Decimal"]["output"]>;
  avgGainPerWin?: Maybe<Scalars["Decimal"]["output"]>;
  avgHoldDurationHours?: Maybe<Scalars["Decimal"]["output"]>;
  avgLossPerLoss?: Maybe<Scalars["Decimal"]["output"]>;
  daysActive?: Maybe<Scalars["Int"]["output"]>;
  largestSingleLoss?: Maybe<Scalars["Decimal"]["output"]>;
  largestSingleWin?: Maybe<Scalars["Decimal"]["output"]>;
  lossCount?: Maybe<Scalars["Int"]["output"]>;
  pnlTimeSeries?: Maybe<Array<PnlDataPoint>>;
  profitFactor?: Maybe<Scalars["Decimal"]["output"]>;
  returnOnAllocatedCapitalPct?: Maybe<Scalars["Decimal"]["output"]>;
  skipRatePct?: Maybe<Scalars["Decimal"]["output"]>;
  totalProposalsApproved?: Maybe<Scalars["Int"]["output"]>;
  totalProposalsGenerated?: Maybe<Scalars["Int"]["output"]>;
  totalRealizedPnl?: Maybe<Scalars["Decimal"]["output"]>;
  winCount?: Maybe<Scalars["Int"]["output"]>;
  winRatePct?: Maybe<Scalars["Decimal"]["output"]>;
};

export type BotResult = Bot | NotFoundError | ValidationError;

export enum BotStatus {
  Active = "ACTIVE",
  Archived = "ARCHIVED",
  Draft = "DRAFT",
  Paused = "PAUSED",
  StoodDown = "STOOD_DOWN",
}

export type BotStoodDownError = BaseError & {
  __typename?: "BotStoodDownError";
  message?: Maybe<Scalars["String"]["output"]>;
};

export type BrainCatalog = {
  __typename?: "BrainCatalog";
  byokProviders?: Maybe<Array<BrainProviderOption>>;
  defaultBrain?: Maybe<DefaultBrainInfo>;
};

export type BrainConfigInput = {
  apiKey?: InputMaybe<Scalars["String"]["input"]>;
  brainType: BrainType;
  modelId: Scalars["String"]["input"];
  provider?: InputMaybe<Scalars["String"]["input"]>;
};

export type BrainModelOption = {
  __typename?: "BrainModelOption";
  displayName?: Maybe<Scalars["String"]["output"]>;
  modelId?: Maybe<Scalars["String"]["output"]>;
};

export type BrainProviderOption = {
  __typename?: "BrainProviderOption";
  displayName?: Maybe<Scalars["String"]["output"]>;
  models?: Maybe<Array<BrainModelOption>>;
  provider?: Maybe<Scalars["String"]["output"]>;
};

export enum BrainType {
  Byok = "BYOK",
  TachyonHosted = "TACHYON_HOSTED",
}

export enum BrokerConnStatus {
  Active = "ACTIVE",
  Error = "ERROR",
  Revoked = "REVOKED",
}

export type CancelSubscriptionResult = {
  __typename?: "CancelSubscriptionResult";
  success?: Maybe<Scalars["Boolean"]["output"]>;
};

export enum CombatPatience {
  Calculated = "CALCULATED",
  Impulsive = "IMPULSIVE",
  Patient = "PATIENT",
  Strategic = "STRATEGIC",
}

export type ConnectBrokerResult = Account | ValidationError;

export type CreateBotInput = {
  allocationPct: Scalars["Decimal"]["input"];
  avatarId: Scalars["ID"]["input"];
  brain: BrainConfigInput;
  colorway: Scalars["String"]["input"];
  combatPatience: CombatPatience;
  dailyMaxGain?: InputMaybe<Scalars["Decimal"]["input"]>;
  dailyMaxLossPct: Scalars["Decimal"]["input"];
  emotionalControls: EmotionalControlsInput;
  exitPersonality: ExitPersonalityInput;
  frameName: BotFrame;
  marketAwareness: MarketAwarenessInput;
  name: Scalars["String"]["input"];
  riskAttitude: RiskAttitude;
  rulesOfEngagement: RulesOfEngagementInput;
  sectors: Array<SectorFilter>;
  stopLossStyle: StopLossStyleInput;
  tradeTempo: TradeTempo;
};

export type CreateBotResult = Bot | ValidationError;

export type DefaultBrainInfo = {
  __typename?: "DefaultBrainInfo";
  brainType?: Maybe<Scalars["String"]["output"]>;
  description?: Maybe<Scalars["String"]["output"]>;
  displayName?: Maybe<Scalars["String"]["output"]>;
  modelId?: Maybe<Scalars["String"]["output"]>;
  provider?: Maybe<Scalars["String"]["output"]>;
};

export type DeleteBotResult = {
  __typename?: "DeleteBotResult";
  success?: Maybe<Scalars["Boolean"]["output"]>;
};

export type EmotionalControlsInput = {
  cooldownAfterVolatility: Scalars["Boolean"]["input"];
  freezeAfterLosses?: InputMaybe<Scalars["Int"]["input"]>;
  standDownAfterNoonIfLosing: Scalars["Boolean"]["input"];
};

export type ExitPersonalityInput = {
  name: ExitPersonalityName;
};

export enum ExitPersonalityName {
  Balanced = "BALANCED",
  Patient = "PATIENT",
  QuickFinisher = "QUICK_FINISHER",
}

export type MarketAwarenessInput = {
  meanReversion: Scalars["Float"]["input"];
  momentum: Scalars["Float"]["input"];
  trendFollowing: Scalars["Float"]["input"];
  volatility: Scalars["Float"]["input"];
};

export type Mutation = {
  __typename?: "Mutation";
  activateBot?: Maybe<BotResult>;
  approveProposal?: Maybe<ApproveProposalResult>;
  cancelSubscription?: Maybe<CancelSubscriptionResult>;
  /** Mark the authenticated user's FTUE as complete. Idempotent. */
  completeOnboarding?: Maybe<Scalars["Boolean"]["output"]>;
  connectBroker?: Maybe<ConnectBrokerResult>;
  createBot?: Maybe<CreateBotResult>;
  deleteBot?: Maybe<DeleteBotResult>;
  pauseBot?: Maybe<BotResult>;
  selectTier?: Maybe<SelectTierResult>;
  skipProposal?: Maybe<SkipProposalResult>;
  updateBotIdentity?: Maybe<UpdateBotIdentityResult>;
  validateBrainKey?: Maybe<ValidateBrainKeyResult>;
};

export type MutationActivateBotArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationApproveProposalArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationConnectBrokerArgs = {
  brokerName: Scalars["String"]["input"];
  credentials: Scalars["String"]["input"];
};

export type MutationCreateBotArgs = {
  input: CreateBotInput;
};

export type MutationDeleteBotArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationPauseBotArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationSelectTierArgs = {
  stripePaymentMethodId?: InputMaybe<Scalars["String"]["input"]>;
  tier: SubscriptionTier;
};

export type MutationSkipProposalArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationUpdateBotIdentityArgs = {
  id: Scalars["ID"]["input"];
  input: UpdateBotIdentityInput;
};

export type MutationValidateBrainKeyArgs = {
  apiKey: Scalars["String"]["input"];
  provider: Scalars["String"]["input"];
};

export type NotFoundError = BaseError & {
  __typename?: "NotFoundError";
  message?: Maybe<Scalars["String"]["output"]>;
};

export enum OrderEntryType {
  Limit = "LIMIT",
  Market = "MARKET",
}

export type PnlDataPoint = {
  __typename?: "PnlDataPoint";
  cumulativePnl?: Maybe<Scalars["Decimal"]["output"]>;
  date?: Maybe<Scalars["DateTime"]["output"]>;
};

/** An open or closed trading position held by a bot */
export type Position = {
  __typename?: "Position";
  avgEntryPrice?: Maybe<Scalars["Decimal"]["output"]>;
  bot?: Maybe<Bot>;
  closedAt?: Maybe<Scalars["DateTime"]["output"]>;
  id?: Maybe<Scalars["ID"]["output"]>;
  minHoldUntil?: Maybe<Scalars["DateTime"]["output"]>;
  openedAt?: Maybe<Scalars["DateTime"]["output"]>;
  qty?: Maybe<Scalars["Decimal"]["output"]>;
  status?: Maybe<PositionStatus>;
  symbol?: Maybe<Scalars["String"]["output"]>;
};

export enum PositionStatus {
  Closed = "CLOSED",
  Open = "OPEN",
}

/** A trade proposal generated by a bot, pending user approval */
export type Proposal = {
  __typename?: "Proposal";
  bot?: Maybe<Bot>;
  confidence?: Maybe<Scalars["Decimal"]["output"]>;
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  entryType?: Maybe<OrderEntryType>;
  expiresAt?: Maybe<Scalars["DateTime"]["output"]>;
  id?: Maybe<Scalars["ID"]["output"]>;
  limitPrice?: Maybe<Scalars["Decimal"]["output"]>;
  minHoldUntil?: Maybe<Scalars["DateTime"]["output"]>;
  qty?: Maybe<Scalars["Decimal"]["output"]>;
  rationaleText?: Maybe<Scalars["String"]["output"]>;
  side?: Maybe<ProposalSide>;
  status?: Maybe<ProposalStatus>;
  stopPrice?: Maybe<Scalars["Decimal"]["output"]>;
  symbol?: Maybe<Scalars["String"]["output"]>;
  targetPrice?: Maybe<Scalars["Decimal"]["output"]>;
};

export enum ProposalSide {
  Buy = "BUY",
  Sell = "SELL",
}

export enum ProposalStatus {
  Approved = "APPROVED",
  Cancelled = "CANCELLED",
  Expired = "EXPIRED",
  Pending = "PENDING",
  Skipped = "SKIPPED",
}

export type Query = {
  __typename?: "Query";
  account?: Maybe<Account>;
  balance?: Maybe<Balance>;
  bot?: Maybe<Bot>;
  botPerformance?: Maybe<BotPerformanceResult>;
  bots?: Maybe<Array<Bot>>;
  brainProviders?: Maybe<BrainCatalog>;
  me?: Maybe<User>;
  positions?: Maybe<Array<Position>>;
  proposals?: Maybe<Array<Proposal>>;
};

export type QueryBotArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryBotPerformanceArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryProposalsArgs = {
  status?: InputMaybe<ProposalStatus>;
};

export enum RiskAttitude {
  Aggressive = "AGGRESSIVE",
  Balanced = "BALANCED",
  Cautious = "CAUTIOUS",
}

export type RulesOfEngagementInput = {
  noSameDayExitUnlessStopLoss: Scalars["Boolean"]["input"];
  overnightHoldAllowed: Scalars["Boolean"]["input"];
};

export enum SectorFilter {
  Any = "ANY",
  Energy = "ENERGY",
  EtfsOnly = "ETFS_ONLY",
  Financials = "FINANCIALS",
  Healthcare = "HEALTHCARE",
  LiquidLargeCaps = "LIQUID_LARGE_CAPS",
  MegaCapsOnly = "MEGA_CAPS_ONLY",
  Tech = "TECH",
}

export type SelectTierResult = {
  __typename?: "SelectTierResult";
  subscriptionStatus?: Maybe<SubscriptionStatus>;
  subscriptionTier?: Maybe<SubscriptionTier>;
  trialExpiresAt?: Maybe<Scalars["DateTime"]["output"]>;
};

export type SkipProposalResult = AuthError | NotFoundError | Proposal;

export type StopLossStyleInput = {
  name: StopStyleName;
};

export enum StopStyleName {
  Adaptive = "ADAPTIVE",
  Flexible = "FLEXIBLE",
  Hard = "HARD",
}

export type Subscription = {
  __typename?: "Subscription";
  orderUpdated?: Maybe<Position>;
  proposalCreated?: Maybe<Proposal>;
};

export type SubscriptionOrderUpdatedArgs = {
  botId: Scalars["ID"]["input"];
};

export type SubscriptionProposalCreatedArgs = {
  botId: Scalars["ID"]["input"];
};

export enum SubscriptionStatus {
  Active = "active",
  Cancelled = "cancelled",
  PastDue = "past_due",
  Suspended = "suspended",
  Trialing = "trialing",
}

export enum SubscriptionTier {
  Byok = "BYOK",
  FreeTrial = "FREE_TRIAL",
  TachyonHosted = "TACHYON_HOSTED",
}

export enum TradeTempo {
  Active = "ACTIVE",
  Opportunistic = "OPPORTUNISTIC",
  Relentless = "RELENTLESS",
}

export type UpdateBotIdentityInput = {
  avatarId: Scalars["ID"]["input"];
  name: Scalars["String"]["input"];
};

export type UpdateBotIdentityResult = {
  __typename?: "UpdateBotIdentityResult";
  bot?: Maybe<Bot>;
};

/** An authenticated Tachyon user */
export type User = {
  __typename?: "User";
  auth0Id?: Maybe<Scalars["String"]["output"]>;
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  currentPeriodEnd?: Maybe<Scalars["DateTime"]["output"]>;
  email?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["ID"]["output"]>;
  /** Whether the user has completed the FTUE onboarding flow. */
  onboardingCompleted: Scalars["Boolean"]["output"];
  subscriptionStatus?: Maybe<SubscriptionStatus>;
  subscriptionTier?: Maybe<SubscriptionTier>;
  trialExpiresAt?: Maybe<Scalars["DateTime"]["output"]>;
};

export type ValidateBrainKeyResult = {
  __typename?: "ValidateBrainKeyResult";
  error?: Maybe<Scalars["String"]["output"]>;
  valid?: Maybe<Scalars["Boolean"]["output"]>;
};

export type ValidationError = BaseError & {
  __typename?: "ValidationError";
  code?: Maybe<Scalars["String"]["output"]>;
  field?: Maybe<Scalars["String"]["output"]>;
  message?: Maybe<Scalars["String"]["output"]>;
};

export type ActivateBotMutationVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type ActivateBotMutation = {
  __typename?: "Mutation";
  activateBot?:
    | { __typename?: "Bot"; id?: string | null; status?: BotStatus | null }
    | { __typename?: "NotFoundError"; message?: string | null }
    | { __typename?: "ValidationError" }
    | null;
};

export type ApproveProposalMutationVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type ApproveProposalMutation = {
  __typename?: "Mutation";
  approveProposal?:
    | { __typename?: "AuthError"; message?: string | null }
    | { __typename?: "NotFoundError"; message?: string | null }
    | {
        __typename?: "Proposal";
        id?: string | null;
        status?: ProposalStatus | null;
      }
    | null;
};

export type CancelSubscriptionMutationVariables = Exact<{
  [key: string]: never;
}>;

export type CancelSubscriptionMutation = {
  __typename?: "Mutation";
  cancelSubscription?: {
    __typename?: "CancelSubscriptionResult";
    success?: boolean | null;
  } | null;
};

export type CompleteOnboardingMutationVariables = Exact<{
  [key: string]: never;
}>;

export type CompleteOnboardingMutation = {
  __typename?: "Mutation";
  completeOnboarding?: boolean | null;
};

export type ConnectBrokerMutationVariables = Exact<{
  brokerName: Scalars["String"]["input"];
  credentials: Scalars["String"]["input"];
}>;

export type ConnectBrokerMutation = {
  __typename?: "Mutation";
  connectBroker?:
    | {
        __typename?: "Account";
        id?: string | null;
        status?: BrokerConnStatus | null;
        providerName?: string | null;
      }
    | {
        __typename?: "ValidationError";
        message?: string | null;
        field?: string | null;
        code?: string | null;
      }
    | null;
};

export type CreateBotMutationVariables = Exact<{
  input: CreateBotInput;
}>;

export type CreateBotMutation = {
  __typename?: "Mutation";
  createBot?:
    | {
        __typename?: "Bot";
        id?: string | null;
        name?: string | null;
        frame?: BotFrame | null;
        status?: BotStatus | null;
        allocationPct?: any | null;
      }
    | {
        __typename?: "ValidationError";
        message?: string | null;
        field?: string | null;
        code?: string | null;
      }
    | null;
};

export type DeleteBotMutationVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type DeleteBotMutation = {
  __typename?: "Mutation";
  deleteBot?: {
    __typename?: "DeleteBotResult";
    success?: boolean | null;
  } | null;
};

export type PauseBotMutationVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type PauseBotMutation = {
  __typename?: "Mutation";
  pauseBot?:
    | { __typename?: "Bot"; id?: string | null; status?: BotStatus | null }
    | { __typename?: "NotFoundError"; message?: string | null }
    | { __typename?: "ValidationError" }
    | null;
};

export type SelectTierMutationVariables = Exact<{
  tier: SubscriptionTier;
  stripePaymentMethodId?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type SelectTierMutation = {
  __typename?: "Mutation";
  selectTier?: {
    __typename?: "SelectTierResult";
    subscriptionTier?: SubscriptionTier | null;
    subscriptionStatus?: SubscriptionStatus | null;
    trialExpiresAt?: any | null;
  } | null;
};

export type SkipProposalMutationVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type SkipProposalMutation = {
  __typename?: "Mutation";
  skipProposal?:
    | { __typename?: "AuthError"; message?: string | null }
    | { __typename?: "NotFoundError"; message?: string | null }
    | {
        __typename?: "Proposal";
        id?: string | null;
        status?: ProposalStatus | null;
      }
    | null;
};

export type UpdateBotIdentityMutationVariables = Exact<{
  id: Scalars["ID"]["input"];
  input: UpdateBotIdentityInput;
}>;

export type UpdateBotIdentityMutation = {
  __typename?: "Mutation";
  updateBotIdentity?: {
    __typename?: "UpdateBotIdentityResult";
    bot?: {
      __typename?: "Bot";
      id?: string | null;
      name?: string | null;
    } | null;
  } | null;
};

export type ValidateBrainKeyMutationVariables = Exact<{
  provider: Scalars["String"]["input"];
  apiKey: Scalars["String"]["input"];
}>;

export type ValidateBrainKeyMutation = {
  __typename?: "Mutation";
  validateBrainKey?: {
    __typename?: "ValidateBrainKeyResult";
    valid?: boolean | null;
    error?: string | null;
  } | null;
};

export type AccountQueryVariables = Exact<{ [key: string]: never }>;

export type AccountQuery = {
  __typename?: "Query";
  account?: {
    __typename?: "Account";
    id?: string | null;
    status?: BrokerConnStatus | null;
    providerName?: string | null;
  } | null;
};

export type BalanceQueryVariables = Exact<{ [key: string]: never }>;

export type BalanceQuery = {
  __typename?: "Query";
  balance?: {
    __typename?: "Balance";
    totalValue?: any | null;
    cashBalance?: any | null;
    investedValue?: any | null;
    dayPnl?: any | null;
    dayPnlPercent?: any | null;
  } | null;
};

export type BotQueryVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type BotQuery = {
  __typename?: "Query";
  bot?: {
    __typename?: "Bot";
    id?: string | null;
    name?: string | null;
    frame?: BotFrame | null;
    status?: BotStatus | null;
    allocationPct?: any | null;
    dailyMaxLoss?: any | null;
    dailyMaxGain?: any | null;
    riskAttitude?: RiskAttitude | null;
    tradeTempo?: TradeTempo | null;
    combatPatience?: CombatPatience | null;
    createdAt?: any | null;
    updatedAt?: any | null;
    activePosition?: {
      __typename?: "Position";
      id?: string | null;
      symbol?: string | null;
      qty?: any | null;
      avgEntryPrice?: any | null;
      status?: PositionStatus | null;
      openedAt?: any | null;
    } | null;
    proposals?: Array<{
      __typename?: "Proposal";
      id?: string | null;
      symbol?: string | null;
      side?: ProposalSide | null;
      qty?: any | null;
      limitPrice?: any | null;
      rationaleText?: string | null;
      status?: ProposalStatus | null;
      expiresAt?: any | null;
      createdAt?: any | null;
    }> | null;
    botBrainConfig?: {
      __typename?: "BotBrainConfig";
      brainType?: string | null;
      modelId?: string | null;
      provider?: string | null;
    } | null;
  } | null;
};

export type BotPerformanceQueryVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type BotPerformanceQuery = {
  __typename?: "Query";
  botPerformance?: {
    __typename?: "BotPerformanceResult";
    totalRealizedPnl?: any | null;
    returnOnAllocatedCapitalPct?: any | null;
    winCount?: number | null;
    lossCount?: number | null;
    winRatePct?: any | null;
    avgGainPerWin?: any | null;
    avgLossPerLoss?: any | null;
    profitFactor?: any | null;
    largestSingleWin?: any | null;
    largestSingleLoss?: any | null;
    avgHoldDurationHours?: any | null;
    daysActive?: number | null;
    totalProposalsGenerated?: number | null;
    totalProposalsApproved?: number | null;
    approvalRatePct?: any | null;
    skipRatePct?: any | null;
    pnlTimeSeries?: Array<{
      __typename?: "PnlDataPoint";
      date?: any | null;
      cumulativePnl?: any | null;
    }> | null;
  } | null;
};

export type BotsQueryVariables = Exact<{ [key: string]: never }>;

export type BotsQuery = {
  __typename?: "Query";
  bots?: Array<{
    __typename?: "Bot";
    id?: string | null;
    name?: string | null;
    frame?: BotFrame | null;
    status?: BotStatus | null;
    allocationPct?: any | null;
    dailyMaxLoss?: any | null;
    dailyMaxGain?: any | null;
    riskAttitude?: RiskAttitude | null;
    tradeTempo?: TradeTempo | null;
    combatPatience?: CombatPatience | null;
    createdAt?: any | null;
    updatedAt?: any | null;
  }> | null;
};

export type MeQueryVariables = Exact<{ [key: string]: never }>;

export type MeQuery = {
  __typename?: "Query";
  me?: {
    __typename?: "User";
    id?: string | null;
    email?: string | null;
    auth0Id?: string | null;
    createdAt?: any | null;
    onboardingCompleted: boolean;
  } | null;
};

export type MeSubscriptionQueryVariables = Exact<{ [key: string]: never }>;

export type MeSubscriptionQuery = {
  __typename?: "Query";
  me?: {
    __typename?: "User";
    id?: string | null;
    subscriptionTier?: SubscriptionTier | null;
    subscriptionStatus?: SubscriptionStatus | null;
    trialExpiresAt?: any | null;
    currentPeriodEnd?: any | null;
  } | null;
};

export type PositionsQueryVariables = Exact<{ [key: string]: never }>;

export type PositionsQuery = {
  __typename?: "Query";
  positions?: Array<{
    __typename?: "Position";
    id?: string | null;
    symbol?: string | null;
    qty?: any | null;
    avgEntryPrice?: any | null;
    status?: PositionStatus | null;
    openedAt?: any | null;
    closedAt?: any | null;
    bot?: {
      __typename?: "Bot";
      id?: string | null;
      name?: string | null;
    } | null;
  }> | null;
};

export type ProposalsQueryVariables = Exact<{
  status?: InputMaybe<ProposalStatus>;
}>;

export type ProposalsQuery = {
  __typename?: "Query";
  proposals?: Array<{
    __typename?: "Proposal";
    id?: string | null;
    symbol?: string | null;
    side?: ProposalSide | null;
    qty?: any | null;
    limitPrice?: any | null;
    rationaleText?: string | null;
    status?: ProposalStatus | null;
    expiresAt?: any | null;
    createdAt?: any | null;
    bot?: {
      __typename?: "Bot";
      id?: string | null;
      name?: string | null;
    } | null;
  }> | null;
};

export const ActivateBotDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "ActivateBot" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "activateBot" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "InlineFragment",
                  typeCondition: {
                    kind: "NamedType",
                    name: { kind: "Name", value: "Bot" },
                  },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "status" },
                      },
                    ],
                  },
                },
                {
                  kind: "InlineFragment",
                  typeCondition: {
                    kind: "NamedType",
                    name: { kind: "Name", value: "NotFoundError" },
                  },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "message" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ActivateBotMutation, ActivateBotMutationVariables>;
export const ApproveProposalDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "ApproveProposal" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "approveProposal" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "InlineFragment",
                  typeCondition: {
                    kind: "NamedType",
                    name: { kind: "Name", value: "Proposal" },
                  },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "status" },
                      },
                    ],
                  },
                },
                {
                  kind: "InlineFragment",
                  typeCondition: {
                    kind: "NamedType",
                    name: { kind: "Name", value: "NotFoundError" },
                  },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "message" },
                      },
                    ],
                  },
                },
                {
                  kind: "InlineFragment",
                  typeCondition: {
                    kind: "NamedType",
                    name: { kind: "Name", value: "AuthError" },
                  },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "message" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ApproveProposalMutation,
  ApproveProposalMutationVariables
>;
export const CancelSubscriptionDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "CancelSubscription" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "cancelSubscription" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "success" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CancelSubscriptionMutation,
  CancelSubscriptionMutationVariables
>;
export const CompleteOnboardingDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "CompleteOnboarding" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "completeOnboarding" },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CompleteOnboardingMutation,
  CompleteOnboardingMutationVariables
>;
export const ConnectBrokerDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "ConnectBroker" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "brokerName" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "credentials" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "connectBroker" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "brokerName" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "brokerName" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "credentials" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "credentials" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "InlineFragment",
                  typeCondition: {
                    kind: "NamedType",
                    name: { kind: "Name", value: "Account" },
                  },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "status" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "providerName" },
                      },
                    ],
                  },
                },
                {
                  kind: "InlineFragment",
                  typeCondition: {
                    kind: "NamedType",
                    name: { kind: "Name", value: "ValidationError" },
                  },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "message" },
                      },
                      { kind: "Field", name: { kind: "Name", value: "field" } },
                      { kind: "Field", name: { kind: "Name", value: "code" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ConnectBrokerMutation,
  ConnectBrokerMutationVariables
>;
export const CreateBotDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "CreateBot" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "input" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "CreateBotInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "createBot" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "input" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "InlineFragment",
                  typeCondition: {
                    kind: "NamedType",
                    name: { kind: "Name", value: "Bot" },
                  },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "frame" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "status" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "allocationPct" },
                      },
                    ],
                  },
                },
                {
                  kind: "InlineFragment",
                  typeCondition: {
                    kind: "NamedType",
                    name: { kind: "Name", value: "ValidationError" },
                  },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "message" },
                      },
                      { kind: "Field", name: { kind: "Name", value: "field" } },
                      { kind: "Field", name: { kind: "Name", value: "code" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateBotMutation, CreateBotMutationVariables>;
export const DeleteBotDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "DeleteBot" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "deleteBot" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "success" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<DeleteBotMutation, DeleteBotMutationVariables>;
export const PauseBotDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "PauseBot" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "pauseBot" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "InlineFragment",
                  typeCondition: {
                    kind: "NamedType",
                    name: { kind: "Name", value: "Bot" },
                  },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "status" },
                      },
                    ],
                  },
                },
                {
                  kind: "InlineFragment",
                  typeCondition: {
                    kind: "NamedType",
                    name: { kind: "Name", value: "NotFoundError" },
                  },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "message" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<PauseBotMutation, PauseBotMutationVariables>;
export const SelectTierDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "SelectTier" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "tier" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "SubscriptionTier" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "stripePaymentMethodId" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "selectTier" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "tier" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "tier" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "stripePaymentMethodId" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "stripePaymentMethodId" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "subscriptionTier" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "subscriptionStatus" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "trialExpiresAt" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<SelectTierMutation, SelectTierMutationVariables>;
export const SkipProposalDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "SkipProposal" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "skipProposal" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "InlineFragment",
                  typeCondition: {
                    kind: "NamedType",
                    name: { kind: "Name", value: "Proposal" },
                  },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "status" },
                      },
                    ],
                  },
                },
                {
                  kind: "InlineFragment",
                  typeCondition: {
                    kind: "NamedType",
                    name: { kind: "Name", value: "NotFoundError" },
                  },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "message" },
                      },
                    ],
                  },
                },
                {
                  kind: "InlineFragment",
                  typeCondition: {
                    kind: "NamedType",
                    name: { kind: "Name", value: "AuthError" },
                  },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "message" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  SkipProposalMutation,
  SkipProposalMutationVariables
>;
export const UpdateBotIdentityDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdateBotIdentity" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "input" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "UpdateBotIdentityInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "updateBotIdentity" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "input" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "bot" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateBotIdentityMutation,
  UpdateBotIdentityMutationVariables
>;
export const ValidateBrainKeyDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "ValidateBrainKey" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "provider" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "apiKey" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "validateBrainKey" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "provider" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "provider" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "apiKey" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "apiKey" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "valid" } },
                { kind: "Field", name: { kind: "Name", value: "error" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ValidateBrainKeyMutation,
  ValidateBrainKeyMutationVariables
>;
export const AccountDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "Account" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "account" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "providerName" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<AccountQuery, AccountQueryVariables>;
export const BalanceDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "Balance" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "balance" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "totalValue" } },
                { kind: "Field", name: { kind: "Name", value: "cashBalance" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "investedValue" },
                },
                { kind: "Field", name: { kind: "Name", value: "dayPnl" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "dayPnlPercent" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<BalanceQuery, BalanceQueryVariables>;
export const BotDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "Bot" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "bot" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "frame" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "allocationPct" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "dailyMaxLoss" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "dailyMaxGain" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "riskAttitude" },
                },
                { kind: "Field", name: { kind: "Name", value: "tradeTempo" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "combatPatience" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "activePosition" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "symbol" },
                      },
                      { kind: "Field", name: { kind: "Name", value: "qty" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "avgEntryPrice" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "status" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "openedAt" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "proposals" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "symbol" },
                      },
                      { kind: "Field", name: { kind: "Name", value: "side" } },
                      { kind: "Field", name: { kind: "Name", value: "qty" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "limitPrice" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "rationaleText" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "status" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "expiresAt" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "createdAt" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "botBrainConfig" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "brainType" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "modelId" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "provider" },
                      },
                    ],
                  },
                },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<BotQuery, BotQueryVariables>;
export const BotPerformanceDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "BotPerformance" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "botPerformance" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "totalRealizedPnl" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "returnOnAllocatedCapitalPct" },
                },
                { kind: "Field", name: { kind: "Name", value: "winCount" } },
                { kind: "Field", name: { kind: "Name", value: "lossCount" } },
                { kind: "Field", name: { kind: "Name", value: "winRatePct" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "avgGainPerWin" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "avgLossPerLoss" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "profitFactor" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "largestSingleWin" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "largestSingleLoss" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "avgHoldDurationHours" },
                },
                { kind: "Field", name: { kind: "Name", value: "daysActive" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "totalProposalsGenerated" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "totalProposalsApproved" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "approvalRatePct" },
                },
                { kind: "Field", name: { kind: "Name", value: "skipRatePct" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "pnlTimeSeries" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "date" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "cumulativePnl" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<BotPerformanceQuery, BotPerformanceQueryVariables>;
export const BotsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "Bots" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "bots" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "frame" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "allocationPct" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "dailyMaxLoss" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "dailyMaxGain" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "riskAttitude" },
                },
                { kind: "Field", name: { kind: "Name", value: "tradeTempo" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "combatPatience" },
                },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<BotsQuery, BotsQueryVariables>;
export const MeDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "Me" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "me" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "email" } },
                { kind: "Field", name: { kind: "Name", value: "auth0Id" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "onboardingCompleted" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<MeQuery, MeQueryVariables>;
export const MeSubscriptionDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "MeSubscription" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "me" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "subscriptionTier" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "subscriptionStatus" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "trialExpiresAt" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "currentPeriodEnd" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<MeSubscriptionQuery, MeSubscriptionQueryVariables>;
export const PositionsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "Positions" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "positions" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "symbol" } },
                { kind: "Field", name: { kind: "Name", value: "qty" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "avgEntryPrice" },
                },
                { kind: "Field", name: { kind: "Name", value: "status" } },
                { kind: "Field", name: { kind: "Name", value: "openedAt" } },
                { kind: "Field", name: { kind: "Name", value: "closedAt" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "bot" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<PositionsQuery, PositionsQueryVariables>;
export const ProposalsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "Proposals" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "status" },
          },
          type: {
            kind: "NamedType",
            name: { kind: "Name", value: "ProposalStatus" },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "proposals" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "status" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "status" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "symbol" } },
                { kind: "Field", name: { kind: "Name", value: "side" } },
                { kind: "Field", name: { kind: "Name", value: "qty" } },
                { kind: "Field", name: { kind: "Name", value: "limitPrice" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "rationaleText" },
                },
                { kind: "Field", name: { kind: "Name", value: "status" } },
                { kind: "Field", name: { kind: "Name", value: "expiresAt" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "bot" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ProposalsQuery, ProposalsQueryVariables>;
