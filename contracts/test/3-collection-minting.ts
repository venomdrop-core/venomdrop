import { Contract, Signer, toNano } from "locklift";
import { FactorySource } from "../build/factorySource";
import { createAccounts, deployVenomCollection, setOngoingMintStages, setOutdatedMintStages } from "./utils";
import { Account } from "everscale-standalone-client";
import { expect } from "chai";

describe('VenomDropCollection: minting', async () => {
  let collection: Contract<FactorySource["VenomDropCollection"]>;
  let signers: Signer[];
  let accounts: Account[];
  // Owner
  let ownerSigner: Signer;
  let owner: Account;
  before(async () => {
    ({ signers, accounts } = await createAccounts(0, 3));
    [ownerSigner] = signers;
    [owner] = accounts;
    collection = await deployVenomCollection(3, ownerSigner, owner.address);
  });

  describe('mint', () => {
    it('should revert if there is no current mint stage', async () => {
      await setOutdatedMintStages(collection, owner.address);
      const { traceTree } = await locklift.tracing.trace(
        collection.methods.mint({ amount: 1, proof: [] }).send({ from: owner.address, amount: toNano(8) }),
        {
          allowedCodes: {
            compute: [1030],
          },
        }
      );
      await expect(traceTree).to.have.error(1030);
    });

    it('should mint NFT properly if there is a mint stage', async () => {
      await setOngoingMintStages(collection, owner.address);
      const { traceTree } = await locklift.tracing.trace(
        collection.methods.mint({ amount: 1, proof: [] }).send({ from: owner.address, amount: toNano(8) }),
        {
          allowedCodes: {
            compute: [1030],
          },
        }
      );
      await expect(traceTree).to.not.have.error(1030);
    });
  });
})
