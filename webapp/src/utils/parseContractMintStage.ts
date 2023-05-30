import { MintStage } from "../types/mintStage";
import { unixToDate } from "./dates";

type ContractMintStage = {
  price: string;
  startTime: string;
  endTime: string;
}

export const parseContractMintStage = (contractMintStage: ContractMintStage): MintStage => ({
  name: 'My Stage Test', //FIXME: add name field from contract
  price: contractMintStage.price,
  startTime: unixToDate(contractMintStage.startTime),
  endTime: unixToDate(contractMintStage.endTime),
  type: 'public', // FIXME: add allowlist when enabled
});
