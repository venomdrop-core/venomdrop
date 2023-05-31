import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { getCollections } from "../api/collections";
import { Page } from "../api/utils";

export const useCollections = (filter?: { owner?: string}, page: Page = { limit: 50, skip: 0 }, opts?: UseQueryOptions) => useQuery({
  queryKey: ["collections", page, filter],
  queryFn: () => getCollections(page, filter),
  ...opts,
});
