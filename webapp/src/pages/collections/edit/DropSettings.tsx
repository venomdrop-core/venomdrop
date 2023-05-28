import { FC, useState } from "react";
import { AdminLayout } from "../../../layouts/AdminLayout";
import { InputWrapper } from "../../../components/InputWrapper";
import { AdminForm } from "../../../components/AdminForm";
import {
  RadioGroupCards,
  Option,
} from "../../../components/RadioGroupCards";
import { MintStagesInput } from "../../../components/MintStagesInput";
import { useParams } from "react-router-dom";
import { useCollection } from "../../../hooks/useCollection";
import { useContractSettings } from "../../../hooks/useContractSettings";
import { MintStage } from "../../../types/mintStage";

export interface DropSettingsProps {}

const SUPPLY_MODE_OPTIONS: Option[] = [
  {
    title: "Unlimited Supply",
    value: "unlimited",
    description: "An unlimited number of tokens can be minted",
  },
  {
    title: "Limited Supply",
    value: "limited",
    description: "A limited number of tokens can be minted",
  },
];

export const DropSettings: FC<DropSettingsProps> = (props) => {
  const { slug } = useParams();
  const { data: collection } = useCollection(slug);
  const { data: settings } = useContractSettings(collection?.contractAddress);
  const [mintStages, setMintStages] = useState<MintStage[]>([]);
  console.log(collection);
  console.log(settings);
  return (
    <AdminLayout>
      <AdminForm title="Drop Settings" submitLabel="Save Collection">
        <InputWrapper
          label="Supply Mode"
          description="Choose whether your collection should be limited or unlimited"
        >
          <RadioGroupCards options={SUPPLY_MODE_OPTIONS} />
        </InputWrapper>
        <InputWrapper
          label="Supply"
          description="Total supply for collection"
        >
          <input className="input input-bordered w-full" type="number"></input>
        </InputWrapper>
        <InputWrapper
          label="Mint Stages"
          description="Configure the mint stages for your collection"
        >
          <MintStagesInput mintStages={mintStages} setMintStages={setMintStages} />
        </InputWrapper>
      </AdminForm>
    </AdminLayout>
  );
};
