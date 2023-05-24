import React, { FC } from 'react'
import { Topbar } from './components/Topbar'

export interface MainLayoutProps {
  
}

export const MainLayout: FC<MainLayoutProps> = (props) => {
  return (
    <div className="bg-slate-900 h-screen w-screen">
      <Topbar />
    </div>
  )
}
