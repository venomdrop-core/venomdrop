import React, { FC, useEffect, useRef } from 'react'
import { Collection } from '../api/collections'
import { Link } from 'react-router-dom';
// const DEFAU

export interface CollectionListingCardProps {
  collection: Collection;
}

export const CollectionListingCard: FC<CollectionListingCardProps> = ({ collection }) => {
  const {
    slug,
    coverImageSrc,
  } = collection;
  const backgroundUrl = coverImageSrc;
  const backgroundImage = backgroundUrl ? `linear-gradient(rgba(0, 0, 0, 0.60) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.60) 100%), url(${backgroundUrl})`: '';
  return (
    <Link to={`/collections/${slug}`}>
      <div className="w-full bg-slate-950">
        <div className="w-full h-48 bg-cover bg-center bg-slate-950 rounded-t-lg" style={{ backgroundImage }} />
        <div className="p-8 border-t border-t-slate-900">
          <div className="font-bold text-gray-200">
            {collection.name}
          </div>
        </div>
      </div>
    </Link>
  )
}
