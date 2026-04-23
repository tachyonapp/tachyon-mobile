import { ForgeSection } from "@/components/forge/ForgeSection";
import { AllocationControl } from "@/components/wizard/AllocationControl";
import { Colors } from "@/constants/theme";
import type { WizardState } from "@/context/WizardContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Text } from "react-native";

interface CapitalProps {
  allocationPct: number;
  allocationBounds: { min: number; max: number };
  updateField: <K extends keyof WizardState>(
    field: K,
    value: WizardState[K],
  ) => void;
  combatComplete: boolean;
  existingAllocationTotal: number;
  userCashBalance: number;
}

export const Capital = ({
  allocationPct,
  updateField,
  allocationBounds,
  combatComplete,
  existingAllocationTotal,
  userCashBalance,
}: CapitalProps) => {
  const theme = Colors[useColorScheme()];
  const allocationMax = Math.min(
    allocationBounds.max,
    Math.max(0, 1.0 - existingAllocationTotal),
  );
  const fullyAllocated = allocationMax < allocationBounds.min;

  return (
    <ForgeSection
      title="Capital Allocation"
      subtitle="How much of your account funds does this bot control?"
      tooltip={{
        title: "Capital Allocation",
        body: "This is the percentage of your total account balance this bot can use. Multiple bots share your capital — allocations cannot exceed 100%.",
      }}
      locked={!combatComplete}
      lockedMessage="Complete your Combat Profile first."
    >
      {fullyAllocated ? (
        <Text style={{ color: theme.warning, fontSize: 13 }}>
          Your other bots are using 100% of your capital. Free up allocation by
          editing or removing an existing bot before adding a new one.
        </Text>
      ) : (
        <AllocationControl
          value={allocationPct}
          onChange={(v) => {
            updateField("allocationPct", v);
          }}
          min={allocationBounds.min}
          max={allocationMax}
          existingTotal={existingAllocationTotal}
          userCashBalance={userCashBalance}
        />
      )}
    </ForgeSection>
  );
};
