import { VenomConnect } from 'venom-connect';
import { EverscaleStandaloneClient } from '@strandgeek/everscale-standalone-client';
import { ProviderRpcClient } from 'everscale-inpage-provider';


export const createEverscaleStandaloneClient = () => {
  return EverscaleStandaloneClient.create({
    connection: {
      id: 1002,
      type: 'jrpc',
      data: {
        endpoint: 'https://jrpc-devnet.venom.foundation',
      },
    },
    initInput: '/nekoton_wasm_bg.wasm',
  })
}

const NETWORK_CONFIG: {
  [key: string]: any
} = {
  local: {
    networkId: 0,
  },
  devnet: {
    networkId: 1002,
    fallback: () => createEverscaleStandaloneClient(),
  }
}


export const initVenomConnect = async () => {
  const network = NETWORK_CONFIG[import.meta.env.VITE_VENOM_NETWORK];
  return new VenomConnect({
    theme: 'dark',
    checkNetworkId: network.networkId,
    providersOptions: {
      venomwallet: {
        walletWaysToConnect: [
          {
            package: ProviderRpcClient,

            packageOptions: {
              fallback: VenomConnect.getPromise('venomwallet', 'extension') || (() => Promise.reject()),
              forceUseFallback: true,
            },
            packageOptionsStandalone: {
              fallback: network.fallback,
              forceUseFallback: true,
            },

            id: 'extension',
            type: 'extension',
          },
        ],
        defaultWalletWaysToConnect: [
          'mobile',
          'ios',
          'android',
        ],
      },
    },
  });
};
