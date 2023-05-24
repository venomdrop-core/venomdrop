import React, { FC, useEffect, useState } from 'react'
import { initVenomConnect } from '../lib/venomConnect';
import VenomConnect from 'venom-connect';
import { venomWalletContext } from '../contexts/venomWallet';
import { ProviderRpcClient } from 'everscale-inpage-provider';

export interface VenomWalletProviderProps {
  children: React.ReactNode;
}

export const VenomWalletProvider: FC<VenomWalletProviderProps> = ({ children }) => {
  const [venomConnect, setVenomConnect] = useState<VenomConnect | undefined>();
  const init = async () => {
    const _venomConnect = await initVenomConnect();
    setVenomConnect(_venomConnect);
  };
  useEffect(() => {
    init();
  }, []);
  const [venomProvider, setVenomProvider] = useState<ProviderRpcClient>();
  const [standaloneProvider, setStandAloneProvider] = useState<ProviderRpcClient | undefined>();
  const [address, setAddress] = useState<string>();
  // This method allows us to gen a wallet address from inpage provider
  const getAddress = async (provider: any) => {
    const providerState = await provider?.getProviderState?.();
    return providerState?.permissions.accountInteraction?.address.toString();
  };
  // Any interaction with venom-wallet (address fetching is included) needs to be authentificated
  const checkAuth = async (_venomConnect: VenomConnect) => {
    const auth = await _venomConnect?.checkAuth();
    if (auth) await getAddress(_venomConnect);
  };
  // Method for getting a standalone provider from venomConnect instance
  const initStandalone = async () => {
    const standalone = await venomConnect?.getStandalone();
    setStandAloneProvider(standalone);
  };
  // When our provider is ready, we need to get the address
  const onProviderReady = async (provider: ProviderRpcClient) => {
    const venomWalletAddress = provider ? await getAddress(provider) : undefined;
    setAddress(venomWalletAddress);
  };
  useEffect(() => {
    // connect event handler
    const off = venomConnect?.on('connect', async (provider: ProviderRpcClient) => {
      setVenomProvider(provider);
      await onProviderReady(provider);
    });
    if (venomConnect) {
      initStandalone();
      checkAuth(venomConnect);
    }
    // just an empty callback, cuz we don't need it
    return () => {
      off?.();
    };
  }, [venomConnect]);


  const connect = async () => {
    if (!venomConnect) return;
    await venomConnect.connect();
  };

  const disconnect = async () => {
    venomProvider?.disconnect();
    setAddress(undefined);
  };

  return (
    <venomWalletContext.Provider value={{ connect, disconnect, address }}>
      {children}
    </venomWalletContext.Provider>
  )
}
