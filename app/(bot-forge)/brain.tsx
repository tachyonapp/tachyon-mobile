import { ForgeSection } from "@/components/forge/ForgeSection";
import { BrainSelector } from "@/components/wizard/BrainSelector";
import type { BrainState } from "@/context/WizardContext";
import {
  BrainCatalog,
  BrainConfigInput,
  BrainType,
  MeSubscriptionDocument,
  SubscriptionTier,
  ValidateBrainKeyDocument,
  type MeSubscriptionQuery,
  type ValidateBrainKeyMutation,
  type ValidateBrainKeyMutationVariables,
} from "@/generated/graphql";
import { useMutation, useQuery } from "@apollo/client/react";
import { useEffect } from "react";

interface BrainProps {
  stopLossSet: boolean;
  brain: BrainConfigInput;
  brainCatalog: BrainCatalog | null;
  isKeyValidated: boolean;
  updateBrain: (partial: Partial<BrainState>) => void;
  setIsKeyValidated: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Brain = ({
  stopLossSet,
  brain,
  brainCatalog,
  isKeyValidated,
  updateBrain,
  setIsKeyValidated,
}: BrainProps) => {
  const { data: meData } = useQuery<MeSubscriptionQuery>(
    MeSubscriptionDocument,
  );
  const subscriptionTier = meData?.me?.subscriptionTier ?? null;

  const [validateBrainKey] = useMutation<
    ValidateBrainKeyMutation,
    ValidateBrainKeyMutationVariables
  >(ValidateBrainKeyDocument);

  // Auto-correct brain type when tier is incompatible with a draft selection.
  // FREE_TRIAL and TACHYON_HOSTED can only use the hosted brain; BYOK must use BYOK.
  useEffect(() => {
    if (!subscriptionTier) return;

    if (
      (subscriptionTier === SubscriptionTier.FreeTrial ||
        subscriptionTier === SubscriptionTier.TachyonHosted) &&
      brain.brainType === BrainType.Byok
    ) {
      updateBrain({ brainType: BrainType.TachyonHosted, apiKey: null });
      setIsKeyValidated(false);
      return;
    }

    if (
      subscriptionTier === SubscriptionTier.Byok &&
      brain.brainType === BrainType.TachyonHosted
    ) {
      updateBrain({ brainType: BrainType.Byok });
    }
  }, [subscriptionTier]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleValidateKey(apiKey: string): Promise<boolean> {
    if (!brain.provider) return false;

    const { data } = await validateBrainKey({
      variables: { provider: brain.provider, apiKey },
    });
    const ok = data?.validateBrainKey?.valid ?? false;
    if (ok) {
      updateBrain({ apiKey });
      setIsKeyValidated(true);
    } else {
      setIsKeyValidated(false);
    }
    return ok;
  }

  function handleBrainTypeChange(type: BrainType) {
    updateBrain({ brainType: type, apiKey: null });
    setIsKeyValidated(false);
  }

  return (
    <ForgeSection
      title="AI Model"
      subtitle="Your bot uses AI to analyze and interact with markets as well as explain and propose trades — YOU approve every trade before it executes."
      locked={!stopLossSet}
      lockedMessage="Configure your protections first."
    >
      <BrainSelector
        brainType={brain.brainType}
        provider={brain.provider ?? ""}
        modelId={brain.modelId}
        byokProviders={brainCatalog?.byokProviders ?? []}
        isKeyValidated={isKeyValidated}
        hasByokDraft={
          brain.brainType === BrainType.Byok && brain.apiKey === null
        }
        subscriptionTier={subscriptionTier}
        onBrainTypeChange={handleBrainTypeChange}
        onProviderChange={(p) => {
          updateBrain({ provider: p, apiKey: null });
          setIsKeyValidated(false);
        }}
        onModelChange={(m) => updateBrain({ modelId: m })}
        onValidateKey={handleValidateKey}
      />
    </ForgeSection>
  );
};
