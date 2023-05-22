import { Contract, Signer, toNano } from "locklift";
import { FactorySource } from "../build/factorySource";
import { createAccounts, deployVenomCollection } from "./utils";
import { Account } from "everscale-standalone-client";
import { expect } from "chai";


const newTimestamp = (dateStr: string): number => {
  return new Date(dateStr).getTime()/1000;
}

describe('VenomDropCollection: mint stages', async () => {
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
    collection = await deployVenomCollection(2, ownerSigner, owner.address);
  });

  describe('setMintStages', () => {
    describe('as owner', () => {
      it('should set the mint stages properly when the input is valid', async () => {
        await locklift.transactions.waitFinalized(
          collection.methods.setMintStages({
            mintStages: [
              {
                startTime: newTimestamp("2023-05-21 12:50:00"),
                endTime: newTimestamp("2023-05-22 12:50:00"),
                maxTotalMintableByWallet: 3,
                price: toNano(6),
              }
            ],
          }).send({ from: owner.address, amount: toNano(6)})
        );
        const { mintStages } = await collection.methods.getMintStages().call();
        expect(mintStages).to.have.lengthOf(1);
        const [stage] = mintStages;
        expect(stage.startTime).to.be.equal(newTimestamp("2023-05-21 12:50:00").toString());
        expect(stage.endTime).to.be.equal(newTimestamp("2023-05-22 12:50:00").toString());
        expect(stage.maxTotalMintableByWallet).to.be.equal('3');
        expect(stage.price).to.be.equal(toNano(6).toString());
      });
      it('should revert if any stage other than the last one has endTime=0', async () => {
        const { traceTree } = await locklift.tracing.trace(
          collection.methods.setMintStages({
            mintStages: [
              {
                startTime: newTimestamp("2023-05-21 12:50:00"),
                endTime: 0,
                maxTotalMintableByWallet: 3,
                price: toNano(6),
              },
              {
                startTime: newTimestamp("2023-05-21 12:50:00"),
                endTime: newTimestamp("2023-05-21 12:50:00"),
                maxTotalMintableByWallet: 3,
                price: toNano(6),
              }
            ],
          }).send({ from: owner.address, amount: toNano(6)}),
          {
            allowedCodes: {
              compute: [1030],
            },
          }
        );
        await expect(traceTree).to.have.error(1030);
      });
      it('should NOT revert if only the last stage has endTime=0', async () => {
        const { traceTree } = await locklift.tracing.trace(
          collection.methods.setMintStages({
            mintStages: [
              {
                startTime: newTimestamp("2023-05-21 12:50:00"),
                endTime: newTimestamp("2023-05-22 12:50:00"),
                maxTotalMintableByWallet: 3,
                price: toNano(6),
              },
              {
                startTime: newTimestamp("2023-05-23 12:50:00"),
                endTime: 0,
                maxTotalMintableByWallet: 3,
                price: toNano(6),
              }
            ],
          }).send({ from: owner.address, amount: toNano(6)}),
          {
            allowedCodes: {
              compute: [1030],
            },
          }
        );
        await expect(traceTree).to.not.have.error(1030);
      });
      it('should revert if there is a date overlap', async () => {
        const { traceTree } = await locklift.tracing.trace(
          collection.methods.setMintStages({
            mintStages: [
              {
                startTime: newTimestamp("2023-05-21 12:50:00"),
                endTime: newTimestamp("2023-05-23 12:50:00"),
                maxTotalMintableByWallet: 3,
                price: toNano(6),
              },
              {
                startTime: newTimestamp("2023-05-22 12:50:00"),
                endTime: newTimestamp("2023-05-25 12:50:00"),
                maxTotalMintableByWallet: 3,
                price: toNano(6),
              }
            ],
          }).send({ from: owner.address, amount: toNano(6)}),
          {
            allowedCodes: {
              compute: [1020],
            },
          }
        );
        await expect(traceTree).to.have.error(1020);
      });
      it('should revert if there the stages are not ordered chronologically', async () => {
        const { traceTree } = await locklift.tracing.trace(
          collection.methods.setMintStages({
            mintStages: [
              {
                startTime: newTimestamp("2023-05-24 12:50:00"),
                endTime: newTimestamp("2023-05-25 12:50:00"),
                maxTotalMintableByWallet: 3,
                price: toNano(6),
              },
              {
                startTime: newTimestamp("2023-05-21 12:50:00"),
                endTime: newTimestamp("2023-05-23 12:50:00"),
                maxTotalMintableByWallet: 3,
                price: toNano(6),
              },
            ],
          }).send({ from: owner.address, amount: toNano(6)}),
          {
            allowedCodes: {
              compute: [1020],
            },
          }
        );
        await expect(traceTree).to.have.error(1020);
      });
    });
  });
})
