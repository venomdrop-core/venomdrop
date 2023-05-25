import React, { FC } from 'react'
import { Modal } from './Modal';
import VenomDropSrc from '../assets/venomdrop-logo.svg';
import { createNonce } from '../api/auth';
import { useMutation } from '@tanstack/react-query';
import { useVenomWallet } from '../hooks/useVenomWallet';
import { generateAuthMessage } from '../utils/generateAuthMessage';
import { Base64 } from 'js-base64'

export interface RequiredAuthProps {
  children: React.ReactNode;
}

export const RequiredAuth: FC<RequiredAuthProps> = ({ children }) => {
  const { address, accountInteraction, venomProvider } = useVenomWallet();
  const createNonceMutation = useMutation({
    mutationFn: createNonce,
  });

  const auth = async () => {
    if (!address || !accountInteraction) {
      // TODO: Handle better if the wallet is not connected at this point
      return;
    }
    const { nonce } = await createNonceMutation.mutateAsync({
      address,
    });

    const message = generateAuthMessage(address, nonce);
    const signed = await venomProvider?.signDataRaw({
      data: Base64.encode(message),
      publicKey: accountInteraction?.publicKey,
      withSignatureId: false,
    });
    const { signature } = signed;
    // TODO: Send the signature to API to complete the authentication
  }
 

  return (
    <>
      {children}
      <Modal open={true} setOpen={() => ({})}>
        <div className="p-8">
          <div className="flex justify-center">
            <img src={VenomDropSrc} className="h-8" />
          </div>
          <div className="text-center mt-8 text-xl text-bold text-gray-100">
            Welcome to VenomDrop
          </div>
          <div className="text-center mt-2 text-gray-400">
            Create exciting airdrops and mint unique NFTs.
          </div>
          <div className="text-center mt-6">
            Sign in with Venom Wallet to authenticate on app. <br /><span>This request will not cost any gas fees.</span>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-10">
            <button className="btn">
              Cancel
            </button>
            <button className="btn btn-primary" onClick={() => auth()}>
              Accept & Sign
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
