import { FC } from "react";
import { Collection } from "../api/collections";
import { Link } from "react-router-dom";

export interface CollectionListingCardProps {
  collection: Collection;
  showPublishStatus?: boolean;
  linkToAdmin?: boolean;
}

export const CollectionListingCard: FC<CollectionListingCardProps> = ({
  collection,
  showPublishStatus,
  linkToAdmin,
}) => {
  const { slug, coverImageSrc } = collection;
  const backgroundUrl = coverImageSrc;
  const backgroundImage = backgroundUrl
    ? `linear-gradient(rgba(0, 0, 0, 0.60) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.60) 100%), url(${backgroundUrl})`
    : "";
  return (
    <Link to={`/collections/${slug}${linkToAdmin ? "/edit/details" : ""}`}>
      <div className="w-full bg-slate-950">
        <div
          className="w-full h-48 bg-cover bg-center bg-slate-950 rounded-t-lg"
          style={{ backgroundImage }}
        >
          {showPublishStatus && (
            <div className="flex justify-end pt-4 pr-4">
              {collection.publishStatus === "PUBLISHED" && (
                <div className="bg-green-500 inline-block text-[10px] text-white  rounded-md px-2 py-1 mb-2">
                  PUBLISHED
                </div>
              )}
              {collection.publishStatus === "DRAFT" && (
                <div className="bg-yellow-500 inline-block text-[10px] text-white  rounded-md px-2 py-1 mb-2">
                  DRAFT
                </div>
              )}
            </div>
          )}
        </div>
        <div className="p-8 border-t border-t-slate-900">
          <div className="font-bold text-gray-200">{collection.name}</div>
        </div>
      </div>
    </Link>
  );
};
