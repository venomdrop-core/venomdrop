import React, { FC, useMemo } from "react";
import { Collection } from "../api/collections";
import { useCollection } from "../hooks/useCollection";
import { useCollectionInfo } from "../hooks/useCollectionInfo";
import { unixToDate } from "../utils/dates";
import { parseContractMintStage } from "../utils/parseContractMintStage";
import { Countdown } from "./Countdown";


export interface CollectionStatusBadgeProps {
  collection: Collection;
}

export const CollectionStatusBadge: FC<CollectionStatusBadgeProps> = ({
  collection,
}) => {
  const { slug } = collection;
  const { data: info } = useCollectionInfo(slug);
  const mintStages = (info?.mintStages || []).map(parseContractMintStage);
  const currentMintStage = useMemo(() => {
    const now = new Date();
    const contractMintStage = (info?.mintStages || []).find((ms) => {
      return now > unixToDate(ms.startTime) && now < unixToDate(ms.endTime);
    });
    if (!contractMintStage) {
      return null;
    }
    return parseContractMintStage(contractMintStage);
  }, [info]);
  const nextMintStage = useMemo(() => {
    const now = new Date();
    const nextMingStage = mintStages.findLast((ms) => ms.startTime > now);
    return nextMingStage;
  }, [mintStages]);
  console.log({ info });
  if (!currentMintStage && !nextMintStage) {
    return null;
  }
  return (
    <>
      {currentMintStage ? (
        <div className="inline-flex items-center bg-[rgba(0,0,0,0.25)] p-4 rounded-lg">
          <span className="relative flex h-3 w-3 mr-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <div className="font-bold">Minting now</div>
        </div>
      ) : (
        <Countdown date={nextMintStage?.startTime} />
      )}
    </>
  );
};
