import BigNumber from "bignumber.js";


export const toNano = (amount: number | string): string => new BigNumber(amount).shiftedBy(9).toFixed(0);
