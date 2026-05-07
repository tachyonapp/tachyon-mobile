import { Colors } from "@/constants/theme";
import type { WizardState } from "@/context/WizardContext";
import { AllocationControl } from "@/forge/capital/AllocationControl";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Text, View } from "react-native";

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
  frameName: string | null;
}

export const Capital = ({
  allocationPct,
  updateField,
  allocationBounds,
  combatComplete,
  existingAllocationTotal,
  userCashBalance,
  frameName,
}: CapitalProps) => {
  const theme = Colors[useColorScheme()];
  const allocationMax = Math.min(
    allocationBounds.max,
    Math.max(0, 1.0 - existingAllocationTotal),
  );
  const fullyAllocated = allocationMax < allocationBounds.min;

  return (
    <View>
      {frameName && (
        <Text style={{ color: theme.textDisabled, fontSize: 15 }}>
          {`${frameName} agent type requires a minimum ${Math.round(allocationBounds.min * 100)}% and a ${Math.round(allocationBounds.max * 100)}% maximum allocation.`}
        </Text>
      )}
      {fullyAllocated ? (
        <Text style={{ color: theme.warning, fontSize: 13 }}>
          Your other agents are using 100% of your capital. Free up allocation
          by editing or removing an existing bot before adding a new one or
          adding more funds to your account.
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
    </View>
  );
};
