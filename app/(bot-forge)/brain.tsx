import { ForgeSection } from "@/components/forge/ForgeSection";
import { BrainSelector } from "@/components/wizard/BrainSelector";
import type { BrainState } from "@/context/WizardContext";
import {
  BrainCatalog,
  BrainConfigInput,
  BrainType,
  ValidateBrainKeyDocument,
  type ValidateBrainKeyMutation,
  type ValidateBrainKeyMutationVariables,
} from "@/generated/graphql";
import { useMutation } from "@apollo/client/react";

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
  const [validateBrainKey] = useMutation<
    ValidateBrainKeyMutation,
    ValidateBrainKeyMutationVariables
  >(ValidateBrainKeyDocument);

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
      title="Brain"
      subtitle="Your bot uses AI to explain why it found a trade — you approve every trade before it executes."
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
