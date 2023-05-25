import React, { FC } from 'react'
import { MainLayout } from '../../layouts/MainLayout'
import { RequiredAuth } from '../../components/RequiredAuth'

export interface CollectionsIndexProps {
  
}

export const CollectionsIndex: FC<CollectionsIndexProps> = (props) => {
  return (
    <MainLayout>
      <RequiredAuth>
        Hello World
      </RequiredAuth>
    </MainLayout>
  )
}
