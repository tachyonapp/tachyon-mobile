/**
 * The `WizardContext` shape mirrors `CreateBotInput` in the API 1:1.
 * It is the in-memory accumulator for all 12 wizard steps.
 *
 * Key behaviors:
 *
 * Initialization:
 *
 * - On mount, reads `AsyncStorage` key `'tachyon:bot-wizard:draft'`.
 * - If a serialized draft exists, prompts the user: `"Resume your bot?" [Resume] [Start Fresh]`.
 * - If no draft, initializes empty state.
 *
 * Frame selection:
 *
 * - When user selects a frame, populate all fields with `FRAME_CONFIG[frameName].defaults` (pre-fill).
 *
 * Step persistence:
 *
 * - On every step navigation (forward OR back), serialize the full context state
 *   to `AsyncStorage` under key `'tachyon:bot-wizard:draft'`. Use `JSON.stringify`.
 *   If serialization takes > 50ms, it's too slow — profile and optimize.
 *
 * Completion:
 *
 * - On successful `createBot` mutation, call `clearDraft()` which deletes the `AsyncStorage` key.
 *
 * Abandon:
 *
 * - On explicit wizard exit (user taps back past the first step or taps a close button),
 *   prompt confirmation before calling `clearDraft()`.
 *
 * AsyncStorage failure:
 *
 * - If `AsyncStorage.getItem` fails on cold launch, start fresh with no error shown to user.
 *   Log the error to console (swap for Sentry once installed).
 *
 * BYOK key NOT persisted to AsyncStorage:
 *
 * - The wizard draft state stores only `brain.provider` and `brain.modelId` —
 *   never `brain.apiKey`. If the user resumes a draft where `brainType === 'BYOK'`,
 *   the API key input is cleared and the user must re-enter it. The UI must indicate
 *   this clearly on the Brain screen.
 *
 * Brain catalog:
 *
 * - `brainCatalog` is fetched from the API at wizard entry via `brainProviders` query.
 *   Mobile never hardcodes provider/model lists — the API is the single source of truth.
 *
 * Parent sectors:
 *
 * - `parentSectorsData` is fetched from the API at wizard entry via `parentSectors` query.
 *   On query failure, `parentSectorsData` is `[]` and sub-sector panels are hidden gracefully.
 *
 * Active advisories:
 *
 * - `activeAdvisories` is derived from the current frame config and wizard state.
 *   It is recomputed whenever advisory-relevant fields change. Never persisted to AsyncStorage.
 *   Advisories are informational only — they never block wizard progression.
 */

import { apolloClient } from "@/apollo/client";
import {
  BotFrame,
  BrainType,
  ExitPersonalityName,
  SectorFilter,
  StopStyleName,
  type BrainCatalog,
  type CombatPatience,
  type EmotionalControlsInput,
  type ExitPersonalityInput,
  type MarketAwarenessInput,
  type RiskAttitude,
  type RulesOfEngagementInput,
  type StopLossStyleInput,
  type TradeTempo,
} from "@/generated/graphql";
import { gql } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  FRAME_CONFIG,
  type BotFrameName,
  type ConfidenceThreshold,
  type DayOfWeek,
  type DividendPreference,
  type EarningsBehavior,
  type FrameAdvisory,
  type PositionSizingMethod,
  type ProposalCommunicationStyle,
  type RecoveryMode,
  type RegimeAwareness,
  type SectorDefinition,
  type SessionPreference,
  type ShortInterestSignal,
  type SignalWeights,
  type VolatilityEnvPreference,
} from "@tachyonapp/tachyon-queue-types/config";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

const DRAFT_KEY = "tachyon:bot-wizard:draft";

// ── State ─────────────────────────────────────────────────────────────────────

export interface BrainState {
  brainType: BrainType;
  provider: string;
  modelId: string;
  apiKey: string | null; // NEVER serialized to AsyncStorage
}

export interface WizardState {
  frameName: BotFrame | null;
  name: string;
  avatarSeed: string;
  colorway: string;
  allocationPct: number;
  riskAttitude: RiskAttitude | null;
  tradeTempo: TradeTempo | null;
  combatPatience: CombatPatience | null;
  marketAwareness: MarketAwarenessInput;
  sectors: SectorFilter[];
  exitPersonality: ExitPersonalityInput | null;
  stopLossStyle: StopLossStyleInput | null;
  dailyMaxLoss: number;
  dailyMaxGain: number | null;
  emotionalControls: EmotionalControlsInput;
  rulesOfEngagement: RulesOfEngagementInput;
  brain: BrainState;
  existingAllocationTotal: number; // fetched at wizard entry; not persisted
  signalWeights: SignalWeights;
  confidenceThreshold: ConfidenceThreshold | null;
  regimeAwareness: RegimeAwareness | null;
  earningsBehavior: EarningsBehavior | null;
  subSectors: string[];
  customWatchlist: string[];
  exclusionList: string[];
  dividendPreference: DividendPreference | null;
  shortInterestSignal: ShortInterestSignal | null;
  positionSizingMethod: PositionSizingMethod | null;
  minRrRatio: number | null;
  maxDrawdownProtectionPct: number | null;
  recoveryMode: RecoveryMode | null;
  sessionPreference: SessionPreference | null;
  dayAvoidance: DayOfWeek[];
  volatilityEnvPreference: VolatilityEnvPreference | null;
  agentBackground: string;
  proposalCommunicationStyle: ProposalCommunicationStyle | null;
  winReaction: string | null;
  lossReaction: string | null;
  activeAdvisories: FrameAdvisory[]; // derived — NOT persisted to AsyncStorage
}

// Subset written to AsyncStorage — apiKey, existingAllocationTotal, and activeAdvisories excluded
type PersistedDraft = Omit<
  WizardState,
  "existingAllocationTotal" | "brain" | "activeAdvisories"
> & {
  brain: Omit<BrainState, "apiKey">;
};

// ── Initial values ────────────────────────────────────────────────────────────

const DEFAULT_BRAIN: BrainState = {
  brainType: BrainType.TachyonHosted,
  modelId: "claude-haiku-4-5-20251001",
  provider: "anthropic",
  apiKey: null,
};

const EMPTY_STATE: WizardState = {
  frameName: null,
  name: "",
  avatarSeed: "",
  colorway: "",
  allocationPct: 0.1,
  riskAttitude: null,
  tradeTempo: null,
  combatPatience: null,
  marketAwareness: {
    momentum: 0.5,
    meanReversion: 0.5,
    volatility: 0.5,
    trendFollowing: 0.5,
  },
  sectors: [],
  exitPersonality: null,
  stopLossStyle: null,
  dailyMaxLoss: 0.1,
  dailyMaxGain: null,
  emotionalControls: {
    freezeAfterLosses: null,
    cooldownAfterVolatility: false,
    standDownAfterNoonIfLosing: false,
  },
  rulesOfEngagement: {
    overnightHoldAllowed: false,
    noSameDayExitUnlessStopLoss: false,
  },
  brain: DEFAULT_BRAIN,
  existingAllocationTotal: 0,
  // null/empty until a frame is selected
  signalWeights: { technicals: 0, news: 0, fundamentals: 0 },
  confidenceThreshold: null,
  regimeAwareness: null,
  earningsBehavior: null,
  subSectors: [],
  customWatchlist: [],
  exclusionList: [],
  dividendPreference: null,
  shortInterestSignal: null,
  positionSizingMethod: null,
  minRrRatio: null,
  maxDrawdownProtectionPct: null,
  recoveryMode: null,
  sessionPreference: null,
  dayAvoidance: [],
  volatilityEnvPreference: null,
  agentBackground: "",
  proposalCommunicationStyle: null,
  winReaction: null,
  lossReaction: null,
  activeAdvisories: [],
};

// ── GraphQL ───────────────────────────────────────────────────────────────────

const BRAIN_PROVIDERS_QUERY = gql`
  query BrainProviders {
    brainProviders {
      defaultBrain {
        brainType
        modelId
        provider
        displayName
        description
      }
      byokProviders {
        provider
        displayName
        models {
          modelId
          displayName
        }
      }
    }
  }
`;

const EXISTING_ALLOCATION_QUERY = gql`
  query WizardExistingAllocation {
    bots {
      allocationPct
    }
  }
`;

const PARENT_SECTORS_QUERY = gql`
  query ParentSectors {
    parentSectors {
      parentSector
      subSectors
    }
  }
`;

// ── Advisory derivation ───────────────────────────────────────────────────────

function deriveAdvisories(
  frameName: BotFrameName | null,
  settings: Partial<WizardState>,
): FrameAdvisory[] {
  if (!frameName) return [];
  const config = FRAME_CONFIG[frameName];
  if (!config) return [];
  return config.advisories.filter((advisory) => {
    try {
      return advisory.condition(settings as any);
    } catch {
      return false; // advisory evaluation error — suppress, never crash wizard
    }
  });
}

// ── Draft deserialization ─────────────────────────────────────────────────────

function deserializeDraft(
  raw: unknown,
  existingAllocationTotal: number,
): WizardState {
  const draft = raw as Partial<PersistedDraft>;
  const frameName = draft.frameName as BotFrameName | null;
  const frameDefaults =
    frameName && FRAME_CONFIG[frameName]
      ? FRAME_CONFIG[frameName].defaults
      : null;

  return {
    ...EMPTY_STATE,
    ...(draft as Partial<WizardState>),
    brain: {
      brainType:
        (draft.brain?.brainType as BrainType) ?? BrainType.TachyonHosted,
      provider: draft.brain?.provider ?? "anthropic",
      modelId: draft.brain?.modelId ?? "claude-haiku-4-5-20251001",
      apiKey: null, // apiKey never stored — user must re-enter after resuming a BYOK draft
    },
    existingAllocationTotal,
    activeAdvisories: [], // always recomputed — never from draft
    // use draft value if present, else frame default, else null/empty
    signalWeights: draft.signalWeights ??
      frameDefaults?.signalWeights ?? {
        technicals: 34,
        news: 33,
        fundamentals: 33,
      },
    confidenceThreshold:
      draft.confidenceThreshold ?? frameDefaults?.confidenceThreshold ?? null,
    regimeAwareness:
      draft.regimeAwareness ?? frameDefaults?.regimeAwareness ?? null,
    earningsBehavior:
      draft.earningsBehavior ?? frameDefaults?.earningsBehavior ?? null,
    subSectors: draft.subSectors ?? [],
    customWatchlist: draft.customWatchlist ?? [],
    exclusionList: draft.exclusionList ?? [],
    dividendPreference:
      draft.dividendPreference ?? frameDefaults?.dividendPreference ?? null,
    shortInterestSignal:
      draft.shortInterestSignal ?? frameDefaults?.shortInterestSignal ?? null,
    positionSizingMethod:
      draft.positionSizingMethod ?? frameDefaults?.positionSizingMethod ?? null,
    minRrRatio: draft.minRrRatio ?? frameDefaults?.minRrRatio ?? null,
    maxDrawdownProtectionPct:
      draft.maxDrawdownProtectionPct ??
      frameDefaults?.maxDrawdownProtectionPct ??
      null,
    recoveryMode: draft.recoveryMode ?? frameDefaults?.recoveryMode ?? null,
    sessionPreference:
      draft.sessionPreference ?? frameDefaults?.sessionPreference ?? null,
    dayAvoidance: draft.dayAvoidance ?? frameDefaults?.dayAvoidance ?? [],
    volatilityEnvPreference:
      draft.volatilityEnvPreference ??
      frameDefaults?.volatilityEnvPreference ??
      null,
    agentBackground: draft.agentBackground ?? "",
    proposalCommunicationStyle:
      draft.proposalCommunicationStyle ??
      frameDefaults?.proposalCommunicationStyle ??
      null,
    winReaction: draft.winReaction ?? null,
    lossReaction: draft.lossReaction ?? null,
  };
}

// ── Context ───────────────────────────────────────────────────────────────────

interface WizardContextValue {
  state: WizardState;
  brainCatalog: BrainCatalog | null;
  parentSectorsData: SectorDefinition[];
  isLoading: boolean;
  /** Non-null when a saved draft was found on cold launch; show Resume / Start Fresh prompt */
  draftPrompt: "resume-or-fresh" | null;
  /** Validation guards — consumed by wizard steps to gate Next CTA */
  signalWeightsValid: boolean;
  noTickerOverlap: boolean;
  hasActiveTradingDay: boolean;
  selectFrame: (frameName: BotFrame) => void;
  updateField: <K extends keyof WizardState>(
    field: K,
    value: WizardState[K],
  ) => void;
  updateBrain: (partial: Partial<BrainState>) => void;
  setCustomWatchlist: (tickers: string[]) => void;
  setExclusionList: (tickers: string[]) => void;
  setWinReaction: (phrase: string | null) => void;
  setLossReaction: (phrase: string | null) => void;
  persistDraft: () => Promise<void>;
  clearDraft: () => Promise<void>;
  resumeDraft: () => void;
  startFresh: () => void;
}

const WizardContext = createContext<WizardContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export function WizardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WizardState>(EMPTY_STATE);
  const [brainCatalog, setBrainCatalog] = useState<BrainCatalog | null>(null);
  const [parentSectorsData, setParentSectorsData] = useState<
    SectorDefinition[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [draftPrompt, setDraftPrompt] = useState<"resume-or-fresh" | null>(
    null,
  );
  // Holds the deserialized draft while waiting for the user to choose Resume or Start Fresh
  const pendingDraftRef = useRef<WizardState | null>(null);

  // ── Advisory derivation ────────────────────────────────────────────────────
  // Recompute when any field that could trigger an advisory changes.
  // The identity check inside setState prevents spurious re-renders.

  useEffect(() => {
    if (!state.frameName) return;
    const derived = deriveAdvisories(state.frameName as BotFrameName, state);
    setState((prev) => {
      if (
        prev.activeAdvisories.length === derived.length &&
        prev.activeAdvisories.every((a, i) => a.code === derived[i]?.code)
      ) {
        return prev;
      }
      return { ...prev, activeAdvisories: derived };
    });
  }, [
    state.frameName,
    state.signalWeights,
    state.confidenceThreshold,
    state.regimeAwareness,
    state.earningsBehavior,
    state.riskAttitude,
    state.tradeTempo,
    state.positionSizingMethod,
    state.dividendPreference,
    state.shortInterestSignal,
    state.recoveryMode,
    state.sessionPreference,
    state.volatilityEnvPreference,
  ]);

  // ── Initialize ─────────────────────────────────────────────────────────────

  const initialize = useCallback(async () => {
    setIsLoading(true);
    try {
      const [catalogResult, allocationResult, sectorsResult] =
        await Promise.allSettled([
          apolloClient.query({
            query: BRAIN_PROVIDERS_QUERY,
            fetchPolicy: "cache-first",
          }),
          apolloClient.query({
            query: EXISTING_ALLOCATION_QUERY,
            fetchPolicy: "network-only",
          }),
          apolloClient.query({
            query: PARENT_SECTORS_QUERY,
            fetchPolicy: "cache-first",
          }),
        ]);

      const catalog =
        catalogResult.status === "fulfilled"
          ? (((catalogResult.value.data as any)
              ?.brainProviders as BrainCatalog | null) ?? null)
          : null;
      setBrainCatalog(catalog);

      if (sectorsResult.status === "fulfilled") {
        const sectors = (sectorsResult.value.data as any)?.parentSectors as
          | SectorDefinition[]
          | null;
        setParentSectorsData(sectors ?? []);
      } else {
        console.error(
          "[WizardContext] parentSectors query failed:",
          (sectorsResult as PromiseRejectedResult).reason,
        );
        setParentSectorsData([]);
      }

      const bots: { allocationPct?: string | null }[] =
        allocationResult.status === "fulfilled"
          ? ((allocationResult.value.data as any)?.bots ?? [])
          : [];
      const existingAllocationTotal = bots.reduce(
        (sum, bot) => sum + parseFloat(bot.allocationPct ?? "0"),
        0,
      );

      // Attempt to restore draft — failures are silent to the user
      let restoredState: WizardState | null = null;
      try {
        const raw = await AsyncStorage.getItem(DRAFT_KEY);
        if (raw) {
          restoredState = deserializeDraft(
            JSON.parse(raw),
            existingAllocationTotal,
          );
        }
      } catch (err) {
        console.error(
          "[WizardContext] AsyncStorage read failed on cold launch:",
          err,
        );
        // Start fresh — no user-visible error
      }

      if (restoredState) {
        pendingDraftRef.current = restoredState;
        setState((prev) => ({ ...prev, existingAllocationTotal }));
        setDraftPrompt("resume-or-fresh");
      } else {
        setState((prev) => ({ ...prev, existingAllocationTotal }));
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // ── Actions ───────────────────────────────────────────────────────────────

  const resumeDraft = useCallback(() => {
    if (pendingDraftRef.current) {
      setState(pendingDraftRef.current);
      pendingDraftRef.current = null;
    }
    setDraftPrompt(null);
  }, []);

  const startFresh = useCallback(() => {
    pendingDraftRef.current = null;
    setDraftPrompt(null);
    setState((prev) => ({
      ...EMPTY_STATE,
      existingAllocationTotal: prev.existingAllocationTotal,
    }));
    AsyncStorage.removeItem(DRAFT_KEY).catch(console.error);
  }, []);

  const selectFrame = useCallback((frameName: BotFrame) => {
    setState((prev) => {
      if (prev.frameName === frameName) return prev;

      const frameKey = frameName as BotFrameName;
      const { colorway, defaults } = FRAME_CONFIG[frameKey];

      return {
        ...prev,
        frameName,
        colorway,
        // Existing frame-determined fields (bounds-clamping removed)
        allocationPct: defaults.allocationPct,
        dailyMaxLoss: defaults.dailyMaxLossPct,
        riskAttitude: defaults.riskAttitude,
        tradeTempo: defaults.tradeTempo,
        combatPatience: defaults.combatPatience,
        exitPersonality: {
          name: defaults.exitPersonality as ExitPersonalityName,
        },
        stopLossStyle: { name: defaults.stopLossStyle as StopStyleName },
        marketAwareness: defaults.marketAwareness,
        // frame-determined defaults
        signalWeights: defaults.signalWeights,
        confidenceThreshold: defaults.confidenceThreshold,
        regimeAwareness: defaults.regimeAwareness,
        earningsBehavior: defaults.earningsBehavior,
        dividendPreference: defaults.dividendPreference,
        shortInterestSignal: defaults.shortInterestSignal,
        positionSizingMethod: defaults.positionSizingMethod,
        minRrRatio: defaults.minRrRatio,
        maxDrawdownProtectionPct: defaults.maxDrawdownProtectionPct,
        recoveryMode: defaults.recoveryMode,
        sessionPreference: defaults.sessionPreference,
        dayAvoidance: defaults.dayAvoidance,
        volatilityEnvPreference: defaults.volatilityEnvPreference,
        proposalCommunicationStyle: defaults.proposalCommunicationStyle,
        // User-entered fields preserved across frame switches:
        // name, avatarSeed, brain, sectors, subSectors, customWatchlist,
        // exclusionList, agentBackground, winReaction, lossReaction
      };
    });
  }, []);

  const updateField = useCallback(
    <K extends keyof WizardState>(field: K, value: WizardState[K]) => {
      setState((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const updateBrain = useCallback((partial: Partial<BrainState>) => {
    setState((prev) => ({ ...prev, brain: { ...prev.brain, ...partial } }));
  }, []);

  const setCustomWatchlist = useCallback((tickers: string[]) => {
    setState((prev) => ({ ...prev, customWatchlist: tickers }));
  }, []);

  const setExclusionList = useCallback((tickers: string[]) => {
    setState((prev) => ({ ...prev, exclusionList: tickers }));
  }, []);

  const setWinReaction = useCallback((phrase: string | null) => {
    setState((prev) => ({ ...prev, winReaction: phrase }));
  }, []);

  const setLossReaction = useCallback((phrase: string | null) => {
    setState((prev) => ({ ...prev, lossReaction: phrase }));
  }, []);

  const persistDraft = useCallback(async () => {
    const start = Date.now();

    const {
      brain,
      existingAllocationTotal: _ignored,
      activeAdvisories: _advisories, // never persisted — functions can't serialize
      ...rest
    } = state;
    const draft: PersistedDraft = {
      ...rest,
      brain: {
        brainType: brain.brainType,
        provider: brain.provider,
        modelId: brain.modelId,
        // apiKey intentionally omitted — user must re-enter after resuming a BYOK draft
      },
    };

    const serialized = JSON.stringify(draft);
    const elapsed = Date.now() - start;
    if (elapsed > 50) {
      console.warn(
        `[WizardContext] Draft serialization took ${elapsed}ms — exceeds 50ms threshold`,
      );
    }

    await AsyncStorage.setItem(DRAFT_KEY, serialized);
  }, [state]);

  const clearDraft = useCallback(async () => {
    await AsyncStorage.removeItem(DRAFT_KEY);
  }, []);

  // ── Computed validation values ─────────────────────────────────────────────

  const signalWeightsValid =
    state.signalWeights.technicals +
      state.signalWeights.news +
      state.signalWeights.fundamentals ===
    100;

  const noTickerOverlap = !state.customWatchlist.some((t) =>
    state.exclusionList.includes(t),
  );

  const hasActiveTradingDay = state.dayAvoidance.length < 5;

  return (
    <WizardContext.Provider
      value={{
        state,
        brainCatalog,
        parentSectorsData,
        isLoading,
        draftPrompt,
        signalWeightsValid,
        noTickerOverlap,
        hasActiveTradingDay,
        selectFrame,
        updateField,
        updateBrain,
        setCustomWatchlist,
        setExclusionList,
        setWinReaction,
        setLossReaction,
        persistDraft,
        clearDraft,
        resumeDraft,
        startFresh,
      }}
    >
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard(): WizardContextValue {
  const ctx = useContext(WizardContext);
  if (!ctx) {
    throw new Error("useWizard must be used inside <WizardProvider>");
  }
  return ctx;
}
