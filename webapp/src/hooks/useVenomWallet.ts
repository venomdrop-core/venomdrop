import { useContext } from "react";
import { venomWalletContext } from "../contexts/venomWallet";

export const useVenomWallet = () => useContext(venomWalletContext);
