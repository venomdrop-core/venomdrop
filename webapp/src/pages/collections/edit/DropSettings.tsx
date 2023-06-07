import { FC, useEffect, useState } from "react";
import { AdminLayout } from "../../../layouts/AdminLayout";
import { InputWrapper } from "../../../components/InputWrapper";
import { AdminForm } from "../../../components/AdminForm";
import { RadioGroupCards, Option } from "../../../components/RadioGroupCards";
import { MintStagesInput } from "../../../components/MintStagesInput";
import { useParams } from "react-router-dom";
import { useCollectionInfo } from "../../../hooks/useCollectionInfo";
import { MintStage } from "../../../types/mintStage";
import { Controller, useForm } from "react-hook-form";
import { useCollectionContract } from "../../../hooks/useCollectionContract";
import { dateToUnix } from "../../../utils/dates";
import { useVenomWallet } from "../../../hooks/useVenomWallet";
import { toNano } from "../../../utils/toNano";
import classNames from "classnames";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  MintStageGroupDto,
  activateMintStageGroup,
  createMintStageGroup,
  getActiveMintStageGroup,
} from "../../../api/collections";
import { waitFinalized } from "../../../utils/waitFinalized";
import { toast } from "react-toastify";

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

export const DropSettings: FC<DropSettingsProps> = () => {
  const { accountInteraction, venomProvider } = useVenomWallet();
  const { slug } = useParams();
  const [loading, setLoading] = useState(false);
  const contract = useCollectionContract(slug);
  const { data: info } = useCollectionInfo(slug);
  const { data: activeMintStageGroup } = useQuery({
    queryFn: () => getActiveMintStageGroup(slug!),
    queryKey: ["active-mint-group", slug],
  });
  console.log(activeMintStageGroup);
  const createMintStageGroupMutation = useMutation({
    mutationFn: (data: MintStageGroupDto) => createMintStageGroup(slug!, data),
  });
  const activateMintStageGroupMutation = useMutation({
    mutationFn: (mintStageGroupId: string) =>
      activateMintStageGroup(slug!, mintStageGroupId),
  });
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
  } = useForm<Form>({});
  const [mintStages, setMintStages] = useState<MintStage[]>([]);
  useEffect(() => {
    if (info) {
      const maxSupply = info.maxSupply;
      // setMintStages(info.mintStages.map(parseContractMintStage));
      if (activeMintStageGroup) {
        const mintStages: MintStage[] = activeMintStageGroup.mintStages.map(
          (ms) => ({
            name: ms.name,
            startTime: new Date(ms.startDate),
            endTime: new Date(ms.endDate),
            price: ms.price,
            type: ms.type,
            allowlist: ms.allowlistData.map((row) => row.address),
          })
        );
        setMintStages(mintStages);
      }
      reset({
        maxSupply,
        supplyMode: info.hasMaxSupply ? "limited" : "unlimited",
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info]);
  const onSubmit = async (data: Form) => {
    if (!contract || !accountInteraction || !venomProvider) {
      // TODO: Update it to toast message
      alert("Error: Could not load contract");
      return;
    }
    setLoading(true);
    const mintStageGroupRes = await createMintStageGroupMutation.mutateAsync({
      mintStages: mintStages.map((ms) => ({
        name: ms.name,
        price: ms.price,
        type: ms.type,
        startDate: new Date(ms.startTime).toISOString(),
        endDate: new Date(ms.endTime).toISOString(),
        allowlistData: (ms.allowlist || []).map((address) => ({ address })),
      })),
    });
    const txn = contract.methods
      .multiconfigure({
        options: {
          hasMaxSupply: data.supplyMode === "limited",
          maxSupply: data.supplyMode === "limited" ? data.maxSupply : 0,
          mintStages: mintStages.map((ms, idx) => {
            const merkleTreeRoot = mintStageGroupRes.merkleTreeRoots[idx];
            console.log(merkleTreeRoot);
            return {
              name: ms.name,
              startTime: dateToUnix(new Date(ms.startTime)),
              endTime: dateToUnix(new Date(ms.endTime)),
              price: ms.price,
              merkleTreeRoot,
            };
          }),
        },
      })
      .send({ from: accountInteraction?.address, amount: toNano("0.1") });
    try {
      await waitFinalized(venomProvider, txn);
      await activateMintStageGroupMutation.mutateAsync(
        mintStageGroupRes.mintStageGroupId
      );
      toast("Collection updated successfully");
    } catch (error) {
      toast.error("Could not update collection");
      console.error(error);
    }
    setLoading(false);
  };
  const supplyModeWatch = watch("supplyMode");
  return (
    <AdminLayout>
      <AdminForm
        title="Drop Settings"
        submitLabel="Save Collection"
        onSubmit={handleSubmit(onSubmit)}
        loading={loading}
      >
        <InputWrapper
          label="Supply Mode"
          description="Choose whether your collection should be limited or unlimited"
        >
          <Controller
            name="supplyMode"
            control={control}
            rules={{ required: false }}
            render={({ field }) => (
              <RadioGroupCards
                options={SUPPLY_MODE_OPTIONS}
                value={field.value}
                onChange={(value) => field.onChange({ target: { value } })}
              />
            )}
          />
        </InputWrapper>
        <div
          className={classNames({ hidden: supplyModeWatch === "unlimited" })}
        >
          <InputWrapper
            label="Supply"
            description="Total supply for collection"
          >
            <input
              className="input input-bordered w-full"
              type="number"
              {...register("maxSupply")}
            ></input>
          </InputWrapper>
        </div>
        <InputWrapper
          label="Mint Stages"
          description="Configure the mint stages for your collection"
        >
          <MintStagesInput
            mintStages={mintStages}
            setMintStages={setMintStages}
          />
        </InputWrapper>
      </AdminForm>
    </AdminLayout>
  );
};
