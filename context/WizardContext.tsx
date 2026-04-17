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
 */

import { apolloClient } from "@/apollo/client";
import { FRAME_CONFIG } from "@/constants/frameConfig";
import {
  BotFrame,
  BrainType,
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

interface BrainState {
  brainType: BrainType;
  provider: string;
  modelId: string;
  apiKey: string | null; // NEVER serialized to AsyncStorage
}

export interface WizardState {
  frameName: BotFrame | null;
  name: string;
  avatarId: string;
  colorway: string;
  allocationPct: number;
  riskAttitude: RiskAttitude | null;
  tradeTempo: TradeTempo | null;
  combatPatience: CombatPatience | null;
  marketAwareness: MarketAwarenessInput;
  sectors: string[];
  exitPersonality: ExitPersonalityInput | null;
  stopLossStyle: StopLossStyleInput | null;
  dailyMaxLoss: number;
  dailyMaxGain: number | null;
  emotionalControls: EmotionalControlsInput;
  rulesOfEngagement: RulesOfEngagementInput;
  brain: BrainState;
  existingAllocationTotal: number; // fetched at wizard entry; not persisted
}

// Subset written to AsyncStorage — apiKey and existingAllocationTotal excluded
type PersistedDraft = Omit<WizardState, "existingAllocationTotal" | "brain"> & {
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
  avatarId: "",
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

// ── Context ───────────────────────────────────────────────────────────────────

interface WizardContextValue {
  state: WizardState;
  brainCatalog: BrainCatalog | null;
  isLoading: boolean;
  /** Non-null when a saved draft was found on cold launch; show Resume / Start Fresh prompt */
  draftPrompt: "resume-or-fresh" | null;
  selectFrame: (frameName: BotFrame) => void;
  updateField: <K extends keyof WizardState>(
    field: K,
    value: WizardState[K],
  ) => void;
  updateBrain: (partial: Partial<BrainState>) => void;
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
  const [isLoading, setIsLoading] = useState(true);
  const [draftPrompt, setDraftPrompt] = useState<"resume-or-fresh" | null>(
    null,
  );
  // Holds the deserialized draft while waiting for the user to choose Resume or Start Fresh
  const pendingDraftRef = useRef<WizardState | null>(null);

  const initialize = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch brain catalog and existing allocation concurrently
      const [catalogResult, allocationResult] = await Promise.allSettled([
        apolloClient.query({
          query: BRAIN_PROVIDERS_QUERY,
          fetchPolicy: "cache-first",
        }),
        apolloClient.query({
          query: EXISTING_ALLOCATION_QUERY,
          fetchPolicy: "network-only",
        }),
      ]);

      const catalog =
        catalogResult.status === "fulfilled"
          ? (((catalogResult.value.data as any)
              ?.brainProviders as BrainCatalog | null) ?? null)
          : null;
      setBrainCatalog(catalog);

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
          const draft = JSON.parse(raw) as PersistedDraft;
          restoredState = {
            ...draft,
            brain: { ...draft.brain, apiKey: null }, // apiKey never stored
            existingAllocationTotal,
          };
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
  }, []);

  const selectFrame = useCallback((frameName: BotFrame) => {
    const { colorway, defaults } = FRAME_CONFIG[frameName];
    setState((prev) => ({
      ...prev,
      frameName,
      colorway,
      allocationPct: defaults.allocationPct,
      dailyMaxLoss: defaults.dailyMaxLoss,
      riskAttitude: defaults.riskAttitude,
      tradeTempo: defaults.tradeTempo,
      combatPatience: defaults.combatPatience,
      exitPersonality: defaults.exitPersonality,
      stopLossStyle: defaults.stopLossStyle,
      marketAwareness: defaults.marketAwareness,
      // brain is preserved across frame changes
    }));
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

  const persistDraft = useCallback(async () => {
    const start = Date.now();

    const { brain, existingAllocationTotal: _ignored, ...rest } = state;
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

  return (
    <WizardContext.Provider
      value={{
        state,
        brainCatalog,
        isLoading,
        draftPrompt,
        selectFrame,
        updateField,
        updateBrain,
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
