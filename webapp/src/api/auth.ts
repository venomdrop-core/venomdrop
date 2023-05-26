import { api } from "../lib/api"

export const createNonce = async ({
  address,
  contractType,
  publicKey
}: {
  address: string,
  contractType: string,
  publicKey: string
}): Promise<{ nonce: string; }> => {
  const { data } = await api.post('/auth/nonce', { address, contractType, publicKey });
  return data;
};

export const completeAuth = async ({
  nonce,
  signedMessage,
}: {
  nonce: string,
  signedMessage: string,
}): Promise<{ token: string; }> => {
  const { data } = await api.post('/auth/complete', { nonce, signedMessage });
  return data;
};

export const getMe = async (): Promise<{ id: string; account: string } | null > => {
  try {    
    const { data } = await api.get('/auth/me');
    return data;
  } catch (error) {
    return null;
  }
};
