import React, { FC, useMemo } from "react";
import { useCollection } from "../../hooks/useCollection";
import { useParams } from "react-router-dom";
import { Topbar } from "../../layouts/MainLayout/components/Topbar";
import { CollectionMintStagesTimeline } from "../../components/CollectionMintStagesTimeline";
import { MintBox } from "../../components/MintBox";
import { useCurrentMintStage } from "../../hooks/useCollectionCurrentMintStage";
import { MintStagesTimeline } from "../../components/MintStagesTimeline";
import { useCollectionInfo } from "../../hooks/useCollectionInfo";
import { parseContractMintStage } from "../../utils/parseContractMintStage";
import { unixToDate } from "../../utils/dates";

export interface CollectionMintPageProps {}

export const CollectionMintPage: FC<CollectionMintPageProps> = (props) => {
  const { slug } = useParams();
  const { data: info } = useCollectionInfo(slug);
  const { data: collection } = useCollection(slug);
  const currentMintStage = useMemo(() => {
    const now = new Date();
    const contractMintStage = (info?.mintStages || []).find(ms => {
      return now > unixToDate(ms.startTime) && now < unixToDate(ms.endTime);
    });
    if (!contractMintStage) {
      return null;
    }
    return parseContractMintStage(contractMintStage);
  }, [info]);
  const aboutText = collection?.description.replaceAll("\n", "<br />") || "";
  const mintStages = (info?.mintStages || []).map(parseContractMintStage);
  return (
    <div className="w-screen h-screen overflow-y-scroll bg-slate-950">
      <div className="w-full h-[600px] relative">
        <div
          className="w-full h-full absolute bg-cover bg-center"
          style={{ backgroundImage: `url(${collection?.coverImageSrc})` }}
        />
        <div className="mint-page-cover-background" />
        <div className="absolute z-40 w-full">
          <Topbar />
        </div>
        <div className="w-full h-full absolute flex flex-col justify-end">
          <div className="mint-page-cover" />
          <div className="container mx-auto py-8">
            <div>
              <img
                src={collection?.logoImageSrc}
                className="w-32 h-32 rounded-lg border-4 border-gray-100"
              />
            </div>
            <h1 className="py-8 text-4xl font-semibold text-white">
              {collection?.name}
            </h1>
            <div className="inline-flex items-center bg-[rgba(0,0,0,0.25)] p-4 rounded-lg">
              <span className="relative flex h-3 w-3 mr-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <div className="font-bold">
                Minting now
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto mt-24">
        <div className="grid grid-cols-2 gap-16">
          <div>
            <div>
              <h2 className="text-gray-100 text-3xl">Schedule</h2>
              <div className="mt-16 ">
                {/* <CollectionMintStagesTimeline slug={slug} /> */}
                <MintStagesTimeline mintStages={mintStages} />
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-gray-100 text-3xl">Mint</h2>
            <div className="mt-16">
              <MintBox currentMintStage={currentMintStage} mintStages={mintStages} info={info} />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-16 mt-24">
          <div>
            <div>
              <h2 className="text-gray-100 text-3xl">About</h2>
              <div
                className="prose prose-lg w-full max-w-full mt-8 text-justify"
                dangerouslySetInnerHTML={{ __html: aboutText }}
              />
            </div>
          </div>
          <div>
            <h2 className="text-gray-100 text-3xl">About</h2>
            <div
              className="prose prose-lg w-full max-w-full mt-8 text-justify"
              dangerouslySetInnerHTML={{ __html: aboutText }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
