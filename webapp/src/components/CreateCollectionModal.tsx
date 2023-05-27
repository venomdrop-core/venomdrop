/* eslint-disable react-hooks/rules-of-hooks */

import { FC, useMemo } from 'react'
import { Modal, ModalProps } from './Modal'
import { useVenomWallet } from '../hooks/useVenomWallet'
import { abi } from '../contracts/abi';
import { getRandomNonce } from '../utils/getRandomNonce';
import { toNano } from '../utils/toNano';
import { Address } from 'everscale-inpage-provider';

const FACTORY_ADDRESS = import.meta.env.VITE_VENOMDROP_COLLECTION_FACTORY_ADDRESS;

export const CreateCollectionModal: FC<ModalProps> = (props) => {
  const { venomProvider, accountInteraction } = useVenomWallet();
  const factory = useMemo(() => {
    return venomProvider ? new venomProvider.Contract(abi.VenomDropCollectionFactory, FACTORY_ADDRESS): null;
  }, [venomProvider]);

  const deploy = async (): Promise<Address> => {
    return new Promise((resolve, reject) => {
      if (!accountInteraction || !venomProvider || !factory) {
        throw new Error('Wallet not connected');
      }
      // Subscribe for the factory events
      const sub = new venomProvider.Subscriber();
      const events = factory.events(sub);
      events.on(event => {
        if (event.event === 'VenomDropCollectionDeployed' && event.data.creator.equals(accountInteraction.address)) {
          sub.unsubscribe();
          resolve(event.data.collection);
        }
      });
  
      factory.methods.deployCollection({
        id: getRandomNonce(),
        owner: accountInteraction.address,
      }).send({
        from: accountInteraction.address,
        amount: toNano('6'),
      }).then((txn) => {
        if (txn.aborted) {
          sub.unsubscribe();
          reject(new Error('Deployment transaction aborted'));
        }
      })
      setTimeout(() => {
        sub.unsubscribe();
        reject(new Error('Could not retrieve the deployed contract'));
      }, 30000);
    });
  };

  const createCollection = async () => {
    if (!accountInteraction || !venomProvider) {
      throw new Error('Wallet not connected');
    }
    const collectionAddress = await deploy();
    console.log({ collectionAddress });
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
