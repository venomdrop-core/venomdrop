import React, { FC, useEffect, useState } from "react";
import { initVenomConnect } from "../lib/venomConnect";
import VenomConnect from "venom-connect";
import {
  AccountInteraction,
  venomWalletContext,
} from "../contexts/venomWallet";
import { ProviderRpcClient } from "everscale-inpage-provider";
import { useQueryClient } from "@tanstack/react-query";

export interface VenomWalletProviderProps {
  children: React.ReactNode;
}

export const VenomWalletProvider: FC<VenomWalletProviderProps> = ({
  children,
}) => {
  const queryClient = useQueryClient();
  const [accountInteraction, setAccountInteraction] =
    useState<AccountInteraction>();
  const [venomConnect, setVenomConnect] = useState<VenomConnect | undefined>();
  const init = async () => {
    const _venomConnect = await initVenomConnect();
    setVenomConnect(_venomConnect);
  };
  useEffect(() => {
    init();
  }, []);
  const [venomProvider, setVenomProvider] = useState<ProviderRpcClient>();
  const [address, setAddress] = useState<string>();
  // This method allows us to gen a wallet address from inpage provider
  const getAccountInteraction = async (
    provider: any
  ): Promise<AccountInteraction> => {
    const providerState = await provider?.getProviderState?.();
    return providerState?.permissions.accountInteraction;
  };
  // Any interaction with venom-wallet (address fetching is included) needs to be authentificated
  const checkAuth = async (_venomConnect: VenomConnect) => {
    const auth = await _venomConnect?.checkAuth();
    if (auth) {
      const account = await getAccountInteraction(_venomConnect);
      return account?.address?.toString();
    }
  };
  // Method for getting a standalone provider from venomConnect instance
  const initStandalone = async () => {
    const standalone = await venomConnect?.getStandalone();
    setVenomProvider(standalone);
  };
  // When our provider is ready, we need to get the address
  const onProviderReady = async (provider: ProviderRpcClient) => {
    if (!provider) {
      return;
    }
    const accountInteraction = await getAccountInteraction(provider);
    setAccountInteraction(accountInteraction);
    setAddress(accountInteraction?.address?.toString());
  };
  useEffect(() => {
    // connect event handler
    const off = venomConnect?.on(
      "connect",
      async (provider: ProviderRpcClient) => {
        setVenomProvider(provider);
        await onProviderReady(provider);
      }
    );
    if (venomConnect) {
      initStandalone();
      checkAuth(venomConnect);
    }
    // just an empty callback, cuz we don't need it
    return () => {
      off?.();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [venomConnect]);

  const connect = async () => {
    if (!venomConnect) return;
    await venomConnect.connect();
  };

  const disconnect = async () => {
    venomProvider?.disconnect();
    setAddress(undefined);
    // In case there is a session with that wallet, clear it
    localStorage.removeItem("venomdrop-access-token");
    queryClient.invalidateQueries({ queryKey: ["me"] });
  };

  return (
    <venomWalletContext.Provider
      value={{
        connect,
        disconnect,
        address,
        accountInteraction,
        venomProvider,
      }}
    >
      {children}
    </venomWalletContext.Provider>
  );
};
