import { api } from "../lib/api"

export const createNonce = async ({ address}: { address: string }): Promise<{ nonce: string; }> => {
  const { data } = await api.post('/auth/nonce', { address });
  return data;
} 
