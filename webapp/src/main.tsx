import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './router.tsx'
import { VenomWalletProvider } from './providers/VenomWalletProvider.tsx'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <VenomWalletProvider>
      <RouterProvider router={router} />
    </VenomWalletProvider>
  </React.StrictMode>,
)
