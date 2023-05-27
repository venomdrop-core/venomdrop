
import { FC } from 'react'
import { Modal, ModalProps } from './Modal'
import { useVenomWallet } from '../hooks/useVenomWallet'
import { abi } from '../contracts/abi';
import { getRandomNonce } from '../utils/getRandomNonce';
import { toNano } from '../utils/toNano';
import { Address } from 'everscale-inpage-provider';
import BigNumber from "bignumber.js";

export const CreateCollectionModal: FC<ModalProps> = (props) => {
  const { venomProvider, accountInteraction } = useVenomWallet();

  const deploy = async (): Promise<Address> => {
    if (!accountInteraction || !venomProvider) {
      throw new Error('Wallet not connected');
    }
    const factoryAddr = import.meta.env.VITE_VENOMDROP_COLLECTION_FACTORY_ADDRESS;
    const factory = new venomProvider.Contract(abi.VenomDropCollectionFactory, factoryAddr);
    const tx = await factory.methods.deployCollection({
      id: getRandomNonce(),
      owner: accountInteraction.address,
    }).send({
      from: accountInteraction.address,
      amount: toNano('6'),
    });

    if (tx.outMessages.length === 0 || tx.outMessages[0].bounced) {
        throw new Error('Could not deploy the VenomDrop Collection contract');
    }

    const collectionAddress = tx.outMessages[0].dst as Address;
    const collectionBalance = await venomProvider.getBalance(collectionAddress);
    if (BigNumber(collectionBalance).eq(0)) {
      throw new Error('Looks like the contract was not deployed properly');
    }
    return collectionAddress;
  };

  const createCollection = async () => {
    const contractAddress = await deploy();
    console.log({ contractAddress });
    // TODO: Add form for collection and save alongside the contract address
    //       The the backend should verify whether the contract belongs to the logged user or not
  };




  return (
    <Modal {...props}>
      <div className="p-8">
        <button className="btn btn-primary btn-block" onClick={createCollection}>
          Create Collection
        </button>
      </div>
    </Modal>
  )
}
