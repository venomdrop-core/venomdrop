import React, { FC, useMemo } from "react";
import { MintStagesTimeline } from "./MintStagesTimeline";
import { useCollectionInfo } from "../hooks/useCollectionInfo";
import { unixToDate } from "../utils/dates";

export interface CollectionMintStagesTimelineProps {
  slug?: string;
}

export const CollectionMintStagesTimeline: FC<
  CollectionMintStagesTimelineProps
> = ({ slug }) => {
  const { data: info } = useCollectionInfo(slug);
  const mintStages = useMemo(() => {
    if (!info) {
      return [];
    }
    return info.mintStages.map((m) => ({
      startTime: unixToDate(m.startTime),
      endTime: unixToDate(m.endTime),
      name: "Name Test",
      price: m.price,
      type: "public" as any,
    }));
  }, [info]);
  return <MintStagesTimeline mintStages={mintStages} />;
};
