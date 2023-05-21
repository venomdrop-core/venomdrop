import { expect } from "chai";
import { Contract, Signer, WalletTypes, fromNano, toNano } from "locklift";
import { FactorySource } from "../build/factorySource";
import { CreateAccountOutput } from "locklift/types";


describe("Test Collection contract", async function () {
  let collection: Contract<FactorySource["Collection"]>;
  let ownerSigner: Signer;
  let minterSigner: Signer;
  let owner: CreateAccountOutput['account'];
  let minter: CreateAccountOutput['account'];
  before(async () => {
    ownerSigner = (await locklift.keystore.getSigner("0"))!;
    minterSigner = (await locklift.keystore.getSigner("1"))!;

    // Owner Account
    ({ account: owner } = await locklift.factory.accounts.addNewAccount({
      type: WalletTypes.EverWallet,
      value: toNano(100000),
      publicKey: ownerSigner.publicKey,
    }));

    // Minter Account
    ({ account: minter } = await locklift.factory.accounts.addNewAccount({
      type: WalletTypes.EverWallet,
      value: toNano(100000),
      publicKey: minterSigner.publicKey,
    }));
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
        publicKey: ownerSigner.publicKey,
        initParams: {},
        constructorParams: {
          codeNft: nftArtifacts.code,
          owner: owner.address,
          allowedVenomDrops: [],
        },
        value: locklift.utils.toNano(20),
      }));

      expect(await locklift.provider.getBalance(collection.address).then(balance => Number(balance))).to.be.above(0);
    });

    // TODO: Add the mint tests from the VenomDrop
    // it("Mint NFT", async function () {
    // const { account } = await locklift.factory.accounts.addNewAccount({
    //   type: WalletTypes.EverWallet,
    //   value: toNano(100000),
    //   publicKey: signer.publicKey,
    // });
    //   await locklift.transactions.waitFinalized(
    //     collection.methods.mintNft().send({ from: account.address, amount: toNano(6) }),
    //   );
    //   const supplyRes = await collection.methods.totalSupply({ answerId: 0 }).call({});
    //   expect(BigInt(supplyRes.count)).to.be.equal(1n);
    // });

    describe('setMaxSupply', () => {
      it('should set the max supply properly as owner', async () => {
        await locklift.transactions.waitFinalized(
          collection.methods.setMaxSupply({
            maxSupply: 12345,
          }).send({ from: owner.address, amount: toNano(6) })
        );
        expect(BigInt((await collection.methods.getMaxSupply().call()).maxSupply)).to.be.equal(12345n);
      });
      it('should revert if user is not owner', async () => {
        const { traceTree } = await locklift.tracing.trace(
          collection.methods.setMaxSupply({
            maxSupply: 12345,
          }).send({ from: minter.address, amount: toNano(6) }),
          {
            allowedCodes: {
              compute: [1000],
            },
          }
        );
        await expect(traceTree).to.have.error(1000);
      });
    })
  });
});
