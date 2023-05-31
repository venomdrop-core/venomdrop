import React, { FC } from "react";
import { Link } from "react-router-dom";
import { Collection } from "../api/collections";
import { CollectionStatusBadge } from "./CollectionStatusBadge";

export interface FeaturedCollectionCardProps {
  collection: Collection
}

export const FeaturedCollectionCard: FC<FeaturedCollectionCardProps> = ({
  collection,
}) => {
  return (
    <Link to="/collections/my-collection-works">
      <div className="w-full h-[420px] relative ">
        <div
          className="w-full h-full absolute bg-cover bg-center rounded-3xl"
          style={{ backgroundImage: `url(${collection?.coverImageSrc})` }}
        />
        <div className="mint-page-cover-background rounded-3xl" />
        <div className="w-full h-full absolute flex flex-col justify-end">
          <div className="mint-page-cover" />
          <div className="px-24 py-8">
            <div>
              <img
                src={collection?.logoImageSrc}
                className="w-32 h-32 rounded-lg border-4 border-gray-100"
              />
            </div>
            <h1 className="py-8 text-4xl font-semibold text-white">
              {collection?.name}
            </h1>
              <CollectionStatusBadge collection={collection} />
          </div>
        </div>
      </div>
    </Link>
  );
};
