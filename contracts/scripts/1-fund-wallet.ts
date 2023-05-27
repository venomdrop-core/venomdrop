import { Address } from "locklift";


/**
 * Script used to to fund a wallet for testing purpose
 */
async function main() {
  const address = '0:e39b3c712a8ff98ff154de73a25bca572189d5c7c958b28600c29cd7923247a4';
  const venomAmount = 5000;
  await locklift.giver.sendTo(new Address(address), String(venomAmount * 10**9))
  console.log(`Wallet ${address} funded successfully with ${venomAmount} VENOM`);
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.log(e);
    process.exit(1);
  });
