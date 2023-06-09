import React, { FC, useState } from "react";
import { Modal, ModalProps } from "./Modal";
import { MintStage } from "../types/mintStage";
import { InputWrapper } from "./InputWrapper";
import { VenomIcon } from "./icons/VenomIcon";
import Datepicker from "react-tailwindcss-datepicker";
import { DateRangeType } from "react-tailwindcss-datepicker/dist/types";
import { toNano } from "../utils/toNano";
import { RadioGroupCards, Option } from "./RadioGroupCards";
import { AllowlistInput } from "./AllowlistInput";

export interface AddMintStageModalProps extends ModalProps {
  mintStages: MintStage[];
  setMintStages: React.Dispatch<React.SetStateAction<MintStage[]>>;
}

const INITIAL_MODE = "ALLOWLIST";

const STAGE_MODE_OPTIONS: Option[] = [
  {
    title: "Allowlist",
    value: "ALLOWLIST",
    description: "Allowed addresses only",
  },
  {
    title: "Public",
    value: "PUBLIC",
    description: "Anyone",
  },
];

type FormErrorMessages = {
  name?: string;
  price?: string;
  range?: string
};

export const AddMintStageModal: FC<AddMintStageModalProps> = ({
  setMintStages,
  mintStages,
  ...props
}) => {
  const [errorMessages, setErrorMessages] = useState<FormErrorMessages>({});
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [mode, setMode] = useState("ALLOWLIST");
  const [allowlist, setAllowlist] = useState<string[]>([]);
  const [range, setRange] = useState<DateRangeType>({
    startDate: null,
    endDate: null,
  });
  const handleDatePickerChange = (newValue: DateRangeType) => {
    setRange(newValue);
  };
  const setOpen: any = (open: boolean) => {
    // Reset Form
    setName("");
    setPrice("");
    setMode(INITIAL_MODE);
    setAllowlist([]);
    setRange({
      startDate: null,
      endDate: null,
    });
    props.setOpen(open);
  };
  const onAddClick = () => {
    const errorMessages: FormErrorMessages = {};
    if (name === '') {
      errorMessages.name = 'Name is a required field';
    }
    if (price === '' || isNaN(parseFloat(price))) {
      errorMessages.price = 'Invalid price';
    }
    if (range.startDate === null || range.endDate === null) {
      errorMessages.range = 'Please, select a start and end date';
    }

    setErrorMessages(errorMessages);

    if (Object.keys(errorMessages).length > 0) {
      return;
    }

    const mintStage: MintStage = {
      name,
      startTime: range.startDate as Date,
      endTime: range.endDate as Date,
      type: mode as "ALLOWLIST" | "PUBLIC",
      price: toNano(price),
      allowlist: mode === "ALLOWLIST" ? allowlist : [],
    };
    setMintStages((mintStages) => [...mintStages, mintStage]);
    setOpen(false);
    setName("");
    setPrice("");
    setRange({
      startDate: null,
      endDate: null,
    });
  };
  const addMintStageEnabled = (mode === "PUBLIC" || (mode === "ALLOWLIST" && allowlist.length > 0));
  return (
    <Modal open={props.open} setOpen={setOpen}>
      <div className="p-8">
        <InputWrapper
          label="Name"
          description="Give a name for this mint stage"
          error={errorMessages.name}
        >
          <input
            className="input input-bordered w-full"
            onChange={(e) => setName(e.target.value)}
          />
        </InputWrapper>
        <InputWrapper
          label="Price"
          description="Set the price per token for this stage"
          error={errorMessages.price}
        >
          <div className="relative">
            <VenomIcon className="w-4 h-4 absolute top-4 left-4" />
            <input
              className="input input-bordered w-full pl-11 text-lg"
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </InputWrapper>
        <InputWrapper
          label="Dates"
          description="Select the start and end date for this mint stage"
          error={errorMessages.range}
        >
          <Datepicker
            value={range}
            onChange={handleDatePickerChange as any}
            showShortcuts={true}
            primaryColor="violet"
            disabledDates={mintStages.map((m) => ({
              startDate: m.startTime,
              endDate: m.endTime,
            }))}
            useRange={true}
            inputClassName="input w-full text-white"
          />
        </InputWrapper>
        <InputWrapper
          label="Mode"
          description="Select whether mints will be restricted or public"
        >
          <RadioGroupCards
            options={STAGE_MODE_OPTIONS}
            onChange={setMode}
            value={mode}
          />
          {mode === "ALLOWLIST" && (
            <div className="mt-4">
              <AllowlistInput
                allowlist={allowlist}
                setAllowlist={(addresses) => setAllowlist(addresses)}
              />
            </div>
          )}
        </InputWrapper>
        <button
          className="btn btn-primary btn-block"
          onClick={() => onAddClick()}
          disabled={!addMintStageEnabled}
        >
          Add Mint Stage
        </button>
      </div>
    </Modal>
  );
};
