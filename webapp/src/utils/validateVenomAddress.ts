const VENOM_ADDRESS_REGEX = /^0:[0-9a-f]{64}$/

export const validateVenomAddress = (addr: string) => {
  return VENOM_ADDRESS_REGEX.test(addr);
}
