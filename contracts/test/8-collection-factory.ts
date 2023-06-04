import { Contract, Signer, toNano } from "locklift";
import { FactorySource } from "../build/factorySource";
import { createAccounts } from "./utils";
import { Account } from "everscale-standalone-client";
import { expect } from "chai";

describe('VenomDropCollectionFactory: deploy a collection contract', async () => {
  let venomCollectionFactory: Contract<FactorySource["VenomDropCollectionFactory"]>;
  let signers: Signer[];
  let accounts: Account[];
  // Owner
  let ownerSigner: Signer;
  let owner: Account;
  before(async () => {
    const collectionArtifacts = locklift.factory.getContractArtifacts("VenomDropCollection");
    const nftArtifacts = locklift.factory.getContractArtifacts("Nft");
    ({ signers, accounts } = await createAccounts(0, 3));
    [ownerSigner] = signers;
    [owner] = accounts;
    ({ contract: venomCollectionFactory } = await locklift.factory.deployContract({
      contract: "VenomDropCollectionFactory",
      publicKey: ownerSigner.publicKey,
      initParams: {},
      constructorParams: {
        codeNft: nftArtifacts.code,
        codeCollection: collectionArtifacts.code,
      },
      value: locklift.utils.toNano(20),
    }));
  });

  describe("Contracts", async function () {
    it("Load contract factory", async function () {
      const collectionData = locklift.factory.getContractArtifacts("VenomDropCollection");

      expect(collectionData.code).not.to.equal(undefined, "Code should be available");
      expect(collectionData.abi).not.to.equal(undefined, "ABI should be available");
      expect(collectionData.tvc).not.to.equal(undefined, "tvc should be available");
    });

    it("Deploy contract", async function () {
      expect(await locklift.provider.getBalance(venomCollectionFactory.address).then(balance => Number(balance))).to.be.above(0);
    });

    it("Deploy a VenomCollection by calling the deployCollection", async function () {
      const { traceTree } = await locklift.tracing.trace(
        venomCollectionFactory.methods.deployCollection({
          id: locklift.utils.getRandomNonce(),
          owner: owner.address,
          initialMintJson: '',
        }).send({ from: owner.address, amount: toNano(6) })
      );

      expect(traceTree)
        .to.emit("VenomDropCollectionDeployed")
        .withNamedArgs({
          owner: owner.address,
        });

      const deployedEvent = traceTree?.findEventsForContract({
        contract: venomCollectionFactory,
        name: "VenomDropCollectionDeployed" as const,
      });

      // Check the balance of the new collection
      expect(deployedEvent).to.length(1);
      const collectionAddress = deployedEvent![0].collection;
      expect(await locklift.provider.getBalance(collectionAddress).then(balance => Number(balance))).to.be.above(0);
    });
  });
})
