import type { WizardState } from "@/context/WizardContext";
import { ForgeSection } from "@/forge/components/ForgeSection";
import { SectorGrid } from "@/forge/sectors/SectorGrid";
import { SectorFilter } from "@/generated/graphql";
import { Dispatch, SetStateAction } from "react";

interface SectorsProps {
  combatComplete: boolean;
  sectors: SectorFilter[];
  updateField: <K extends keyof WizardState>(
    field: K,
    value: WizardState[K],
  ) => void;
  sectorAttempted: boolean;
  setSectorAttempted: Dispatch<SetStateAction<boolean>>;
}

export const Sectors = ({
  combatComplete,
  sectors,
  updateField,
  sectorAttempted,
  setSectorAttempted,
}: SectorsProps) => {
  return (
    <ForgeSection
      title="Sectors"
      subtitle="Choose which market sectors your bot can trade in."
      locked={!combatComplete}
      lockedMessage="Complete your Combat Profile first."
    >
      <SectorGrid
        selected={sectors}
        onChange={(sectors) => {
          updateField("sectors", sectors);
          if (sectors.length > 0) setSectorAttempted(false);
        }}
        showError={sectorAttempted}
      />
    </ForgeSection>
  );
};
