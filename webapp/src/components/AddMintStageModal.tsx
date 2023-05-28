import React, { FC, useState } from "react";
import { Modal, ModalProps } from "./Modal";
import { MintStage } from "../types/mintStage";
import { InputWrapper } from "./InputWrapper";
import { VenomIcon } from "./icons/VenomIcon";
import Datepicker from "react-tailwindcss-datepicker";
import { DateRangeType } from "react-tailwindcss-datepicker/dist/types";
import { toNano } from "../utils/toNano";

export interface AddMintStageModalProps extends ModalProps {
  mintStages: MintStage[];
  setMintStages: React.Dispatch<React.SetStateAction<MintStage[]>>;
}

export const AddMintStageModal: FC<AddMintStageModalProps> = ({ setMintStages, mintStages, ...props }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [range, setRange] = useState<DateRangeType>({
    startDate: null,
    endDate: null,
  });
  const handleDatePickerChange = (newValue: DateRangeType) => {
    setRange(newValue);
  };
  const onAddClick = () => {
    const mintStage: MintStage = {
      name,
      startTime: range.startDate as Date,
      endTime: range.endDate as Date,
      type: 'public', // TODO: Make it dynamic when we implement the allowlist feature
      price: toNano(price),
    }
    setMintStages(mintStages => ([...mintStages, mintStage]))
    props.setOpen(false);
    setName('');
    setPrice('');
    setRange({
      startDate: null,
      endDate: null,
    })
  }
  return (
    <Modal {...props}>
      <div className="p-8">
        <InputWrapper
          label="Name"
          description="Give a name for this mint stage"
        >
          <input className="input input-bordered w-full" onChange={(e) => setName(e.target.value)} />
        </InputWrapper>
        <InputWrapper
          label="Price"
          description="Set the price per token for this stage"
        >
          <div className="relative">
            <VenomIcon className="w-4 h-4 absolute top-4 left-4" />
            <input className="input input-bordered w-full pl-11 text-lg" onChange={(e) => setPrice(e.target.value)} />
          </div>
        </InputWrapper>
        <InputWrapper
          label="Price"
          description="Set the price per token for this stage"
        >
          <Datepicker
            value={range}
            onChange={handleDatePickerChange as any}
            showShortcuts={true}
            primaryColor="violet"
            disabledDates={mintStages.map(m => ({ startDate: m.startTime, endDate: m.endTime }))}
            useRange={true}
            inputClassName="input w-full text-white"
          />
        </InputWrapper>
        <button className="btn btn-primary btn-block" onClick={() => onAddClick()}>
          Add Mint Stage
        </button>
      </div>
    </Modal>
  );
};
