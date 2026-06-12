import { Colors } from "@/constants/theme";
import type { WizardState } from "@/context/WizardContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Text, View } from "react-native";
import { AllocationControl } from "./AllocationControl";

const MIN_ALLOCATION_USD = 500;

interface AllocationProps {
  capitalAllocatedUsd: number;
  updateField: <K extends keyof WizardState>(
    field: K,
    value: WizardState[K],
  ) => void;
  existingAllocationTotal: number;
  userCashBalance: number;
  frameName: string | null;
}

export const Allocation = ({
  capitalAllocatedUsd,
  updateField,
  existingAllocationTotal,
  userCashBalance,
}: AllocationProps) => {
  const theme = Colors[useColorScheme()];
  const availableBalance = Math.max(
    0,
    userCashBalance - existingAllocationTotal,
  );
  const fullyAllocated =
    userCashBalance > 0 && availableBalance < MIN_ALLOCATION_USD;

  return (
    <View>
      {fullyAllocated ? (
        <Text style={{ color: theme.warning, fontSize: 13 }}>
          Your other agents have committed all available capital. Free up
          allocation by editing or removing an existing agent, or deposit
          additional funds.
        </Text>
      ) : (
        <AllocationControl
          value={capitalAllocatedUsd}
          onChange={(v) => updateField("capitalAllocatedUsd", v)}
          existingTotal={existingAllocationTotal}
          userCashBalance={userCashBalance}
        />
      )}
    </View>
  );
};
