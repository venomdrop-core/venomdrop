import BigNumber from "bignumber.js";


export const fromNano = (amount: number | string): string => new BigNumber(amount).shiftedBy(-9).toFixed(2);
