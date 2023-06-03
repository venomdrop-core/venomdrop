import { Contract, Signer, toNano } from "locklift";
import { FactorySource } from "../build/factorySource";
import { createAccounts, deployVenomCollection, newTimestamp, setOngoingMintStages, setOutdatedMintStages } from "./utils";
import { Account } from "everscale-standalone-client";
import { expect } from "chai";

type VenomDropCollectionContract = Contract<FactorySource["VenomDropCollection"]>;

describe('VenomDropCollection: supply', async () => {
  let signers: Signer[];
  let accounts: Account[];
  // Owner
  let ownerSigner: Signer;
  let owner: Account;
  // Owner
  let minterSigner: Signer;
  let minter: Account;
  before(async () => {
    ({ signers, accounts } = await createAccounts(0, 3));
    [ownerSigner, minterSigner] = signers;
    [owner, minter] = accounts;
  });

  describe('mint', () => {
    const configure = async (collection: VenomDropCollectionContract, { hasMaxSupply, maxSupply }: { hasMaxSupply: boolean, maxSupply: number }) => {
      await collection.methods.multiconfigure({
        options: {
          hasMaxSupply,
          maxSupply,
          mintStages: [
            {
              name: 'Test',
              merkleTreeRoot: 0,
              startTime: 1,
              endTime: newTimestamp("2099-01-01 00:00:00"),
              price: 10,
            }
          ],
        }
      }).send({ from: owner.address, amount: toNano('6') });
    }
    const mint = async (collection: VenomDropCollectionContract, amount: number) => {
      return collection.methods.mint({ amount, proof: [] }).send({ from: minter.address, amount: toNano(6 * amount) });
    }
    const expectTotalSupply = async (collection: VenomDropCollectionContract, expectedTotalSupply: number) => {
      const { count: totalSupply } = await collection.methods.totalSupply({ answerId: 0 }).call();
      expect(parseInt(totalSupply)).to.be.equal(expectedTotalSupply);
    }
    describe('When hasMaxSupply=true and maxSupply=2', () => {
      describe('Single Mint: Test supply limits by single mints (one by one)', () => {
        let collection: VenomDropCollectionContract;
        before(async () => {
          collection = await deployVenomCollection(41, ownerSigner, owner.address);
          await configure(collection, { hasMaxSupply: true, maxSupply: 2 });
        });
        it('should mint NFT properly when there is available supply', async () => {
          // Mint 2 tokens
          await locklift.tracing.trace(mint(collection, 1));
          await locklift.tracing.trace(mint(collection, 1));
          await expectTotalSupply(collection, 2);
          const { info } = await collection.methods.getInfo().call();
          expect(info.hasMaxSupply).to.be.equal(true);
          expect(+info.maxSupply).to.be.equal(2);
          expect(+info.totalSupply).to.be.equal(2);
        });
        it('should revert if there is no supply available', async () => {
          const { traceTree } = await locklift.tracing.trace(
            mint(collection, 1),
            {
              allowedCodes: {
                compute: [1050],
              },
            }
          );
          await expect(traceTree).to.have.error(1050);
          await expectTotalSupply(collection, 2);
        });
      });
      describe('Bulk Mint: Test supply limits when mint amount > 1 (bulk)', () => {
        let collection: VenomDropCollectionContract;
        before(async () => {
          collection = await deployVenomCollection(42, ownerSigner, owner.address);
          await configure(collection, { hasMaxSupply: true, maxSupply: 2 });
        });
        it('should revert if there is no supply available', async () => {
          await expectTotalSupply(collection, 0);
          const { traceTree } = await locklift.tracing.trace(
            mint(collection, 3),
            {
              allowedCodes: {
                compute: [1050],
              },
            }
          );
          await expect(traceTree).to.have.error(1050);
          await expectTotalSupply(collection, 0);
        });
      });
    });
    describe('When hasMaxSupply=false', () => {
      describe('Single Mint: Test supply limits by single mints (one by one)', () => {
        let collection: VenomDropCollectionContract;
        before(async () => {
          collection = await deployVenomCollection(43, ownerSigner, owner.address);
          await configure(collection, { hasMaxSupply: false, maxSupply: 0 });
        });
        it('should mint NFT properly when there is available supply', async () => {
          // Mint 3 tokens
          await locklift.tracing.trace(mint(collection, 1));
          await locklift.tracing.trace(mint(collection, 1));
          await locklift.tracing.trace(mint(collection, 1));
          await expectTotalSupply(collection, 3);
        });
      });
      describe('Bulk Mint: Test supply limits when mint amount > 1 (bulk)', () => {
        let collection: VenomDropCollectionContract;
        before(async () => {
          collection = await deployVenomCollection(44, ownerSigner, owner.address);
          await configure(collection, { hasMaxSupply: false, maxSupply: 0 });
        });
        it('should NOT revert when bulk minting 20 tokens', async () => {
          await expectTotalSupply(collection, 0);
          const { traceTree } = await locklift.tracing.trace(
            mint(collection, 5),
            {
              allowedCodes: {
                compute: [1050],
              },
            }
          );
          await expect(traceTree).to.not.have.error(1050);
          await expectTotalSupply(collection, 5);
          const { info } = await collection.methods.getInfo().call();
          expect(info.hasMaxSupply).to.be.equal(false);
          expect(+info.maxSupply).to.be.equal(0);
          expect(+info.totalSupply).to.be.equal(5);
        });
      });
    });
  });
})
