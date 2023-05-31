import { MintStage } from "../types/mintStage";
import { unixToDate } from "./dates";

type ContractMintStage = {
  name: string;
  price: string;
  startTime: string;
  endTime: string;
}

export const parseContractMintStage = (contractMintStage: ContractMintStage): MintStage => ({
  name: contractMintStage.name,
  price: contractMintStage.price,
  startTime: unixToDate(contractMintStage.startTime),
  endTime: unixToDate(contractMintStage.endTime),
  type: 'public', // FIXME: add allowlist when enabled
});
