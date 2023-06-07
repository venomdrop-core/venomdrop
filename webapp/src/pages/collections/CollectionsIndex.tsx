import React, { FC, useState } from "react";
import { MainLayout } from "../../layouts/MainLayout";
import { CreateCollectionModal } from "../../components/CreateCollectionModal";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useCollections } from "../../hooks/useCollections";
import { useVenomWallet } from "../../hooks/useVenomWallet";
import { CollectionListingCard } from "../../components/CollectionListingCard";

export interface CollectionsIndexProps {}

export const CollectionsIndex: FC<CollectionsIndexProps> = (props) => {
  const { address } = useVenomWallet();
  const { data: collections } = useCollections({ owner: address, publishStatus: ['PUBLISHED', 'DRAFT'] }, { limit: 50, skip: 0 }, { enabled: !!address });
  const [showCreateModal, setShowCreateModal] = useState(false);
  return (
    <MainLayout authRequired>
      <div className="container mx-auto mt-24">
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <h1 className="text-2xl">My Collections</h1>
            <p className="mt-4 text-lg">
              Create and manage VenomDrop collections
            </p>
          </div>
          <div>
            <button
              className="btn btn-primary mt-4 md:mt-0"
              onClick={() => setShowCreateModal(true)}
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Create Collection
            </button>
          </div>
        </div>

        {collections && collections?.length > 0 ? (
          <div className="mt-8">
            <div className="grid grid-cols-4 gap-8">
              {(collections || []).map((collection) => (
                <div>
                  <CollectionListingCard collection={collection} showPublishStatus linkToAdmin />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="border border-dashed border-base-100 p-24 text-center rounded-md text-gray-500 mt-16">
            You have no collections yet
          </div>
        )}
      </div>
      <CreateCollectionModal
        open={showCreateModal}
        setOpen={setShowCreateModal}
      />
    </MainLayout>
  );
};
