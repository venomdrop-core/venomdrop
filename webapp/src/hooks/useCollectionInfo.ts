import { useQuery } from "@tanstack/react-query";
import { useCollectionContract } from "./useCollectionContract";

export const useCollectionInfo = (slug?: string) => {
  const contract = useCollectionContract(slug);
  return useQuery({
    queryKey: ['contractInfo', slug],
    queryFn: async () => {
      const { info } = await contract!.methods.getInfo().call();
      return info;
    },
    enabled: !!contract,
  });
}
