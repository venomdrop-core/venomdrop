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
}): Promise<{ nonce: string; }> => {
  const { data } = await api.post('/auth/complete', { nonce, signedMessage });
  return data;
};
