import type { WizardState } from "@/context/WizardContext";
import { SectorGrid } from "@/forge/sectors/SectorGrid";
import { SectorFilter } from "@/generated/graphql";
import { Dispatch, SetStateAction } from "react";
import { View } from "react-native";

interface SectorsProps {
  sectors: SectorFilter[];
  updateField: <K extends keyof WizardState>(
    field: K,
    value: WizardState[K],
  ) => void;
  sectorAttempted: boolean;
  setSectorAttempted: Dispatch<SetStateAction<boolean>>;
}

export const Sectors = ({
  sectors,
  updateField,
  sectorAttempted,
  setSectorAttempted,
}: SectorsProps) => {
  return (
    <View>
      <SectorGrid
        selected={sectors}
        onChange={(sectors) => {
          updateField("sectors", sectors);
          if (sectors.length > 0) setSectorAttempted(false);
        }}
        showError={sectorAttempted}
      />
    </View>
  );
};
