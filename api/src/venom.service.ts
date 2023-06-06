import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { Address, ProviderRpcClient } from 'everscale-inpage-provider';
import {
  Account,
  ConnectionProperties,
  EverWalletAccount,
  EverscaleStandaloneClient,
  WalletV3Account,
} from 'everscale-standalone-client/nodejs';
import { abi } from './common/contracts/abi';

const ERROR_WALLET_CONTRACT_NOT_ACTIVE = 'Wallet Contract is not active';
const COULD_NOT_VALIDATE_WALLET = 'Could not validate wallet';

const getConnectionConfig = (): ConnectionProperties => {
  const { VENOM_NETWORK_TYPE } = process.env;
  if (VENOM_NETWORK_TYPE === 'local') {
    return 'local';
  }
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

const LOOKUP_WALLET_TYPES: {
  [type: string]: {
    fromPubkey(args: {
      publicKey: string;
      workchain?: number;
    }): Promise<Account>;
  };
} = {
  EverWallet: EverWalletAccount,
  WalletV3: WalletV3Account,
};

@Injectable()
export class VenomService extends ProviderRpcClient implements OnModuleInit {

  constructor() {
    super({
      fallback: () =>
        EverscaleStandaloneClient.create({
          connection: getConnectionConfig(),
        }),
    });
  }

  async onModuleInit() {
    await this.ensureInitialized();
  }

  async enableShutdownHooks() {
    this.disconnect();
  }

  async validCollectionContractForOwner(
    contractAddress: string,
    ownerAddress: string,
  ) {
    const collection = new this.Contract(
      abi.VenomDropCollection,
      new Address(contractAddress),
    );
    const { value0: owner } = await collection.methods.owner().call();
    // TODO: Validate if the contract also implements the VenomDropCollection interface (TIP-6)
    return owner.equals(ownerAddress);
  }

  /**
   * @notice Verify whether a wallet address matches the publicKey.
   *         This function was created for the auth flow process because
   *         as design, we need to authenticate the users using not only the
   *         publicKey but also identify the account address once this will be
   *         used as part of the NFTs Collections allowlists.
   *
   * @dev    Since on Venom an account can have a different contract type and
   *         not all Venom Wallets are deployed or active, this function combines
   *         two methods: Method 1 and Method 2.
   *
   *         Method 1 - Calculating the address from known wallet contract:
   *         When the wallet contract is known (like EverWallet or WalletV3)
   *         we calculate the address with the contract and the public key.
   *         If the calculated address matches the input address, returns true.
   *         This method covers most users once EverWallet and WalletV3 are being
   *         used on the Venom Wallet (Chrome Extension / App) and does not require
   *         a wallet to be deployed or active.
   *
   *         Method 2 - Fetching the public key from contract
   *         This method was created as fallback for the cases we don't know
   *         the contract type to calculate the public key. For that cases,
   *         we get the contract state boc, extract the public key and if that
   *         public key matches with the input public key, return true.
   *         NOTE: This method only works if the account contract is deployed and active.
   *
   * @param args.contractType The contract type EverWallet or WalletV3
   * @param args.publicKey The wallet public key
   * @param args.address The wallet address
   * @returns boolean
   */
  async verifyWalletAddressMatchesPublicKey({
    contractType,
    publicKey,
    address,
  }: {
    contractType: string;
    publicKey: string;
    address: string;
  }): Promise<boolean> {
    const wallet = LOOKUP_WALLET_TYPES[contractType];
    // Method 1: Calculate the contract address from contractType and publicKey
    // TODO: Handle other wallets here other than EverWallet and WalletV3
    if (wallet) {
      const acc = await wallet.fromPubkey({
        publicKey,
      });
      if (acc && acc.address) {
        return acc.address.equals(address);
      }
    }
    // Method 2 (Fallback): Get the publicKey from the contract address (only for active wallets)
    try {
      const fullContractState = await this.getFullContractState({
        address: new Address(address),
      });
      const _boc = fullContractState?.state?.boc;
      if (!_boc) {
        throw new InternalServerErrorException(
          ERROR_WALLET_CONTRACT_NOT_ACTIVE,
        );
      }
      const { publicKey: contractPublicKey } =
        await this.rawApi.extractPublicKey({
          boc: _boc,
        });
      return contractPublicKey === publicKey;
    } catch (error) {
      throw new InternalServerErrorException(COULD_NOT_VALIDATE_WALLET);
    }
  }
}
