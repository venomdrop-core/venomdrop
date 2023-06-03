import { PlusIcon } from "@heroicons/react/24/outline";
import { FC, useState } from "react";
import { MintStagesTimeline } from "./MintStagesTimeline";
import { AddMintStageModal } from "./AddMintStageModal";
import { MintStage } from "../types/mintStage";

export interface MintStagesInputProps {
  mintStages: MintStage[];
  setMintStages: React.Dispatch<React.SetStateAction<MintStage[]>>;
}

// const mintStages: MintStage[] = [
//   {
//     name: "Mint Stage 1",
//     startTime: new Date("2023-05-10 22:50"),
//     endTime: new Date("2023-05-10 22:50"),
//     type: "allowlist",
//   },
//   {
//     name: "Public Minting",
//     startTime: new Date("2023-05-10 22:50"),
//     endTime: new Date("2023-05-10 22:50"),
//     type: "public",
//   },
// ];

export const MintStagesInput: FC<MintStagesInputProps> = ({
  mintStages,
  setMintStages,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const removeMintStageByIndex = (idx: number) => {
    setMintStages(ms => [...ms.filter((_, i) => i !== idx)]);
  }
  return (
    <div>
      <AddMintStageModal
        open={showAddModal}
        setOpen={setShowAddModal}
        mintStages={mintStages}
        setMintStages={setMintStages}
      />
      {mintStages.length === 0 ? (
        <div className="border border-dashed border-base-100 p-6 text-center rounded-md text-gray-500">
          No Mint Stage Added
        </div>
      ) : (
        <MintStagesTimeline mintStages={mintStages} editMode onRemoveMintStageClick={removeMintStageByIndex} />
      )}
      <div>
        <button
          className="btn btn-outline btn-block mt-4"
          type="button"
          onClick={() => setShowAddModal(true)}
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Mint Stage
        </button>
      </div>
    </div>
  );
};
