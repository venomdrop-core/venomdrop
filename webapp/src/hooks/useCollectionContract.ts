import { useCollection } from "./useCollection";
import { useVenomWallet } from "./useVenomWallet";
import { abi } from "../contracts/abi";
import { Address } from "everscale-inpage-provider";
import { useMemo } from "react";

export const useCollectionContract = (slug?: string) => {
  const { venomProvider } = useVenomWallet();
  const { data: collection } = useCollection(slug);
  return useMemo(() => {
    if (!venomProvider || !collection) {
      return null;
    }
    return new venomProvider.Contract(abi.VenomDropCollection, new Address(collection.contractAddress || ''));
  }, [venomProvider, collection]);
};
