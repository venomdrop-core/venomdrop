import { useQuery } from "@tanstack/react-query";
import { useCollectionContract } from "./useCollectionContract";

export const useCollectionInfo = (slug?: string) => {
  const contract = useCollectionContract(slug);
  return useQuery({
    queryKey: ['contractInfo', slug],
    queryFn: async () => {
      const { info } = await contract!.methods.getInfo().call();
      console.log(info);
      return info;
    },
    enabled: !!(contract && slug && contract.address),
  });
}
