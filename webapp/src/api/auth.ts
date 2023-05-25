import { api } from "../lib/api"

export const createNonce = async (address: string): Promise<{ nonce: string; }> => {
  const { data } = await api.post('/auth/nonce', { address });
  return data;
} 
