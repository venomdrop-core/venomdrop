import React, { FC, useState } from 'react'
import { Modal } from './Modal';
import VenomDropSrc from '../assets/venomdrop-logo.svg';
import { completeAuth, createNonce } from '../api/auth';
import { useMutation } from '@tanstack/react-query';
import { useVenomWallet } from '../hooks/useVenomWallet';
import { generateAuthMessage } from '../utils/generateAuthMessage';
import { Base64 } from 'js-base64'
import { useMe } from '../hooks/useMe';
import classNames from 'classnames';

export interface RequiredAuthProps {
  children: React.ReactNode;
}

export const AuthRequired: FC<RequiredAuthProps> = ({ children }) => {
  const { accountInteraction, venomProvider } = useVenomWallet();
  const { data: me, refetch: refetchMe, isLoading: isMeLoading } = useMe();
  const [authIsLoading, setAuthIsLoading] = useState(false);
  
  accountInteraction?.contractType;

  const createNonceMutation = useMutation({
    mutationFn: createNonce,
  });

  const completeAuthMutation = useMutation({
    mutationFn: completeAuth,
  });

  const auth = async () => {
    setAuthIsLoading(true);
    try {
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
  
      localStorage.setItem('venomdrop-access-token', res.token);
      await refetchMe();
      setAuthIsLoading(false);
    } catch (error) {
      // TODO: Handle the error here
      console.log(error);
    }
  }

  return (
    <>
      {me && children}
      <Modal open={!me && !isMeLoading} setOpen={() => ({})}>
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
            <button onClick={() => auth()} className={classNames("btn btn-primary", { loading: authIsLoading })}>
              Accept & Sign
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
