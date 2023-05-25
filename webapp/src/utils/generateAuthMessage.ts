// IMPORTANT Any change in this message should be reflected on API as well.

export const generateAuthMessage = (address: string, nonce: string) => `Welcome to VenomDrop!

Click to sign in to authenticate on VenomDrop.

This request will not trigger a blockchain transaction or cost any gas fees.

Your authentication session will expire after 24 hours.

Wallet address:
${address}

Nonce:
${nonce}
`;
