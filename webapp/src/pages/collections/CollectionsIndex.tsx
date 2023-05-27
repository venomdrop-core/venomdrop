import React, { FC } from 'react'
import { MainLayout } from '../../layouts/MainLayout';
import { CreateCollectionModal } from '../../components/CreateCollectionModal';

export interface CollectionsIndexProps {
  
}

export const CollectionsIndex: FC<CollectionsIndexProps> = (props) => {
  return (
    <MainLayout>
      <CreateCollectionModal open setOpen={() => ({})} />
    </MainLayout>
  )
}
