import React, { FC, useEffect } from 'react'
import { Topbar } from '../../components/Topbar'
import { AuthRequired } from '../../components/AuthRequired';
import { Footer } from '../../components/Footer';

export interface MainLayoutProps {
  children: React.ReactNode;
  authRequired?: boolean;
  title?: string;
}

export const MainLayout: FC<MainLayoutProps> = ({ children, authRequired, title }) => {
  useEffect(() => {
    document.title = title || 'VenomDrop';
  }, [title]);
  return (
    <div className="bg-slate-900 h-screen w-screen overflow-y-auto min-h-screen">
      <div className="flex-shrink-0">
        <Topbar />
      </div>
      {authRequired ? <AuthRequired>{children}</AuthRequired>: children}
      <div className="mt-auto pt-8">
        <Footer />
      </div>
    </div>
  )
}
