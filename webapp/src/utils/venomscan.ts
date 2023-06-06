import { Address, Transaction } from "everscale-inpage-provider";

export const getTransactionUrl = (txnIdHash?: string): string => {
  return `${import.meta.env.VITE_VENOMSCAN_BASE_URL}/transactions/${txnIdHash}`;
}


export const getAddressUrl = (address?: string): string => {
  return `${import.meta.env.VITE_VENOMSCAN_BASE_URL}/accounts/${address}`;
}
