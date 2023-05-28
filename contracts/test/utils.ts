import { expect } from "chai";
import { Account } from "everscale-standalone-client/client";
import { Address, Contract, Signer, WalletTypes, toNano } from "locklift";
import { FactorySource } from "../build/factorySource";

export const newTimestamp = (dateStr: string): number => {
  return new Date(dateStr).getTime() / 1000;
}

export const deployVenomCollection = async (_id: number, signer: Signer, ownerAddress: Address) => {
  const nftArtifacts = locklift.factory.getContractArtifacts("Nft");
  const { contract: collection } = await locklift.factory.deployContract({
    contract: "VenomDropCollection",
    publicKey: signer.publicKey,
    initParams: {
      _creator: ownerAddress,
      _id,
    },
    constructorParams: {
      codeNft: nftArtifacts.code,
      owner: ownerAddress,
    },
    value: locklift.utils.toNano(100),
  });

  expect(await locklift.provider.getBalance(collection.address).then(balance => Number(balance))).to.be.above(0);
  return collection;
}


export const createAccounts = async (fromId: number, toId: number): Promise<{ accounts: Account[], signers: Signer[] }> => {
  const signers: Signer[] = [];
  const accounts: Account[] = [];
  for (let i = fromId; i <= toId; i++) {
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


export const setOutdatedMintStages = async (collection: Contract<FactorySource["VenomDropCollection"]>, from: Address) => {
  await locklift.transactions.waitFinalized(collection.methods.setMintStages({
    mintStages: [
      {
        startTime: newTimestamp("2022-05-21 12:50:00"),
        endTime: newTimestamp("2022-05-22 12:50:00"),
        maxTotalMintableByWallet: 3,
        price: toNano(6),
      },
      {
        startTime: newTimestamp("2022-05-23 12:50:00"),
        endTime: newTimestamp("2022-05-24 12:50:00"),
        maxTotalMintableByWallet: 3,
        price: toNano(6),
      },
    ],
  }).send({ from, amount: toNano(6) }));
}

export const setOngoingMintStages = async (collection: Contract<FactorySource["VenomDropCollection"]>, from: Address) => {
  await locklift.transactions.waitFinalized(collection.methods.setMintStages({
    mintStages: [
      {
        startTime: 1, // The local node starts with block.timestamp=1
        endTime: newTimestamp("2099-01-01 00:00:00"),
        maxTotalMintableByWallet: 3,
        price: toNano(6),
      },
      {
        startTime: newTimestamp("2099-05-23 12:50:00"),
        endTime: newTimestamp("2099-05-24 12:50:00"),
        maxTotalMintableByWallet: 3,
        price: toNano(6),
      },
    ],
  }).send({ from, amount: toNano(6) }));
}
