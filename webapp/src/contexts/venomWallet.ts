import { createContext } from "react";


export interface VenomWalletContext {
  address?: string;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

export const venomWalletContext = createContext<VenomWalletContext>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  connect: async () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  disconnect: async () => {},
});
