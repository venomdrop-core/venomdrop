import { FC, useEffect, useMemo } from "react";
import { useCollection } from "../../hooks/useCollection";
import { useParams } from "react-router-dom";
import { Topbar } from "../../components/Topbar";
import { MintBox } from "../../components/MintBox";
import { MintStagesTimeline } from "../../components/MintStagesTimeline";
import { useCollectionInfo } from "../../hooks/useCollectionInfo";
import { parseContractMintStage } from "../../utils/parseContractMintStage";
import { unixToDate } from "../../utils/dates";
import { CollectionStatusBadge } from "../../components/CollectionStatusBadge";

export interface CollectionMintPageProps {}

export const CollectionMintPage: FC<CollectionMintPageProps> = () => {
  const { slug } = useParams();
  const { data: info } = useCollectionInfo(slug);
  const { data: collection } = useCollection(slug);
  useEffect(() => {
    if (collection) {
      document.title = `${collection?.name} - Drop Page`;
    }
  }, [collection]);
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
            {collection && <CollectionStatusBadge collection={collection} />}
          </div>
        </div>
      </div>

      {collection && collection.publishStatus === "DRAFT" && (
        <div className="w-full p-4 bg-yellow-600 text-center text-slate-800">
          <strong>Draft Mode:</strong> Only you (Collection Owner) can see this
          page
        </div>
      )}

      <div className="container mx-auto mt-24">
        <div className="grid grid-cols-2 gap-16">
          <div>
            <div>
              <h2 className="text-gray-100 text-3xl">Schedule</h2>
              <div className="mt-16 ">
                <MintStagesTimeline mintStages={mintStages} />
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-gray-100 text-3xl">Mint</h2>
            <div className="mt-16">
              <MintBox
                currentMintStage={currentMintStage}
                mintStages={mintStages}
                info={info}
              />
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
