import { FC } from 'react'
import { Modal, ModalProps } from './Modal'
import { useVenomWallet } from '../hooks/useVenomWallet'

export const CreateCollectionModal: FC<ModalProps> = (props) => {
  const { venomProvider, accountInteraction } = useVenomWallet();

  const deploy = async () => {
    if (!accountInteraction || !venomProvider) {
      return;
    }

    // TODO: Call The Factory Here
  };
  return (
    <Modal {...props}>
      <div className="p-8">
        <button className="btn btn-primary btn-block" onClick={deploy}>
          Deploy Contract
        </button>
      </div>
    </Modal>
  )
}
