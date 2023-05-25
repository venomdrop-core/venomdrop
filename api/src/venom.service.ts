import { Injectable, OnModuleInit } from '@nestjs/common';
import { Address, ProviderRpcClient } from 'everscale-inpage-provider';
import { TonClient } from '@eversdk/core';
import { libNode } from '@eversdk/lib-node';
import {
  ConnectionProperties,
  EverscaleStandaloneClient,
} from 'everscale-standalone-client/nodejs';

TonClient.useBinaryLibrary(libNode);

const getConnectionConfig = (): ConnectionProperties => {
  const config: ConnectionProperties = {
    id: 1010,
    type: 'jrpc',
    data: {
      endpoint: 'https://jrpc-testnet.venom.foundation/rpc',
    },
  };
  const { VENOM_NETWORK_ID, VENOM_NETWORK_ENDPOINT } = process.env;
  if (VENOM_NETWORK_ID) {
    config.id = parseInt(VENOM_NETWORK_ID);
  }
  if (VENOM_NETWORK_ENDPOINT) {
    config.data.endpoint = VENOM_NETWORK_ENDPOINT;
  }
  return config;
};

@Injectable()
export class VenomService extends ProviderRpcClient implements OnModuleInit {
  public client: TonClient;

  constructor() {
    super({
      fallback: () =>
        EverscaleStandaloneClient.create({
          connection: getConnectionConfig(),
        }),
    });
    this.client = new TonClient();
  }

  async onModuleInit() {
    await this.ensureInitialized();
  }

  async enableShutdownHooks() {
    this.disconnect();
  }
}
