import type { WizardState } from "@/context/WizardContext";
import { ForgeOptionCard } from "@/features/agents/forge/components/ForgeOptionCard";
import { ForgeSection } from "@/features/agents/forge/components/ForgeSection";
import { ProposalCommunicationStyle } from "@tachyonapp/tachyon-queue-types/config";

interface CommunicationProps {
  canAdvance: boolean;
  updateField: <K extends keyof WizardState>(
    field: K,
    value: WizardState[K],
  ) => void;
  proposalCommunicationStyle: ProposalCommunicationStyle | null;
}

const COMM_STYLE_OPTIONS: {
  value: ProposalCommunicationStyle;
  label: string;
  description: string;
}[] = [
  {
    value: ProposalCommunicationStyle.TERSE,
    label: "Terse",
    description: "Short, direct proposals. Just the signal and the numbers.",
  },
  {
    value: ProposalCommunicationStyle.DETAILED,
    label: "Detailed",
    description:
      "Full context with each proposal — reasoning, market conditions, risk factors.",
  },
  {
    value: ProposalCommunicationStyle.CAUTIOUS_MEASURED,
    label: "Cautious & Measured",
    description: "Thoughtful, nuanced proposals that acknowledge uncertainty.",
  },
];

export const Communication = ({
  canAdvance,
  updateField,
  proposalCommunicationStyle,
}: CommunicationProps) => {
  return (
    <ForgeSection
      title="Communication Style"
      subtitle="How should your agent phrase its trade proposals?"
      locked={!canAdvance}
      lockedMessage="Set your agent name and strategy first."
    >
      {COMM_STYLE_OPTIONS.map((opt) => (
        <ForgeOptionCard
          key={opt.value}
          label={opt.label}
          description={opt.description}
          selected={proposalCommunicationStyle === opt.value}
          onSelect={() => updateField("proposalCommunicationStyle", opt.value)}
        />
      ))}
    </ForgeSection>
  );
};
