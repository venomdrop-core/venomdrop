import { useQuery } from "@tanstack/react-query";
import { getCollection } from "../api/collections";

export const useCollection = (slug?: string) =>
  useQuery({
    queryKey: ["collections", slug],
    queryFn: () => getCollection(slug || ""),
    enabled: !!slug,
  });
