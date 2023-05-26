import React, { FC } from 'react'
import { MainLayout } from '../../layouts/MainLayout'
import { AuthRequired } from '../../components/AuthRequired'

export interface CollectionsIndexProps {
  
}

export const CollectionsIndex: FC<CollectionsIndexProps> = (props) => {
  return (
    <MainLayout>
      <AuthRequired>
        Hello World
      </AuthRequired>
    </MainLayout>
  )
}
