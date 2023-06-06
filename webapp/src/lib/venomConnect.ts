import { VenomConnect } from 'venom-connect';
import { ProviderRpcClient } from 'everscale-inpage-provider';
import { EverscaleStandaloneClient } from 'everscale-standalone-client';


const NETWORK_CONFIG: {
  [key: string]: any
} = {
  local: {
    networkId: 0,
  },
  devnet: {
    networkId: 1002,
    fallback: () => EverscaleStandaloneClient.create({
      connection: {
        id: 1002,
        type: 'jrpc',
        data: {
          endpoint: 'https://jrpc-devnet.venom.foundation',
        },
      },
      initInput: '../../node_modules/nekoton-wasm/nekoton_wasm_bg.wasm',
    })
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
