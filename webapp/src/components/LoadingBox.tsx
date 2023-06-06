import React, { FC } from 'react'
import { Spinner } from './Spinner';

export interface LoadingBoxProps {
  loading?: boolean;
  children: React.ReactNode;
}

export const LoadingBox: FC<LoadingBoxProps> = ({ loading, children }) => {
  if (!loading) {
    return (
      <>
        {children}
      </>
    );
  }
  return (
    <div className="flex items-center justify-center h-full">
      <Spinner />
    </div>
  );
}
