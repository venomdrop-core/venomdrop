import { MintStage } from "../types/mintStage";
import { unixToDate } from "./dates";

type ContractMintStage = {
  name: string;
  price: string;
  startTime: string;
  endTime: string;
  merkleTreeRoot: string;
}

export const parseContractMintStage = (contractMintStage: ContractMintStage): MintStage => ({
  name: contractMintStage.name,
  price: contractMintStage.price,
  startTime: unixToDate(contractMintStage.startTime),
  endTime: unixToDate(contractMintStage.endTime),
  type: parseInt(contractMintStage.merkleTreeRoot) === 0 ? 'PUBLIC': 'ALLOWLIST',
});
