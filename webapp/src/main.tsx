import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from 'react-router-dom'
import { router } from './router.tsx'
import { VenomWalletProvider } from './providers/VenomWalletProvider.tsx'
import './index.css'


export const queryClient = new QueryClient();


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
  <QueryClientProvider client={queryClient}>
    <VenomWalletProvider>
      <RouterProvider router={router} />
    </VenomWalletProvider>
  </QueryClientProvider>
  </React.StrictMode>,
)
