import React, { FC } from 'react'
import { Topbar } from './components/Topbar'

export interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="bg-slate-900 h-screen w-screen">
      <Topbar />
      {children}
    </div>
  )
}
