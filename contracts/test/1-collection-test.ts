import { expect } from "chai";
import { Contract, Signer, WalletTypes, toNano } from "locklift";
import { FactorySource } from "../build/factorySource";
import { isValidEverAddress } from "locklift/utils";


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
      await collection.methods.mintNft().sendExternal({ publicKey: signer.publicKey });
      const response = await collection.methods.nftAddress({answerId: 0, id: 0}).call();
      expect(isValidEverAddress(response.nft)).to.be.true;
    });
  });
});
