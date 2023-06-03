import React, { FC, useMemo } from "react";
import { MainLayout } from "../layouts/MainLayout";
import { Link, useParams } from "react-router-dom";
import { useCollection } from "../hooks/useCollection";
import { useCollectionInfo } from "../hooks/useCollectionInfo";
import { unixToDate } from "../utils/dates";
import { parseContractMintStage } from "../utils/parseContractMintStage";
import { FeaturedCollectionCard } from "../components/FeaturedCollectionCard";
import { getCollections } from "../api/collections";
import { useQuery } from "@tanstack/react-query";
import { CollectionListingCard } from "../components/CollectionListingCard";
import { useCollections } from "../hooks/useCollections";

export interface HomeProps {}

export const Home: FC<HomeProps> = (props) => {
  const slug = "test2";
  const { data: info } = useCollectionInfo(slug);
  const { data: collection } = useCollection(slug);
  const { data: collections } = useCollections();
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
  console.log(collections);
  return (
    <MainLayout>
      <div className="container mx-auto my-2 text-gray-50 mt-8">
        <h2 className="text-3xl mb-8">Featured</h2>
      </div>
      <div className="container mx-auto rounded-3xl overflow-hidden">
        {collection && <FeaturedCollectionCard collection={collection} />}
      </div>
      <div className="container mx-auto my-2 text-gray-50 mt-24">
        <h2 className="text-3xl mb-8">Recent Collections</h2>
        <div className="mt-8">
          <div className="grid grid-cols-4 gap-8">
            {(collections || []).map((collection) => (
              <div>
                <CollectionListingCard collection={collection} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
