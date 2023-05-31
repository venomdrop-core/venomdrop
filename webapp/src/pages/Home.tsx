import React, { FC, useMemo } from "react";
import { MainLayout } from "../layouts/MainLayout";
import { Link, useParams } from "react-router-dom";
import { useCollection } from "../hooks/useCollection";
import { useCollectionInfo } from "../hooks/useCollectionInfo";
import { unixToDate } from "../utils/dates";
import { parseContractMintStage } from "../utils/parseContractMintStage";
import { FeaturedCollectionCard } from "../components/FeaturedCollectionCard";

export interface HomeProps {}

export const Home: FC<HomeProps> = (props) => {
  const slug = 'my-collection-works';
  const { data: info } = useCollectionInfo(slug);
  const { data: collection } = useCollection(slug);
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
  return (
    <MainLayout>
      <div className="container mx-auto text-2xl my-2 text-gray-50 mt-8">
        <h2>
          Featured
        </h2>
      </div>
      <div className="container mx-auto rounded-3xl overflow-hidden">
        {collection && (
          <FeaturedCollectionCard collection={collection} />
        )}
      </div>
    </MainLayout>
  );
};
