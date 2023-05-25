import React, { FC } from 'react'
import { Modal } from './Modal';
import VenomDropSrc from '../assets/venomdrop-logo.svg';
import { completeAuth, createNonce } from '../api/auth';
import { useMutation } from '@tanstack/react-query';
import { useVenomWallet } from '../hooks/useVenomWallet';
import { generateAuthMessage } from '../utils/generateAuthMessage';
import { Base64 } from 'js-base64'

export interface RequiredAuthProps {
  children: React.ReactNode;
}

export const RequiredAuth: FC<RequiredAuthProps> = ({ children }) => {
  const { accountInteraction, venomProvider } = useVenomWallet()
  
  accountInteraction?.contractType;

  const createNonceMutation = useMutation({
    mutationFn: createNonce,
  });

  const completeAuthMutation = useMutation({
    mutationFn: completeAuth,
  });

  const auth = async () => {
    if (!accountInteraction) {
      // TODO: Handle better if the wallet is not connected at this point
      return;
    }
    const { contractType, publicKey } = accountInteraction;
    const address = accountInteraction.address.toString();

    // Create Nonce
    const { nonce } = await createNonceMutation.mutateAsync({
      address: address.toString(),
      contractType,
      publicKey,
    });

    const message = generateAuthMessage(address, nonce);
    const signed = await venomProvider?.signDataRaw({
      data: Base64.encode(message),
      publicKey: accountInteraction?.publicKey,
      withSignatureId: false,
    });
    if (!signed || !signed?.signature || !signed.signatureHex) {
      alert('Not signed!!');
      return;
    }
    const res = await completeAuthMutation.mutateAsync({
      nonce,
      signedMessage: signed.signature,
    });

    // TODO: Get from res the JWT and store in localStorage
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
