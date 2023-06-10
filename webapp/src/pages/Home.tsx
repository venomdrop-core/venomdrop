import { FC } from "react";
import { MainLayout } from "../layouts/MainLayout";
import { useCollection } from "../hooks/useCollection";
import { FeaturedCollectionCard } from "../components/FeaturedCollectionCard";
import { CollectionListingCard } from "../components/CollectionListingCard";
import { useCollections } from "../hooks/useCollections";
import { Collection } from "../api/collections";

export interface HomeProps {}

export const Home: FC<HomeProps> = () => {
  const slug = "test4";
  const { data: collection } = useCollection(slug);
  const { data: collections } = useCollections();
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
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {((collections as Collection[]) || []).map((collection) => (
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
