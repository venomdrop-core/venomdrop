import { FC, useEffect, useState } from "react";
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
import { useCollectionInfo } from "../../../hooks/useCollectionInfo";
import { MintStage } from "../../../types/mintStage";
import { Controller, useForm } from "react-hook-form";
import { useCollectionContract } from "../../../hooks/useCollectionContract";
import { dateToUnix, unixToDate } from "../../../utils/dates";
import { useVenomWallet } from "../../../hooks/useVenomWallet";
import { toNano } from "../../../utils/toNano";
import classNames from "classnames";

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

interface Form {
  supplyMode: string;
  maxSupply: string;
}

export const DropSettings: FC<DropSettingsProps> = (props) => {
  const { accountInteraction } = useVenomWallet();
  const { slug } = useParams();
  const contract = useCollectionContract(slug);
  const { data: info } = useCollectionInfo(slug);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    watch,
  } = useForm<Form>({});
  const [mintStages, setMintStages] = useState<MintStage[]>([]);
  useEffect(() => {
    if (info) {
      const maxSupply = info.maxSupply;
      setMintStages(info.mintStages.map((m) => ({
        startTime: unixToDate(m.startTime),
        endTime: unixToDate(m.endTime),
        name: 'Name Test',
        price: m.price,
        type: 'public',
      })));
      reset({ maxSupply, supplyMode: info.hasMaxSupply ? 'limited': 'unlimited' });
    }
  }, [info]);
  console.log(info);
  const onSubmit = async (data: Form) => {
    if (!contract || !accountInteraction) {
      // TODO: Update it to toast message
      alert('Error: Could not load contract');
      return;
    }
    const txn = await contract.methods.multiconfigure({
      options: {
        hasMaxSupply: data.supplyMode === 'limited',
        maxSupply: data.supplyMode === 'limited' ? data.maxSupply: 0,
        mintStages: mintStages.map(ms => ({
          startTime: dateToUnix(new Date(ms.startTime)),
          endTime: dateToUnix(new Date(ms.endTime)),
          price: ms.price,
          maxTotalMintableByWallet: 0, // TODO: Fix it when implement this feature
        })),
      }
    }).send({ from: accountInteraction?.address, amount: toNano('6') });
    console.log(txn);
  }
  const supplyModeWatch = watch('supplyMode');
  return (
    <AdminLayout>
      <AdminForm title="Drop Settings" submitLabel="Save Collection" onSubmit={handleSubmit(onSubmit)}>
        <InputWrapper
          label="Supply Mode"
          description="Choose whether your collection should be limited or unlimited"
        >
          <Controller
            name="supplyMode"
            control={control}
            rules={{ required: false }}
            render={({ field }) => (
              <RadioGroupCards options={SUPPLY_MODE_OPTIONS} value={field.value} onChange={(value) => field.onChange({ target: { value } })} />
            )}
          />
        </InputWrapper>
        <div className={classNames({ hidden: supplyModeWatch === 'unlimited'})}>
          <InputWrapper
            label="Supply"
            description="Total supply for collection"
          >
            <input className="input input-bordered w-full" type="number" {...register('maxSupply')}></input>
          </InputWrapper>
        </div>
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
