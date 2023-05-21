import { expect } from "chai";
import { Account } from "everscale-standalone-client/client";
import { Address, Signer, WalletTypes, toNano } from "locklift";

export const deployVenomCollection = async (_id: number, signer: Signer, ownerAddress: Address) => {
  const nftArtifacts = locklift.factory.getContractArtifacts("Nft");
  const { contract: collection } = await locklift.factory.deployContract({
    contract: "VenomDropCollection",
    publicKey: signer.publicKey,
    initParams: {
      _id,
    },
    constructorParams: {
      codeNft: nftArtifacts.code,
      owner: ownerAddress,
    },
    value: locklift.utils.toNano(20),
  });

  expect(await locklift.provider.getBalance(collection.address).then(balance => Number(balance))).to.be.above(0);
  return collection;
}


export const createAccounts = async (fromId: number, toId: number): Promise<{ accounts: Account[], signers: Signer[]}> => {
  const signers: Signer[] = [];
  const accounts: Account[] = [];
  for (let i=fromId; i<=toId; i++) {
    const signer = (await locklift.keystore.getSigner(i.toString()))!;
    signers.push(signer);
    const { account } = await locklift.factory.accounts.addNewAccount({
      type: WalletTypes.EverWallet,
      value: toNano(100000),
      publicKey: signer.publicKey,
    });
    accounts.push(account);
  }
  return {
    signers,
    accounts,
  }
}
