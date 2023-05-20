import { expect } from "chai";
import { Contract, Signer, WalletTypes, fromNano, toNano } from "locklift";
import { FactorySource } from "../build/factorySource";


describe("Test Collection contract", async function () {
  let collection: Contract<FactorySource["Collection"]>;
  let signer: Signer;
  before(async () => {
    signer = (await locklift.keystore.getSigner("0"))!;
  });
  describe("Contracts", async function () {
    it("Load contract factory", async function () {
      const collectionData = locklift.factory.getContractArtifacts("Collection");

      expect(collectionData.code).not.to.equal(undefined, "Code should be available");
      expect(collectionData.abi).not.to.equal(undefined, "ABI should be available");
      expect(collectionData.tvc).not.to.equal(undefined, "tvc should be available");
    });

    it("Deploy contract", async function () {
      const nftArtifacts = locklift.factory.getContractArtifacts("Nft");
      ({ contract: collection } = await locklift.factory.deployContract({
        contract: "Collection",
        publicKey: signer.publicKey,
        initParams: {},
        constructorParams: {
          codeNft: nftArtifacts.code,
        },
        value: locklift.utils.toNano(20),
      }));

      expect(await locklift.provider.getBalance(collection.address).then(balance => Number(balance))).to.be.above(0);
    });

    it("Mint NFT", async function () {
      const { account } = await locklift.factory.accounts.addNewAccount({
        type: WalletTypes.EverWallet,
        value: toNano(100000),
        publicKey: signer.publicKey,
      });
      await locklift.transactions.waitFinalized(
        collection.methods.mintNft().send({ from: account.address, amount: toNano(6) }),
      );
      const supplyRes = await collection.methods.totalSupply({ answerId: 0 }).call({});
      expect(BigInt(supplyRes.count)).to.be.equal(1n);
    });
  });
});
