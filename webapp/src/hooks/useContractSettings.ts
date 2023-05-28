import { useQuery } from "@tanstack/react-query";
import { Address, ProviderRpcClient } from "everscale-inpage-provider";
import { abi } from "../contracts/abi";
import { useVenomWallet } from "./useVenomWallet";

export const useContractSettings = (contractAddress?: string) => {
  const { venomProvider } = useVenomWallet();
  return useQuery({
    queryKey: ['contractSettings', contractAddress],
    queryFn: async () => {
      const contract = new venomProvider!.Contract(abi.VenomDropCollection, new Address(contractAddress || ''));
      const { maxSupply } = await contract.methods.getMaxSupply().call();
      const { mintStages } = await contract.methods.getMintStages().call();
      return {
        maxSupply,
        mintStages,
      };
    },
    enabled: !!(venomProvider && contractAddress),
  });
}
